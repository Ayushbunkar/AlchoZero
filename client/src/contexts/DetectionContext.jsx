/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext';
import { useSocket } from '../hooks/useSocket';
import { statusFromConfidence } from '../utils/detection';

const DetectionContext = createContext(null);

// The inline definition of statusFromConfidence has been removed.

export const DetectionProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState('mock-123');
  const [confidence, setConfidence] = useState(0.42);
  const [status, setStatus] = useState(statusFromConfidence(0.42));
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('d_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);
  const [threshold, setThreshold] = useState(() => {
    const saved = localStorage.getItem('d_threshold');
    return saved ? Number(saved) : 0.7;
  });
  const [notify, setNotify] = useState(() => localStorage.getItem('d_notify') === 'false' ? false : true);
  const [emergencyContact, setEmergencyContact] = useState(() => localStorage.getItem('d_emergency') || '9876543210');

  // Simulated socket stream
  const { latest } = useSocket({ intervalMs: 5000 });
  const { showToast } = useToast();

  useEffect(() => {
    if (latest == null) return;
    setConfidence(latest.confidence);
    const s = statusFromConfidence(latest.confidence);
    setStatus(s);
    // Push an event for log (keep last 50)
    const evt = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      risk: latest.confidence,
      deviceId,
      action: s === 'High Risk' ? 'Suggested Pull Over' : 'Monitoring',
      status: s,
    };
    setEvents((prev) => {
      const next = [evt, ...prev].slice(0, 50);
      localStorage.setItem('d_events', JSON.stringify(next));
      return next;
    });

    if (notify && latest.confidence > threshold) {
      setToast({ id: evt.id, message: 'High risk detected! Consider pulling over.', type: 'warning' });
      showToast('High risk detected! Consider pulling over.', 'warning', 3500);
      setTimeout(() => setToast((t) => (t?.id === evt.id ? null : t)), 3500);
    }
  }, [latest, deviceId, notify, threshold, showToast]);

  useEffect(() => localStorage.setItem('d_threshold', String(threshold)), [threshold]);
  useEffect(() => localStorage.setItem('d_notify', String(notify)), [notify]);
  useEffect(() => localStorage.setItem('d_emergency', emergencyContact), [emergencyContact]);

  const value = useMemo(
    () => ({ deviceId, setDeviceId, confidence, status, events, toast, setToast, threshold, setThreshold, notify, setNotify, emergencyContact, setEmergencyContact }),
    [deviceId, confidence, status, events, toast, threshold, notify, emergencyContact]
  );

  return <DetectionContext.Provider value={value}>{children}</DetectionContext.Provider>;
};

export const useDetection = () => {
  const ctx = useContext(DetectionContext);
  if (!ctx) throw new Error('useDetection must be used within DetectionProvider');
  return ctx;
};
