import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({ name: "Default", role: "driver", threshold: 0.7 });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const allowed = ["name", "email", "role", "emergencyContact", "threshold"];
    const payload = Object.fromEntries(
      Object.entries(req.body || {}).filter(([k]) => allowed.includes(k))
    );

    const user = await User.findOneAndUpdate({}, payload, { new: true, upsert: true });
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
