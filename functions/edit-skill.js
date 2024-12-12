const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    console.log('Received edit-skill request:', event);

    if (event.httpMethod !== 'PUT') {
      console.error('Invalid HTTP method:', event.httpMethod);
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('db_reynantlntno3008');
    const skills = database.collection('skills');

    const { skillId, name, icon } = JSON.parse(event.body);

    if (!skillId) {
      console.error('Missing skill ID');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Skill ID is required' }),
      };
    }

    const updateData = {
      $set: {
        name: name,
        icon: icon,
        updated_at: new Date(),
      },
    };

    console.log('Updating skill with data:', updateData);
    await skills.updateOne({ _id: skillId }, updateData);

    console.log('Skill updated successfully!');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Skill updated successfully!' }),
    };
  } catch (error) {
    console.error('Error updating skill:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update skill' }),
    };
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
};