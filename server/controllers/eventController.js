import Event from "../models/Event.js";
import Device from "../models/Device.js";

export const getEvents = async (req, res) => {
  try {
    const { deviceId, limit, from, to } = req.query || {};
    const query = {};
    if (deviceId) query.deviceId = deviceId;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }
    const lim = Math.max(0, Math.min(parseInt(limit || 0, 10) || 0, 100));
    const cursor = Event.find(query).sort({ timestamp: -1 });
    if (lim) cursor.limit(lim);
    const events = await cursor.exec();
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getRecentEvents = async (req, res) => {
  try {
    // Provide a friendly alias with sane defaults
    const { deviceId, from, to } = req.query || {};
    const lim = Math.max(1, Math.min(parseInt(req.query?.limit || 10, 10) || 10, 100));
    const query = deviceId ? { deviceId } : {};
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }
    const events = await Event.find(query).sort({ timestamp: -1 }).limit(lim).exec();
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
      const device = await Device.findOne({ ownerId: String(req.userId) });
      targetId = device ? String(device._id) : undefined;
    }
    if (!targetId) return res.status(400).json({ message: 'deviceId required' });
    const riskLevel = Number(Math.random().toFixed(2));
    const evt = await Event.create({ deviceId: targetId, riskLevel, status: riskLevel >= 0.7 ? 'High Risk' : riskLevel >= 0.4 ? 'Possible Impairment' : 'Normal', message: 'Auto seeded' });
    return res.json(evt);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
