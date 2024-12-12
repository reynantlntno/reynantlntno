// functions/delete-project.js
const { MongoClient, ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const projects = database.collection('projects');

    const projectId = event.queryStringParameters._id;

    // Fetch the project to get the screenshots
    const project = await projects.findOne({ _id: projectId });
    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    // Delete screenshots from Cloudinary
    if (project.screenshots && project.screenshots.length > 0) {
      const publicIds = project.screenshots.map(url => {
        // Extract the public ID from the Cloudinary URL
        const parts = url.split('/');
        return parts[parts.length - 1].split('.')[0]; // Get the filename without extension
      });
      await cloudinary.api.delete_resources(publicIds, {
        resource_type: 'image',
        invalidate: true, // Invalidate CDN cache
      });
    }

    const result = await projects.deleteOne({ _id: projectId });

    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Project deleted' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete project' }),
    };
  } finally {
    await client.close();
  }
};