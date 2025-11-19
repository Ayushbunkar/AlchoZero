// Legacy authMiddleware - redirects to Firebase Auth
// This file is kept for backward compatibility
import { authenticate as firebaseAuthenticate, optionalAuth as firebaseOptionalAuth } from './firebaseAuthMiddleware.js';

// Use Firebase Auth middleware
export const requireAuth = firebaseAuthenticate;
export const authenticate = firebaseAuthenticate;
export const optionalAuth = firebaseOptionalAuth;
