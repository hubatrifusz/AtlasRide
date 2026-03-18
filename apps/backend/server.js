require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const rideRoutes = require('./routes/rideRoutes');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON

// MongoDB Connection with proper async startup
const startServer = async () => {
  try {
    // Wait for MongoDB connection before starting server
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'AtlasRide',
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📂 Database: ${mongoose.connection.db.databaseName}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    // Routes (only register after DB is connected)
    app.use('/api', rideRoutes);
    
    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    console.error('💡 Check your MONGO_URI in .env file');
    process.exit(1); // Exit if can't connect to DB
  }
};

// Start the server
startServer();
