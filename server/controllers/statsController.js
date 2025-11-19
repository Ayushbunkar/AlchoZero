import Event from '../models/Event.js';
import Device from '../models/Device.js';

// GET /api/drivers/me/stats
export const getMyDriverStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Find devices owned by this user
    const devices = await Device.find({ ownerId: String(userId) }).exec();
    const deviceIds = devices.map(d => String(d._id));

    // If no devices, return zeros
    if (!deviceIds.length) {
      return res.json({
        eventsCount: 0,
        avgRisk: null,
        drivingScore: null,
        avgSpeed: null,
        totalDistanceMeters: null,
        highRiskCount: 0,
        safePercentage: null,
        lastActive: null,
      });
    }

    // Query events for those devices; limit to last 90 days for performance
    const from = new Date();
    from.setDate(from.getDate() - 90);

    const events = await Event.find({ deviceId: { $in: deviceIds }, timestamp: { $gte: from } }).exec();

    const eventsCount = events.length;
    if (eventsCount === 0) {
      return res.json({ eventsCount: 0 });
    }

    let sumRisk = 0;
    let highRiskCount = 0;
    let speedSum = 0;
    let speedCount = 0;
    let distanceSum = 0;
    let distanceFound = false;
    let lastActive = null;

    for (const e of events) {
      const r = typeof e.riskLevel === 'number' ? e.riskLevel : (typeof e.risk === 'number' ? e.risk : 0);
      sumRisk += (typeof r === 'number' ? r : 0);
      if (r >= 0.7) highRiskCount++;
      if (typeof e.speed === 'number') { speedSum += e.speed; speedCount++; }
      if (typeof e.distanceDelta === 'number') { distanceSum += e.distanceDelta; distanceFound = true; }
      if (!lastActive || (e.timestamp && new Date(e.timestamp) > new Date(lastActive))) lastActive = e.timestamp;
    }

    const avgRisk = eventsCount ? (sumRisk / eventsCount) : null;
    const drivingScore = avgRisk !== null ? Math.max(0, 100 - Math.round(avgRisk * 100)) : null; // simple heuristic
    const avgSpeed = speedCount ? (speedSum / speedCount) : null;
    const totalDistanceMeters = distanceFound ? distanceSum : null;
    const safePercentage = eventsCount ? Math.round(((eventsCount - highRiskCount) / eventsCount) * 100) : null;

    return res.json({
      eventsCount,
      avgRisk: typeof avgRisk === 'number' ? Number(avgRisk.toFixed(3)) : null,
      drivingScore,
      avgSpeed: avgSpeed !== null ? Number(avgSpeed.toFixed(1)) : null,
      totalDistanceMeters: totalDistanceMeters !== null ? Math.round(totalDistanceMeters) : null,
      highRiskCount,
      safePercentage,
      lastActive,
    });
  } catch (e) {
    console.error('Error computing driver stats:', e);
    return res.status(500).json({ message: e.message });
  }
};

export default { getMyDriverStats };
