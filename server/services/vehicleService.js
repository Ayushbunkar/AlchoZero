/**
 * Firestore Vehicle Service
 * Replaces the Mongoose Vehicle model
 */

import { db } from '../config/firebase/firebaseAdmin.js';

const vehiclesCollection = db.collection('vehicles');

/**
 * Create a new vehicle
 */
export async function createVehicle(vehicleData) {
  const {
    licensePlate,
    model,
    deviceId,
    ownerId,
    currentDriverId = null,
    status = 'available',
  } = vehicleData;

  const vehicleDoc = {
    licensePlate,
    model,
    deviceId,
    ownerId,
    currentDriverId,
    status,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await vehiclesCollection.add(vehicleDoc);

  return { id: docRef.id, ...vehicleDoc };
}

/**
 * Find vehicle by ID
 */
export async function findVehicleById(vehicleId) {
  const doc = await vehiclesCollection.doc(vehicleId).get();
  
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Find vehicle by device ID
 */
export async function findVehicleByDeviceId(deviceId) {
  const snapshot = await vehiclesCollection
    .where('deviceId', '==', deviceId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Find vehicle by license plate
 */
export async function findVehicleByLicensePlate(licensePlate) {
  const snapshot = await vehiclesCollection
    .where('licensePlate', '==', licensePlate.toUpperCase())
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Find vehicles by owner ID
 */
export async function findVehiclesByOwnerId(ownerId) {
  const snapshot = await vehiclesCollection
    .where('ownerId', '==', ownerId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Update vehicle
 */
export async function updateVehicle(vehicleId, updates) {
  const vehicleRef = vehiclesCollection.doc(vehicleId);
  
  await vehicleRef.update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await vehicleRef.get();
  return { id: updated.id, ...updated.data() };
}

/**
 * Assign driver to vehicle
 */
export async function assignDriver(vehicleId, driverId) {
  return await updateVehicle(vehicleId, {
    currentDriverId: driverId,
    status: 'in-use',
  });
}

/**
 * Unassign driver from vehicle
 */
export async function unassignDriver(vehicleId) {
  return await updateVehicle(vehicleId, {
    currentDriverId: null,
    status: 'available',
  });
}

/**
 * Delete vehicle
 */
export async function deleteVehicle(vehicleId) {
  await vehiclesCollection.doc(vehicleId).delete();
}

/**
 * List all vehicles with pagination and filters
 */
export async function listVehicles(options = {}) {
  const { limit = 50, startAfter = null, ownerId = null, status = null } = options;

  let query = vehiclesCollection.orderBy('createdAt', 'desc');

  if (ownerId) {
    query = query.where('ownerId', '==', ownerId);
  }

  if (status) {
    query = query.where('status', '==', status);
  }

  query = query.limit(limit);

  if (startAfter) {
    const startDoc = await vehiclesCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export default {
  createVehicle,
  findVehicleById,
  findVehicleByDeviceId,
  findVehicleByLicensePlate,
  findVehiclesByOwnerId,
  updateVehicle,
  assignDriver,
  unassignDriver,
  deleteVehicle,
  listVehicles,
};
