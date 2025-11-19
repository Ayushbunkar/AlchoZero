import { listEvents, findEventsByDeviceId, findEventsByDeviceIds, createEvent } from '../services/eventService.js';
import { findDevicesByOwnerId } from '../services/deviceService.js';

export const getEvents = async (req, res) => {
  try {
    const { deviceId, limit, from, to } = req.query || {};
    const lim = Math.max(1, Math.min(parseInt(limit || 50, 10), 100));

    let events;

    if (deviceId) {
      // Get events for specific device
      events = await findEventsByDeviceId(deviceId, {
        limit: lim,
        startDate: from,
        endDate: to
      });
    } else {
      // Get all events (admin) or user's device events (driver)
      if (req.userId && req.user?.role === 'driver') {
        const devices = await findDevicesByOwnerId(req.userId);
        const deviceIds = devices.map(d => d.id);
        events = await findEventsByDeviceIds(deviceIds, {
          limit: lim,
          startDate: from,
          endDate: to
        });
      } else {
        events = await listEvents({
          limit: lim,
          startDate: from,
          endDate: to
        });
      }
    }

    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getRecentEvents = async (req, res) => {
  try {
    const { deviceId, from, to } = req.query || {};
    const lim = Math.max(1, Math.min(parseInt(req.query?.limit || 10, 10) || 10, 100));

    let events;

    if (deviceId) {
      events = await findEventsByDeviceId(deviceId, {
        limit: lim,
        startDate: from,
        endDate: to
      });
    } else if (req.userId && req.user?.role === 'driver') {
      const devices = await findDevicesByOwnerId(req.userId);
      const deviceIds = devices.map(d => d.id);
      events = await findEventsByDeviceIds(deviceIds, {
        limit: lim,
        startDate: from,
        endDate: to
      });
    } else {
      events = await listEvents({
        limit: lim,
        startDate: from,
        endDate: to
      });
    }

    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Create a random event for a user's device (demo ingestion)
export const seedEvent = async (req, res) => {
  try {
    const { deviceId } = req.body || {};
    let targetId = deviceId;
    
    if (!targetId && req.userId) {
      const devices = await findDevicesByOwnerId(req.userId);
      targetId = devices[0]?.id;
    }
    
    if (!targetId) return res.status(400).json({ message: 'deviceId required' });
    
    const riskLevelValue = Number(Math.random().toFixed(2));
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const riskLevel = riskLevelValue >= 0.8 ? 'critical' : riskLevelValue >= 0.6 ? 'high' : riskLevelValue >= 0.3 ? 'medium' : 'low';
    
    const evt = await createEvent({ 
      deviceId: targetId, 
      riskLevel,
      detectedValue: riskLevelValue,
      speed: Math.floor(Math.random() * 80) + 20,
      distanceDelta: Math.random() * 5,
      metadata: { 
        status: riskLevelValue >= 0.7 ? 'High Risk' : riskLevelValue >= 0.4 ? 'Possible Impairment' : 'Normal', 
        message: 'Auto seeded' 
      }
    });
    
    return res.json(evt);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
