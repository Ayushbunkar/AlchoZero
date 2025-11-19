import { findUserById, updateUser } from '../services/userService.js';
import { findDevicesByOwnerId } from '../services/deviceService.js';

export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const devices = await findDevicesByOwnerId(String(req.userId));
    const device = devices[0];
    return res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        threshold: user.threshold, 
        emergencyContact: user.emergencyContact 
      }, 
      deviceId: device?.id || null 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowed = ['name','threshold','emergencyContact'];
    const payload = Object.fromEntries(Object.entries(req.body || {}).filter(([k]) => allowed.includes(k)));
    const user = await updateUser(req.userId, payload);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        threshold: user.threshold, 
        emergencyContact: user.emergencyContact 
      } 
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
