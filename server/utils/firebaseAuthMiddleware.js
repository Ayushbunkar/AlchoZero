/**
 * Firebase Auth Middleware
 * Verifies Firebase ID tokens and JWT tokens (for backward compatibility)
 */

import { auth as adminAuth } from '../config/firebase/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to authenticate requests using Firebase ID token or JWT
 * Supports both Firebase Authentication and legacy JWT authentication
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Try Firebase Auth token first
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email;
      req.authMethod = 'firebase';
      
      // Load full user data
      const user = await findUserById(req.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user;
      return next();
    } catch (firebaseError) {
      // If Firebase token verification fails, try JWT (backward compatibility)
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.authMethod = 'jwt';
        
        // Load full user data
        const user = await findUserById(req.userId);
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        return next();
      } catch (jwtError) {
        // Both methods failed
        return res.status(401).json({ 
          message: 'Invalid or expired token',
          details: process.env.NODE_ENV === 'development' ? {
            firebase: firebaseError.message,
            jwt: jwtError.message
          } : undefined
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
}

/**
 * Middleware to verify user has required role(s)
 * Usage: requireRole('admin') or requireRole(['admin', 'superadmin'])
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role?.toLowerCase();
    const roles = allowedRoles.flat().map(r => r.toLowerCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: roles,
        current: userRole
      });
    }

    next();
  };
}

/**
 * Optional authentication - sets user if token is valid but doesn't fail if missing
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user
    }

    const token = authHeader.substring(7);

    // Try Firebase Auth
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email;
      req.authMethod = 'firebase';
      
      const user = await findUserById(req.userId);
      if (user) {
        req.user = user;
      }
    } catch (firebaseError) {
      // Try JWT
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.authMethod = 'jwt';
        
        const user = await findUserById(req.userId);
        if (user) {
          req.user = user;
        }
      } catch (jwtError) {
        // Both failed, continue without user
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue without user on error
  }
}

export default {
  authenticate,
  requireRole,
  optionalAuth,
};
