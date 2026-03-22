/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * @async
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${mongooseConnection.connection.host}`);
    console.log(`✓ Database: ${mongooseConnection.connection.name}`);
    
    return mongooseConnection;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB database
 * @async
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');
  } catch (error) {
    console.error(`✗ MongoDB Disconnection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
