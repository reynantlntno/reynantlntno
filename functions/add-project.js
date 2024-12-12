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
    const projects = database.collection('projects');

    const formData = await parseFormData(event);

    // Generate a unique project ID
    let projectId = generateShortId(6);
    let existingProject = await projects.findOne({ _id: projectId });

    while (existingProject) {
      projectId = generateShortId(6);
      existingProject = await projects.findOne({ _id: projectId });
    }

    // Helper function to upload files to Cloudinary
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

    // Upload screenshots
    const screenshotUploadResults = await Promise.all(
      formData.files.map(file => {
        const fileId = `${uuidv4()}_${file.filename}`;
        return uploadToCloudinary(file.data, `projects/${projectId}`, fileId);
      })
    );

    // Save project details to MongoDB
    const projectData = {
      _id: projectId,
      name: formData.fields['project-name'],
      description: formData.fields['project-description'],
      technologies: formData.fields['project-technologies'], // Add technologies field
      demoLink: formData.fields['project-demoLink'], // Add demoLink field
      created_at: new Date(),
      screenshots: screenshotUploadResults.map(result => result.secure_url),
    };

    await projects.insertOne(projectData);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Project added successfully!', projectId }),
    };
  } catch (error) {
    console.error('Error adding project:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add project' }),
    };
  } finally {
    await client.close();
  }
};

// Function to parse multipart form data
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

// Function to generate a short alphanumeric ID
function generateShortId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
