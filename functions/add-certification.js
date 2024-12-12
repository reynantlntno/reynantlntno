// functions/add-certification.js
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
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const certifications = database.collection('certifications');

    const formData = await parseFormData(event);

    // Generate a unique certification ID
    let certificationId = generateShortId(6);
    let existingCertification = await certifications.findOne({ _id: certificationId });

    while (existingCertification) {
      certificationId = generateShortId(6);
      existingCertification = await certifications.findOne({ _id: certificationId });
    }

    // Helper function to upload files to Cloudinary (same as in add-project.js)
    const uploadToCloudinary = (fileBuffer, folder, publicId) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, public_id: publicId, resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    };

    // Upload certification image
    const imageUploadResult = await uploadToCloudinary(
      formData.files[0].data, // Assuming only one image is uploaded
      `certifications/${certificationId}`,
      `${uuidv4()}_${formData.files[0].filename}`
    );

    // Save certification details to MongoDB
    const certificationData = {
      _id: certificationId,
      name: formData.fields['certification-name'], // Use 'certification-name' as the field name
      image: imageUploadResult.secure_url,
      created_at: new Date(),
    };

    await certifications.insertOne(certificationData);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Certification added successfully!', certificationId }),
    };
  } catch (error) {
    console.error('Error adding certification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add certification' }),
    };
  } finally {
    await client.close();
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

// Function to generate a short alphanumeric ID (same as in add-project.js)
function generateShortId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}