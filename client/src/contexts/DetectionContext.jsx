/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { statusFromConfidence } from '../utils/detection';
import { getRecentEvents } from '../services/detectionService';
import { api } from '../services/api';
import { useEventStream } from '../hooks/useEventStream';

const DetectionContext = createContext(null);

// The inline definition of statusFromConfidence has been removed.

export const DetectionProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem('device_id') || 'mock-123');
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
  // Moved showToast earlier to avoid temporal dead zone usage in effects/processLatest
  const { showToast } = useToast();

  const { event: streamEvent, error: streamError, connected: streamConnected } = useEventStream();
  const [usePolling, setUsePolling] = useState(true);

  const processLatest = (latest) => {
    if (!latest) return;
    const id = latest._id || latest.id;
    const conf = typeof latest?.riskLevel === 'number' ? latest.riskLevel : (typeof latest?.risk === 'number' ? latest.risk : 0);
    setConfidence(conf);
    const s = statusFromConfidence(conf);
    setStatus(s);
    setEvents((prev) => {
      const next = [latest, ...prev.filter(e => (e._id || e.id) !== id)].slice(0, 50);
      localStorage.setItem('d_events', JSON.stringify(next));
      return next;
    });
    if (notify && conf > threshold) {
      setToast({ id, message: 'High risk detected! Consider pulling over.', type: 'warning' });
      showToast('High risk detected! Consider pulling over.', 'warning', 3500);
      setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
    }
  };

  // Apply SSE events
  useEffect(() => {
    if (streamEvent) {
      processLatest(streamEvent);
      // Disable polling after first successful stream message
      if (usePolling) setUsePolling(false);
    }
  }, [streamEvent]);

  // Poll backend for latest event (fallback when SSE not connected)
  useEffect(() => {
    if (!usePolling) return;
    let timer;
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const evts = await getRecentEvents({ deviceId, limit: 1 });
        const latest = evts[0];
        if (!mounted) return;
        if (!latest) {
          try { await api.post('/events/seed', { deviceId }); } catch {}
          return;
        }
        processLatest(latest);
      } catch {
        // ignore
      }
    };
    fetchLatest();
    timer = setInterval(fetchLatest, 6000);
    return () => { mounted = false; clearInterval(timer); };
  }, [deviceId, notify, threshold, usePolling]);
  
  // If stream errors, re-enable polling (will already be enabled initially)
  useEffect(() => {
    if (streamError && !usePolling) {
      setUsePolling(true);
    }
  }, [streamError]);
  const { user } = useAuth();

  // Sync deviceId when authenticated user provides one (no reload needed)
  useEffect(() => {
    const d = user?.deviceId;
    if (d && d !== deviceId) {
      setDeviceId(d);
      localStorage.setItem('device_id', d);
    }
  }, [user?.deviceId]);

  // Remove previous simulated socket effect

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
