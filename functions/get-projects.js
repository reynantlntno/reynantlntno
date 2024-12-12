// functions/get-projects.js
const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const projects = database.collection('projects');

    const projectList = await projects.find({}).toArray();

    // No need to fetch images from Cloudinary, as the image URLs are already stored in MongoDB

    return {
      statusCode: 200,
      body: JSON.stringify(projectList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch projects' }),
    };
  } finally {
    await client.close();
  }
};