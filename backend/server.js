/**
 * MERN Notes App - Backend Server
 * 
 * This is the main server file that sets up Express, MongoDB connection,
 * and defines all API routes.
 * 
 * Environment Variables Required:
 * - MONGO_URI: MongoDB connection string
 * - JWT_SECRET: Secret key for JWT tokens
 * - OPENAI_API_KEY: OpenAI API key for summarization
 * - PORT: Server port (default: 5000)
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Parse JSON request bodies
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
// Allow requests from frontend (adjust origin in production)
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'https://your-frontend.com'
      : 'http://localhost:5173', // Vite default port
    credentials: true,
  })
);

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit process if database connection fails
    process.exit(1);
  }
};

// Call database connection function
connectDB();

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Notes routes
app.use('/api/notes', notesRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Not Found handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  📝 MERN Notes App - Backend Server    ║
║  🚀 Running on http://localhost:${PORT}    ║
║  🗄️  MongoDB: Connected                ║
║  🔐 JWT Auth: Enabled                  ║
║  🤖 OpenAI Integration: Enabled        ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
