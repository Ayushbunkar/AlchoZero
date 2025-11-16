import { useEffect, useState } from 'react';
import { getEvents, getDevices, getVehicles, getUsers } from '../../services/dataService';

import Tilt3D from '../common/Tilt3D';

const Stat = ({ label, value, accent = 'text-accent-yellow' }) => (
  <Tilt3D maxTilt={6} scale={1.02}>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="text-[11px] text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  </Tilt3D>
);

const StatsCards = () => {
  const [counts, setCounts] = useState({ events: 0, devices: 0, vehicles: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const results = await Promise.allSettled([
          getEvents(),
          getDevices(),
          getVehicles(),
          getUsers(),
        ]);
        if (!mounted) return;
        const [e, d, v, u] = results.map((r) => (r.status === 'fulfilled' ? r.value : []));
        setCounts({
          events: Array.isArray(e) ? e.length : 0,
          devices: Array.isArray(d) ? d.length : 0,
          vehicles: Array.isArray(v) ? v.length : 0,
          users: Array.isArray(u) ? u.length : 0,
        });
      } catch (err) {
        // Shouldn't reach here with allSettled, but guard anyway
        console.warn('StatsCards load failed:', err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const shimmer = (
    <div className="h-6 w-10 bg-white/10 rounded animate-pulse" aria-hidden />
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Events" value={loading ? shimmer : counts.events} accent="text-accent-yellow" />
      <Stat label="Devices" value={loading ? shimmer : counts.devices} accent="text-accent-green" />
      <Stat label="Vehicles" value={loading ? shimmer : counts.vehicles} accent="text-accent-blue" />
      <Stat label="Users" value={loading ? shimmer : counts.users} accent="text-accent-pink" />
    </div>
  );
};

export default StatsCards;
