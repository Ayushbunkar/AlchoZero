import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Vehicle from '../models/Vehicle.js';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const toClient = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'driver' } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email: email.toLowerCase(), role, passwordHash });
    // Create a personal device and vehicle for the user
    const device = await Device.create({ name: `${name}'s Device`, type: 'breathalyzer', status: 'active', ownerId: String(user._id) });
    await Vehicle.create({ licensePlate: `TEMP-${String(user._id).slice(-6).toUpperCase()}`, model: 'Demo', deviceId: String(device._id), currentDriverId: String(user._id) });
    const token = jwt.sign({ sub: String(user._id), role: user.role }, jwtSecret, { expiresIn: '7d' });
    return res.json({ user: toClient(user), token, deviceId: String(device._id) });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    // Ensure a personal device exists
    let device = await Device.findOne({ ownerId: String(user._id) });
    if (!device) {
      device = await Device.create({ name: `${user.name}'s Device`, type: 'breathalyzer', status: 'active', ownerId: String(user._id) });
      await Vehicle.create({ licensePlate: `TEMP-${String(user._id).slice(-6).toUpperCase()}`, model: 'Demo', deviceId: String(device._id), currentDriverId: String(user._id) });
    }
    const token = jwt.sign({ sub: String(user._id), role: user.role }, jwtSecret, { expiresIn: '7d' });
    return res.json({ user: toClient(user), token, deviceId: String(device._id) });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const forgot = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });
    // For demo: do not actually send email. Pretend success.
    return res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const hdr = req.headers.authorization || '';
    const [, token] = hdr.split(' ');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, jwtSecret);
    const newToken = jwt.sign({ sub: payload.sub, role: payload.role }, jwtSecret, { expiresIn: '7d' });
    return res.json({ token: newToken });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
