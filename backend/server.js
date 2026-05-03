/**
 * MERN Notes App - Backend Server (Fixed for Render)
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

// CORS (safe for dev + prod)
app.use(
  cors({
    origin: [
      'http://localhost:5173', // local frontend
      process.env.FRONTEND_URL // production frontend
    ].filter(Boolean),
    credentials: true,
  })
);

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is missing in environment variables');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // ❗ Do NOT exit → prevents 502 crash
  }
};

connectDB();

// ============================================
// ROUTES
// ============================================

// Root route (helps avoid 502 confusion)
app.get('/', (req, res) => {
  res.send('🚀 Notes API is running');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Prevent crash on async errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});