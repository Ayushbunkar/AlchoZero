import { findDevicesByOwnerId } from '../services/deviceService.js';
import { getEventStats, findEventsByDeviceIds } from '../services/eventService.js';

// GET /api/drivers/me/stats
export const getMyDriverStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Find devices owned by this user
    const devices = await findDevicesByOwnerId(userId);
    const deviceIds = devices.map(d => d.id);

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

    // Use event service to get stats
    const stats = await getEventStats(deviceIds, from, null);
    
    if (stats.total === 0) {
      return res.json({ eventsCount: 0 });
    }

    // Get recent events to find last active time and high risk count
    const events = await findEventsByDeviceIds(deviceIds, { 
      limit: 1000, 
      startDate: from 
    });

    const riskValues = { 'low': 0.2, 'medium': 0.5, 'high': 0.8, 'critical': 1.0 };
    let highRiskCount = 0;
    let lastActive = null;

    for (const e of events) {
      const riskValue = riskValues[e.riskLevel] || 0;
      if (riskValue >= 0.7) highRiskCount++;
      
      const eventTime = e.timestamp?.toDate?.() || e.timestamp;
      if (!lastActive || eventTime > lastActive) {
        lastActive = eventTime;
      }
    }

    const safePercentage = stats.total ? Math.round(((stats.total - highRiskCount) / stats.total) * 100) : null;

    return res.json({
      eventsCount: stats.total,
      avgRisk: stats.avgRisk,
      drivingScore: stats.drivingScore,
      avgSpeed: stats.avgSpeed,
      totalDistanceMeters: stats.totalDistance ? Math.round(stats.totalDistance) : null,
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
