const mongoose = require('mongoose');
require('dotenv').config();

let cachedDb = null;

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} MongoDB connection
 */
async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedDb) {
    return cachedDb;
  }
  
  // Check if the MongoDB URI is defined
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Configure MongoDB Atlas connection options
  const clientOptions = { 
    serverApi: { 
      version: '1', 
      strict: true, 
      deprecationErrors: true 
    }
  };

  try {
    // Connect to database
    const client = await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    
    cachedDb = client.connection;
    
    // Test the connection with a ping
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");
    
    return cachedDb;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Define schemas
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded'],
    default: 'new'
  }
});

// Create models or get existing ones
const getModels = () => {
  const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
  const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
  const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
  
  return { Appointment, BlogPost, Message };
};

module.exports = {
  connectToDatabase,
  getModels
};