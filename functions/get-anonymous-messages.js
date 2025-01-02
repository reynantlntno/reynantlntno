const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008'); // Replace with your database name
    const collection = database.collection('anony_message'); // Replace with your collection name

    const messages = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error('Error fetching anonymous messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch messages.' }),
    };
  } finally {
    await client.close();
  }
};