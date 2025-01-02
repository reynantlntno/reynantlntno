const { MongoClient, ObjectId } = require('mongodb');

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

    if (!messageId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message ID is required.' }),
      };
    }

    await client.connect();
    const database = client.db('db_reynantlntno3008'); // Replace with your database name
    const collection = database.collection('anony_message'); // Replace with your collection name

    const result = await collection.deleteOne({ _id: new ObjectId(messageId) });

    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message deleted successfully!' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Message not found.' }),
      };
    }
  } catch (error) {
    console.error('Error deleting anonymous message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete message.' }),
    };
  } finally {
    await client.close();
  }
};