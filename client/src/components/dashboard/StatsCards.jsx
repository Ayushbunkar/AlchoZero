import { useEffect, useState } from 'react';
import { getEvents, getDevices, getVehicles, getUsers } from '../../services/dataService';

const Stat = ({ label, value, accent = 'text-accent-yellow' }) => (
  <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
    <div className="text-[11px] text-gray-400 mb-1">{label}</div>
    <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
  </div>
);

const StatsCards = () => {
  const [counts, setCounts] = useState({ events: 0, devices: 0, vehicles: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [e, d, v, u] = await Promise.all([
          getEvents(),
          getDevices(),
          getVehicles(),
          getUsers(),
        ]);
        if (mounted) setCounts({ events: e.length, devices: d.length, vehicles: v.length, users: u.length });
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
