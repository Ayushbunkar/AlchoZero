// Mock data services returning schema-compliant objects

export const getEvents = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    {
      eventId: 'e_998877',
      driverId: 'u_7741_RaviK',
      vehicleId: 'MH04TR1234',
      event_timestamp: '2025-11-11T11:19:21Z',
      location: { lat: 19.1234, lon: 72.9876 },
      eventType: 'DISTRACTION',
      metadata: { eventDetail: 'Phone Use Detected' },
      status: 'NEEDS_REVIEW',
    },
    {
      eventId: 'e_998878',
      driverId: 'u_7742_Anoop',
      vehicleId: 'MH04TR5678',
      event_timestamp: '2025-11-11T12:45:10Z',
      location: { lat: 19.076, lon: 72.8777 },
      eventType: 'DROWSINESS',
      metadata: { eventDetail: 'Yawning & Eye Closure' },
      status: 'REVIEWED_BY_MANAGER',
    },
  ];
};

export const getDevices = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    {
      device_id: 'd_112',
      VehicleId: 'MH04TR1234',
      lastHeartbeat: '2025-11-11T15:19:00Z',
      status: 'ACTIVE',
      config: {
        ear_threshold: 0.2,
        imu_g_force_threshold: 1.5,
        drowsy_time_window_sec: 120,
        drowsy_freq_per_window: 3,
        gps_update_interval_sec: 10,
        config_update_interval_sec: 3600,
        wifi_ssid: 'Idealab5g',
        wifi_password: 'Idea@lnct',
      },
    },
  ];
};

export const getVehicles = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    {
      licensePlate: 'MH-04-TR-1234',
      model: 'Tata Prima 2830.K',
      deviceId: 'd_112',
      currentDriverId: 'u_7741_RaviK',
      lastLocation: { lat: 19.076, lon: 72.8777 },
      lastSeen: '2025-11-11T15:18:00Z',
    },
  ];
};

export const getUsers = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    {
      name: 'Ravi Kumar',
      phone: '+919876543210',
      role: 'driver',
      vehicleId: 'MH04TR1234',
      emergencyContact: { name: 'Sita Kumar', phone: '+919876543211' },
      safetyScore: 85,
      createdAt: '2025-11-10T10:00:00Z',
    },
    {
      name: 'Anoop Singh',
      phone: '+919800000000',
      role: 'manager',
      vehicleId: null,
      emergencyContact: { name: 'Office', phone: '+911234567890' },
      safetyScore: 92,
      createdAt: '2025-11-09T12:00:00Z',
    },
  ];
};
