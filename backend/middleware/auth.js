const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and protect routes
 * Extracts token from Authorization header: "Bearer <token>"
 * Verifies token and attaches user ID to req.userId
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object for use in route handlers
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Token verification failed
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }
};

module.exports = authMiddleware;
