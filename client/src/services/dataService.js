import { api } from './api';

// Live data from backend, shaped for current UI components

export const getEvents = async () => {
  const { data } = await api.get('/events');
  const events = Array.isArray(data) ? data : [];
  return events.map((e) => ({
    eventId: e._id,
    eventType: e.status || 'ALERT',
    driverId: '—',
    vehicleId: e.deviceId || '—',
    status: e.status || '—',
    metadata: { eventDetail: e.message || '' },
    event_timestamp: e.timestamp || e.createdAt || new Date().toISOString(),
  }));
};

export const getDevices = async () => {
  const { data } = await api.get('/devices');
  const devices = Array.isArray(data) ? data : [];
  return devices.map((d) => ({
    device_id: d._id,
    VehicleId: d.name || '—',
    lastHeartbeat: d.createdAt || new Date().toISOString(),
    status: (d.status || 'inactive').toUpperCase(),
    config: {},
  }));
};

export const getVehicles = async () => {
  // No vehicles API in backend yet; return empty list
  return [];
};

export const getUsers = async () => {
  const { data } = await api.get('/users');
  const user = data && typeof data === 'object' ? data : null;
  if (!user) return [];
  // Mock fallbacks for phone and vehicle make/plate when backend fields are absent
  const mockPhones = ['+91 98765 43210', '+91 91234 56789', '+91 98012 34567'];
  const mockVehicles = [
    { make: 'Maruti Suzuki Alto', plate: 'MH12 AB 1234' },
    { make: 'Hyundai i20', plate: 'DL05 CD 4321' },
    { make: 'Tata Nexon', plate: 'GJ01 EF 2468' },
    { make: 'Honda City', plate: 'KA02 GH 1357' },
  ];

  const pickBySeed = (arr, seedString) => {
    try {
      const s = String(seedString || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      return arr[s % arr.length];
    } catch {
      return arr[0];
    }
  };

  const phone = user.phone || user.mobile || user.contactNumber || pickBySeed(mockPhones, user._id || user.createdAt);
  const vehicleObj = user.vehicle || user.vehicleInfo || null;
  const vehicleDisplay =
    (vehicleObj && (vehicleObj.make || vehicleObj.model) && (vehicleObj.plate || vehicleObj.registration)
      ? `${vehicleObj.make || vehicleObj.model} (${vehicleObj.plate || vehicleObj.registration})`
      : (() => {
          const v = pickBySeed(mockVehicles, (user._id || user.createdAt || '') + phone);
          return `${v.make} (${v.plate})`;
        })());

  return [
    {
      name: user.name || 'Default',
      phone,
      role: user.role || 'driver',
      vehicleId: vehicleDisplay,
      emergencyContact: user.emergencyContact ? { name: '—', phone: user.emergencyContact } : null,
      safetyScore: user.safetyScore || 0,
      createdAt: user.createdAt || new Date().toISOString(),
    },
  ];
};
