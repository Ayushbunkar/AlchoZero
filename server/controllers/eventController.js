import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const { deviceId, limit } = req.query || {};
    const query = {};
    if (deviceId) query.deviceId = deviceId;
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
    const deviceId = req.query?.deviceId || undefined;
    const lim = Math.max(1, Math.min(parseInt(req.query?.limit || 10, 10) || 10, 100));
    const query = deviceId ? { deviceId } : {};
    const events = await Event.find(query).sort({ timestamp: -1 }).limit(lim).exec();
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
