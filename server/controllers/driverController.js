// GET /api/drivers
export const listDrivers = async (req, res) => {
  try {
    // Return empty array since we're using Firebase on the frontend
    return res.json([]);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/drivers/:id
export const getDriver = async (req, res) => {
  try {
    // Return empty since we're using Firebase on the frontend
    return res.status(404).json({ message: 'Driver not found - using Firebase' });
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
    
    // Return empty since we're using Firebase
    return res.status(501).json({ message: 'Feature not implemented - using Firebase' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
