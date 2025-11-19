import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, verifyUserCredentials } from '../services/userService.js';
import { createDevice, findDevicesByOwnerId } from '../services/deviceService.js';
import { createVehicle } from '../services/vehicleService.js';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const toClient = (u) => ({ id: u.id || u.uid, name: u.name, email: u.email, role: u.role });

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'driver', emergencyContact, threshold } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const exists = await findUserByEmail(email);
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    // Create user in Firestore and Firebase Auth
    const user = await createUser({ name, email, password, role, emergencyContact, threshold });
    
    // Create a personal device and vehicle for the user
    const device = await createDevice({ 
      name: `${name}'s Device`, 
      type: 'breathalyzer', 
      status: 'active', 
      ownerId: user.uid 
    });
    
    await createVehicle({ 
      licensePlate: `TEMP-${user.uid.slice(-6).toUpperCase()}`, 
      model: 'Demo', 
      deviceId: device.id, 
      ownerId: user.uid,
      currentDriverId: user.uid 
    });

    // Generate JWT token for backward compatibility
    const token = jwt.sign({ userId: user.uid, role: user.role }, jwtSecret, { expiresIn: '7d' });
    
    return res.json({ user: toClient(user), token, deviceId: device.id });
  } catch (err) {
    console.error('Register error', err);
    const message = err.message || 'Server error';
    return res.status(500).json({ message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    
    // Verify user credentials
    const user = await verifyUserCredentials(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Ensure a personal device exists
    let devices = await findDevicesByOwnerId(user.id || user.uid);
    let device = devices[0];
    
    if (!device) {
      device = await createDevice({ 
        name: `${user.name}'s Device`, 
        type: 'breathalyzer', 
        status: 'active', 
        ownerId: user.id || user.uid 
      });
      
      await createVehicle({ 
        licensePlate: `TEMP-${(user.id || user.uid).slice(-6).toUpperCase()}`, 
        model: 'Demo', 
        deviceId: device.id, 
        ownerId: user.id || user.uid,
        currentDriverId: user.id || user.uid 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id || user.uid, role: user.role }, jwtSecret, { expiresIn: '7d' });
    
    return res.json({ user: toClient(user), token, deviceId: device.id });
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
    const newToken = jwt.sign({ userId: payload.userId || payload.sub, role: payload.role }, jwtSecret, { expiresIn: '7d' });
    return res.json({ token: newToken });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
