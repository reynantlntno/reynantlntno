// functions/delete-skill.js 
const { MongoClient } = require('mongodb'); 

exports.handler = async function (event, context) { 
  const uri = process.env.MONGODB_URI; 
  const client = new MongoClient(uri); 

  try { 
    await client.connect(); 
    const database = client.db('db_reynantlntno3008'); 
    const skills = database.collection('skills'); 

    const skillId = event.queryStringParameters._id; // Get skill ID from query parameters 

    const result = await skills.deleteOne({ _id: skillId }); 

    if (result.deletedCount === 1) { 
      return { 
        statusCode: 200, 
        body: JSON.stringify({ message: 'Skill deleted' }), 
      }; 
    } else { 
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Skill not found' }), 
      }; 
    } 
  } catch (error) { 
    console.error('Error deleting skill:', error); 
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to delete skill' }), 
    }; 
  } finally { 
    await client.close(); 
  } 
};