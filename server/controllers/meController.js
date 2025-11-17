import User from '../models/User.js';
import Device from '../models/Device.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const device = await Device.findOne({ ownerId: String(req.userId) }).lean();
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, threshold: user.threshold, emergencyContact: user.emergencyContact }, deviceId: device?._id ? String(device._id) : null });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowed = ['name','threshold','emergencyContact'];
    const payload = Object.fromEntries(Object.entries(req.body || {}).filter(([k]) => allowed.includes(k)));
    const user = await User.findByIdAndUpdate(req.userId, payload, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, threshold: user.threshold, emergencyContact: user.emergencyContact } });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
