const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
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
    const collection = database.collection('anony_message'); // Collection name updated to `anony_message`

    const { nickname, message } = JSON.parse(event.body);

    if (!nickname || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nickname and message are required.' }),
      };
    }

    const messageData = {
      nickname,
      message,
      created_at: new Date(),
    };

    await collection.insertOne(messageData);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process message.' }),
    };
  } finally {
    await client.close();
  }
};
