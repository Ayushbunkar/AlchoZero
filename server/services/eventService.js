/**
 * Firestore Event Service
 * Replaces the Mongoose Event model
 */

import { db } from '../config/firebase/firebaseAdmin.js';

const eventsCollection = db.collection('events');

/**
 * Create a new event
 */
export async function createEvent(eventData) {
  const {
    deviceId,
    riskLevel = 'low',
    detectedValue,
    speed,
    distanceDelta,
    location,
    metadata = {},
  } = eventData;

  const eventDoc = {
    deviceId,
    riskLevel,
    detectedValue: detectedValue || null,
    speed: speed || null,
    distanceDelta: distanceDelta || null,
    location: location || null,
    metadata,
    timestamp: new Date(),
    createdAt: new Date(),
  };

  const docRef = await eventsCollection.add(eventDoc);

  return { id: docRef.id, ...eventDoc };
}

/**
 * Find event by ID
 */
export async function findEventById(eventId) {
  const doc = await eventsCollection.doc(eventId).get();
  
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Find events by device ID with pagination
 */
export async function findEventsByDeviceId(deviceId, options = {}) {
  const { limit = 50, startAfter = null, startDate = null, endDate = null } = options;

  let query = eventsCollection
    .where('deviceId', '==', deviceId)
    .orderBy('timestamp', 'desc');

  if (startDate) {
    query = query.where('timestamp', '>=', new Date(startDate));
  }

  if (endDate) {
    query = query.where('timestamp', '<=', new Date(endDate));
  }

  query = query.limit(limit);

  if (startAfter) {
    const startDoc = await eventsCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Find events by multiple device IDs
 */
export async function findEventsByDeviceIds(deviceIds, options = {}) {
  if (!deviceIds || deviceIds.length === 0) {
    return [];
  }

  const { limit = 50, startDate = null, endDate = null } = options;

  // Firestore 'in' queries support max 10 items
  const chunks = [];
  for (let i = 0; i < deviceIds.length; i += 10) {
    chunks.push(deviceIds.slice(i, i + 10));
  }

  const allEvents = [];

  for (const chunk of chunks) {
    let query = eventsCollection
      .where('deviceId', 'in', chunk)
      .orderBy('timestamp', 'desc');

    if (startDate) {
      query = query.where('timestamp', '>=', new Date(startDate));
    }

    if (endDate) {
      query = query.where('timestamp', '<=', new Date(endDate));
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    allEvents.push(...events);
  }

  // Sort all events by timestamp desc
  allEvents.sort((a, b) => {
    const timeA = a.timestamp?.toDate?.() || a.timestamp;
    const timeB = b.timestamp?.toDate?.() || b.timestamp;
    return timeB - timeA;
  });

  return allEvents.slice(0, limit);
}

/**
 * List all events with pagination and filters
 */
export async function listEvents(options = {}) {
  const { limit = 50, startAfter = null, riskLevel = null, startDate = null, endDate = null } = options;

  let query = eventsCollection.orderBy('timestamp', 'desc');

  if (riskLevel) {
    query = query.where('riskLevel', '==', riskLevel);
  }

  if (startDate) {
    query = query.where('timestamp', '>=', new Date(startDate));
  }

  if (endDate) {
    query = query.where('timestamp', '<=', new Date(endDate));
  }

  query = query.limit(limit);

  if (startAfter) {
    const startDoc = await eventsCollection.doc(startAfter).get();
    query = query.startAfter(startDoc);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Delete event
 */
export async function deleteEvent(eventId) {
  await eventsCollection.doc(eventId).delete();
}

/**
 * Get event statistics for device(s)
 */
export async function getEventStats(deviceIds, startDate = null, endDate = null) {
  const events = await findEventsByDeviceIds(deviceIds, { limit: 1000, startDate, endDate });

  if (events.length === 0) {
    return {
      total: 0,
      avgRisk: 0,
      avgSpeed: 0,
      totalDistance: 0,
      drivingScore: 100,
    };
  }

  const riskValues = {
    'low': 0.2,
    'medium': 0.5,
    'high': 0.8,
    'critical': 1.0,
  };

  let totalRisk = 0;
  let totalSpeed = 0;
  let speedCount = 0;
  let totalDistance = 0;

  events.forEach(event => {
    totalRisk += riskValues[event.riskLevel] || 0;
    
    if (event.speed != null && event.speed > 0) {
      totalSpeed += event.speed;
      speedCount++;
    }

    if (event.distanceDelta != null && event.distanceDelta > 0) {
      totalDistance += event.distanceDelta;
    }
  });

  const avgRisk = totalRisk / events.length;
  const avgSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
  const drivingScore = Math.max(0, Math.min(100, 100 - (avgRisk * 100)));

  return {
    total: events.length,
    avgRisk: parseFloat(avgRisk.toFixed(2)),
    avgSpeed: parseFloat(avgSpeed.toFixed(1)),
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    drivingScore: parseFloat(drivingScore.toFixed(1)),
  };
}

export default {
  createEvent,
  findEventById,
  findEventsByDeviceId,
  findEventsByDeviceIds,
  listEvents,
  deleteEvent,
  getEventStats,
};
