const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hyperscale_saas';

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 20, // Connection pooling for enterprise scalability
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Connection error: ${error.message}. Running in resilient mode.`);
    return null;
  }
};

module.exports = connectDB;

