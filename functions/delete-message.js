const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb'); // Import ObjectId

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    if (event.httpMethod !== 'DELETE') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const messageId = event.queryStringParameters._id; 

    await client.connect();
    const database = client.db('db_reynantlntno3008'); // Replace with your database name
    const messages = database.collection('messages');

    const result = await messages.deleteOne({ _id: new ObjectId(messageId) }); // Use ObjectId

    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message deleted successfully!' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Message not found' }),
      };
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete message' }),
    };
  } finally {
    await client.close();
  }
};