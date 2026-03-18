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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'AtlasRide'
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📂 Database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', rideRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
