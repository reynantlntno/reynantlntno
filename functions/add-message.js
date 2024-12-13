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
    const messages = database.collection('messages'); 

    const { name, email, message } = JSON.parse(event.body);

    const messageData = {
      name: name,
      email: email,
      message: message,
      created_at: new Date(),
    };

    await messages.insertOne(messageData);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  } finally {
    await client.close();
  }
};