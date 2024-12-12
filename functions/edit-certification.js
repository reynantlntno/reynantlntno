const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const busboy = require('busboy');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    console.log('Received edit-certification request:', event);

    if (event.httpMethod !== 'PUT') {
      console.error('Invalid HTTP method:', event.httpMethod);
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('db_reynantlntno3008');
    const certifications = database.collection('certifications');

    const formData = await parseFormData(event);
    console.log('Parsed form data:', formData);

    const certificationId = formData.fields['certification-id'];

    if (!certificationId) {
      console.error('Missing certification ID');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Certification ID is required' }),
      };
    }

    // Helper function to upload files to Cloudinary (same as in add-project.js)
    const uploadToCloudinary = (fileBuffer, folder, publicId) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, public_id: publicId, resource_type: 'auto' },
          (error, result) => {
            if (error) {
              console.error('Error uploading to Cloudinary:', error);
              return reject(error);
            }
            console.log('Cloudinary upload result:', result);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    };

    let imageUploadResult = null;
    if (formData.files.length > 0) {
      console.log('Uploading new certification image');
      imageUploadResult = await uploadToCloudinary(
        formData.files[0].data,
        `certifications/${certificationId}`,
        `${uuidv4()}_${formData.files[0].filename}`
      );
    }

    const updateData = {
      $set: {
        name: formData.fields['certification-name'],
        updated_at: new Date(),
      },
    };

    if (imageUploadResult) {
      updateData.$set.image = imageUploadResult.secure_url;
    }

    console.log('Updating certification with data:', updateData);
    await certifications.updateOne({ _id: certificationId }, updateData);

    console.log('Certification updated successfully!');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Certification updated successfully!' }),
    };
  } catch (error) {
    console.error('Error updating certification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update certification' }),
    };
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

// Function to parse multipart form data (same as in add-project.js)
const parseFormData = (event) => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: event.headers });
    const fields = {};
    const files = [];

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];

      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        files.push({
          name,
          filename,
          encoding,
          mimeType,
          data: Buffer.concat(chunks),
        });
      });
    });

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('finish', () => {
      resolve({ fields, files });
    });

    bb.on('error', (err) => {
      reject(err);
    });

    bb.end(event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);
  });
};