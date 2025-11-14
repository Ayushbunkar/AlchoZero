import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE = (process.env.TEST_API_URL || 'http://localhost:4500/api').replace(/\/$/, '');

const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  if (data !== undefined) console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
};

const fail = (msg, err) => {
  console.error(`\n[FAIL] ${msg}`);
  if (err?.response) console.error('Response:', err.response.status, err.response.data);
  else if (err?.message) console.error('Error:', err.message);
  process.exit(1);
};

try {
  log('Using BASE', BASE);

  // 1) Root sanity (optional)
  try {
    const root = await axios.get(BASE.replace(/\/api$/, '/'));
    log('GET /', root.data);
  } catch (_) {}

  // 2) Get or create default user
  const userRes = await axios.get(`${BASE}/users`);
  const user = userRes.data;
  log('GET /api/users', user);
  if (!user || typeof user !== 'object') throw new Error('User response invalid');

  // 3) Update user settings (threshold + contact)
  const updatedUserRes = await axios.put(`${BASE}/users/settings`, {
    threshold: 0.65,
    emergencyContact: process.env.EMERGENCY_EMAIL || 'test@example.com',
  });
  const updatedUser = updatedUserRes.data;
  log('PUT /api/users/settings', updatedUser);
  if (typeof updatedUser?.threshold !== 'number') throw new Error('User update failed');

  // 4) Add a device
  const deviceName = `Test Device ${Date.now()}`;
  const addDevRes = await axios.post(`${BASE}/devices/add`, { name: deviceName, type: 'camera' });
  const addedDevice = addDevRes.data;
  log('POST /api/devices/add', addedDevice);
  if (!addedDevice?._id) throw new Error('Device not created');

  // 5) List devices
  const devsRes = await axios.get(`${BASE}/devices`);
  const devices = devsRes.data;
  log('GET /api/devices (count)', Array.isArray(devices) ? devices.length : 0);

  // 6) Post a detection (high risk)
  const confidence = 0.82;
  const detRes = await axios.post(`${BASE}/detection/update`, {
    deviceId: addedDevice._id,
    confidence,
    status: 'INTOXICATION_POSSIBLE',
  });
  log('POST /api/detection/update', detRes.data);
  if (!detRes.data?.success) throw new Error('Detection not accepted');

  // 7) Fetch events and check latest
  const eventsRes = await axios.get(`${BASE}/events`);
  const events = eventsRes.data || [];
  log('GET /api/events (latest 1)', events[0] || null);
  if (!Array.isArray(events) || events.length === 0) throw new Error('Events not recorded');

  console.log('\nAll smoke checks passed ✅');
  process.exit(0);
} catch (err) {
  fail('Smoke test failed', err);
}
