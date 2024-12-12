// functions/get-certifications.js
const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const certifications = database.collection('certifications');

    const certList = await certifications.find({}).toArray();

    // No need to fetch images from Cloudinary, as the image URL is already stored in MongoDB

    return {
      statusCode: 200,
      body: JSON.stringify(certList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch certifications' }),
    };
  } finally {
    await client.close();
  }
};