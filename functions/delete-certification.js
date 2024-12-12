// functions/delete-certification.js
const { MongoClient, ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('db_reynantlntno3008');
    const certifications = database.collection('certifications');

    const certificationId = event.queryStringParameters._id;

    // Fetch the certification to get the image public ID
    const certification = await certifications.findOne({ _id: certificationId });
    if (!certification) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Certification not found' }),
      };
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(certification.image, {
      resource_type: 'image',
      invalidate: true, // Invalidate CDN cache
    });

    const result = await certifications.deleteOne({ _id: certificationId });

    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Certification deleted' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Certification not found' }),
      };
    }
  } catch (error) {
    console.error('Error deleting certification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete certification' }),
    };
  } finally {
    await client.close();
  }
};