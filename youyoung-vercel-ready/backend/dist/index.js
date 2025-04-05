// This is a simplified version of the backend index.js file for Vercel deployment
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youyoung';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// World ID verification endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { proof, action } = req.body;
    
    if (!proof || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Get app_id from environment variables
    const app_id = process.env.WORLD_APP_ID || 'app_b636a7e558dec2f33f8a449094f7b35e';
    
    // Verify the proof using the World ID API
    const response = await fetch('https://developer.worldcoin.org/api/v2/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...proof,
        app_id,
        action
      }),
    });
    
    const verifyResult = await response.json();
    
    if (response.ok && verifyResult.verified) {
      return res.status(200).json({
        success: true,
        message: 'Verification successful',
        data: {
          verified: true,
          nullifier_hash: proof.nullifier_hash
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Verification failed',
        error: verifyResult.code || verifyResult.detail || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error verifying World ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: error.message || 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Export for Vercel serverless deployment
module.exports = app;
