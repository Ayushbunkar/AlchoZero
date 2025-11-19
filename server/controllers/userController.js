import { listUsers, findUserById, updateUser, createUser } from '../services/userService.js';

export const getUser = async (req, res) => {
  try {
    // Get authenticated user (set by middleware)
    if (req.userId) {
      const user = await findUserById(req.userId);
      if (user) {
        return res.json(user);
      }
    }

    // Fallback: get any user (for backward compatibility)
    const users = await listUsers({ limit: 1 });
    let user = users[0];
    
    if (!user) {
      user = await createUser({ 
        name: "Default", 
        email: "default@example.com",
        password: "password123",
        role: "driver", 
        threshold: 0.7 
      });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const allowed = ["name", "email", "emergencyContact", "threshold"];
    const payload = Object.fromEntries(
      Object.entries(req.body || {}).filter(([k]) => allowed.includes(k))
    );

    const user = await updateUser(req.userId, payload);
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
