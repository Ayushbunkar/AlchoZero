/**
 * Firestore Device Service
 * Replaces the Mongoose Device model
 */

import { db } from '../config/firebase/firebaseAdmin.js';

const devicesCollection = db.collection('devices');

/**
 * Create a new device
 */
export async function createDevice(deviceData) {
  const { name, type = 'breathalyzer', ownerId, status = 'active' } = deviceData;

  const deviceDoc = {
    name,
    type,
    ownerId,
    status,
    lastSeen: null,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await devicesCollection.add(deviceDoc);

  return { id: docRef.id, ...deviceDoc };
}

/**
 * Find device by ID
 */
export async function findDeviceById(deviceId) {
  const doc = await devicesCollection.doc(deviceId).get();
  
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Find devices by owner ID
 */
export async function findDevicesByOwnerId(ownerId) {
  const snapshot = await devicesCollection
    .where('ownerId', '==', ownerId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Update device
 */
export async function updateDevice(deviceId, updates) {
  const deviceRef = devicesCollection.doc(deviceId);
  
  await deviceRef.update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await deviceRef.get();
  return { id: updated.id, ...updated.data() };
}

/**
 * Delete device
 */
export async function deleteDevice(deviceId) {
  await devicesCollection.doc(deviceId).delete();
}

/**
 * List all devices with pagination and filters
 */
export async function listDevices(options = {}) {
  const { limit = 50, startAfter = null, ownerId = null, status = null } = options;

  let query = devicesCollection.orderBy('createdAt', 'desc');

  if (ownerId) {
    query = query.where('ownerId', '==', ownerId);
  }

  if (status) {
    query = query.where('status', '==', status);
  }

  query = query.limit(limit);

  if (startAfter) {
    const startDoc = await devicesCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Update device last seen timestamp
 */
export async function updateDeviceLastSeen(deviceId) {
  await devicesCollection.doc(deviceId).update({
    lastSeen: new Date(),
  });
}

export default {
  createDevice,
  findDeviceById,
  findDevicesByOwnerId,
  updateDevice,
  deleteDevice,
  listDevices,
  updateDeviceLastSeen,
};
