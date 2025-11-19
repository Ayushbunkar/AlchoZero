/**
 * Firestore User Service
 * Replaces the Mongoose User model
 */

import { db, auth as adminAuth } from '../config/firebase/firebaseAdmin.js';
import bcrypt from 'bcryptjs';

const usersCollection = db.collection('users');

/**
 * Create a new user in Firestore and Firebase Auth
 */
export async function createUser(userData) {
  const { email, password, name, role = 'driver', emergencyContact, threshold = 0.7 } = userData;

  // Create Firebase Auth user
  let firebaseUser;
  try {
    firebaseUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Email already registered');
    }
    throw error;
  }

  // Hash password for backup storage (optional)
  const passwordHash = await bcrypt.hash(password, 10);

  // Create Firestore document
  const userDoc = {
    uid: firebaseUser.uid,
    name,
    email: email.toLowerCase(),
    role: role.toLowerCase(),
    passwordHash, // Backup only, Firebase Auth handles authentication
    emergencyContact: emergencyContact || null,
    threshold: threshold || 0.7,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await usersCollection.doc(firebaseUser.uid).set(userDoc);

  return {
    uid: firebaseUser.uid,
    ...userDoc
  };
}

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  const snapshot = await usersCollection
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Find user by UID
 */
export async function findUserById(uid) {
  const doc = await usersCollection.doc(uid).get();
  
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Update user
 */
export async function updateUser(uid, updates) {
  const userRef = usersCollection.doc(uid);
  
  await userRef.update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await userRef.get();
  return { id: updated.id, ...updated.data() };
}

/**
 * Delete user
 */
export async function deleteUser(uid) {
  // Delete from Firebase Auth
  try {
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting Firebase Auth user:', error);
  }

  // Delete from Firestore
  await usersCollection.doc(uid).delete();
}

/**
 * List all users with pagination
 */
export async function listUsers(options = {}) {
  const { limit = 50, startAfter = null, role = null } = options;

  let query = usersCollection.orderBy('createdAt', 'desc').limit(limit);

  if (role) {
    query = query.where('role', '==', role.toLowerCase());
  }

  if (startAfter) {
    const startDoc = await usersCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Verify user credentials (for JWT-based auth)
 */
export async function verifyUserCredentials(email, password) {
  const user = await findUserByEmail(email);
  
  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  return isValid ? user : null;
}

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  listUsers,
  verifyUserCredentials,
};
