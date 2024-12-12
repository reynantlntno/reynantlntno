// functions/add-skill.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

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
    const skills = database.collection('skills');

    const { name, icon } = JSON.parse(event.body);

    // Generate a unique skill ID
    let skillId = generateShortId(6);
    let existingSkill = await skills.findOne({ _id: skillId });

    while (existingSkill) {
      skillId = generateShortId(6);
      existingSkill = await skills.findOne({ _id: skillId });
    }

    // Save skill details to MongoDB
    const skillData = {
      _id: skillId,
      name: name,
      icon: icon,
      created_at: new Date(),
    };

    await skills.insertOne(skillData);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Skill added successfully!', skillId }),
    };
  } catch (error) {
    console.error('Error adding skill:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add skill' }),
    };
  } finally {
    await client.close();
  }
};

// Function to generate a short alphanumeric ID
function generateShortId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}