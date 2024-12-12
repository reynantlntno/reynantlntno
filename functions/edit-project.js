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
    console.log('Received edit-project request:', event);

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
    const projects = database.collection('projects');

    const formData = await parseFormData(event);
    console.log('Parsed form data:', formData);

    const projectId = formData.fields['project-id'];

    if (!projectId) {
      console.error('Missing project ID');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Project ID is required' }),
      };
    }

    // Helper function to upload files to Cloudinary
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

    const screenshotUploadResults = await Promise.all(
      formData.files.map(file => {
        const fileId = `${uuidv4()}_${file.filename}`;
        return uploadToCloudinary(file.data, `projects/${projectId}`, fileId);
      })
    );

    const updateData = {
      $set: {
        name: formData.fields['project-name'],
        description: formData.fields['project-description'],
        technologies: formData.fields['project-technologies'],
        demoLink: formData.fields['project-demoLink'],
        updated_at: new Date(),
      },
    };

    if (screenshotUploadResults.length > 0) {
      updateData.$push = { screenshots: { $each: screenshotUploadResults.map(result => result.secure_url) } };
    }

    console.log('Updating project with data:', updateData);
    await projects.updateOne({ _id: projectId }, updateData);

    console.log('Project updated successfully!');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Project updated successfully!' }),
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update project' }),
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