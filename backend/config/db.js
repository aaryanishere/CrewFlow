const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/crewflow';
    console.log(`Connecting to database at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local Database Connection failed: ${error.message}`);
    console.log(`Attempting to launch an in-memory MongoDB server fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      console.log(`In-Memory MongoDB Server started successfully at: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      
      // Store reference globally so it doesn't get garbage collected
      global.mongoServer = mongoServer;
    } catch (fallbackError) {
      console.error(`Database Connection Fallback Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
