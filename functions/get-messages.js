const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008'); // Replace with your database name
    const messages = database.collection('messages');

    const messageList = await messages.find({}).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(messageList),
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch messages' }),
    };
  } finally {
    await client.close();
  }
};