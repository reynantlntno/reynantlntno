// functions/get-skills.js
const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri); // No need for useNewUrlParser and useUnifiedTopology anymore

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const skills = database.collection('skills');

    const skillList = await skills.find({}).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(skillList),
    };
  } catch (error) {
    console.error('Error fetching skills:', error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch skills' }),
    };
  } finally {
    await client.close();
  }
};