import drivers from '../data/mockDrivers.js';

// GET /api/drivers
export const listDrivers = async (req, res) => {
  try {
    const q = String(req.query.q || '').toLowerCase();
    const status = req.query.status;
    const minRisk = req.query.minRisk ? Number(req.query.minRisk) : null;
    const maxRisk = req.query.maxRisk ? Number(req.query.maxRisk) : null;
    let out = drivers.slice();
    if (q) {
      out = out.filter(d => (d.name + ' ' + d.vehicle + ' ' + d.id).toLowerCase().includes(q));
    }
    if (status) out = out.filter(d => String(d.status).toLowerCase() === String(status).toLowerCase());
    if (minRisk !== null) out = out.filter(d => d.riskScore >= minRisk);
    if (maxRisk !== null) out = out.filter(d => d.riskScore <= maxRisk);
    return res.json(out);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/drivers/:id
export const getDriver = async (req, res) => {
  try {
    const id = req.params.id;
    const d = drivers.find(x => x.id === id || x.id === String(id));
    if (!d) return res.status(404).json({ message: 'Driver not found' });
    // augment with some mock time-series events for charts
    const now = Date.now();
    d.trend = Array.from({ length: 14 }).map((_, i) => ({ ts: now - (13 - i) * 24 * 3600 * 1000, score: Math.min(100, Math.max(0, d.riskScore + (Math.random() - 0.5) * 20)) }));
    d.behavior7 = Array.from({ length: 7 }).map((_, i) => ({ day: i, value: Math.round(Math.random() * 10) }));
    // simulate current speed/engine fluctuations
    d.speed = Math.max(0, Math.round((d.speed || 0) + (Math.random() - 0.4) * 10));
    if (d.speed < 2) d.engineOn = false;
    else d.engineOn = true;
    return res.json(d);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// POST /api/drivers/:id/capture - simulate capturing last 5 photos for driver (admin action)
export const capturePhotos = async (req, res) => {
  try {
    // requireAuth middleware should have set req.userRole
    const role = (req.userRole || '').toLowerCase();
    if (!['admin','superadmin'].includes(role)) return res.status(403).json({ message: 'Forbidden' });
    const id = req.params.id;
    const d = drivers.find(x => x.id === id || x.id === String(id));
    if (!d) return res.status(404).json({ message: 'Driver not found' });
    // generate 5 simulated photo URLs using driver's photo as base with timestamp
    const now = Date.now();
    // create small SVG data-URI placeholders as captured photos
    const photos = Array.from({ length: 5 }).map((_, i) => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#0f172a'/><text x='50%' y='45%' fill='#fff' font-size='20' text-anchor='middle'>${d.name} - Capture</text><text x='50%' y='65%' fill='#cbd5e1' font-size='12' text-anchor='middle'>${new Date(now - i*1000).toLocaleString()}</text></svg>`;
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    });
    // prepend to lastPhotos and keep latest 20
    d.lastPhotos = (d.lastPhotos || []);
    d.lastPhotos = photos.concat(d.lastPhotos).slice(0, 20);
    return res.json({ lastPhotos: d.lastPhotos.slice(0,5) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
