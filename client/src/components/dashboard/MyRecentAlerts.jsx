import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/detectionService';
import Tilt3D from '../common/Tilt3D';
import { useDetection } from '../../contexts/DetectionContext';

const riskBadge = (risk) => {
  const r = Number(risk || 0);
  if (r >= 0.7) return 'text-red-300 bg-red-500/10 border-red-500/20';
  if (r >= 0.4) return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
  return 'text-green-300 bg-green-500/10 border-green-500/20';
};

const MyRecentAlerts = ({ limit = 5 }) => {
  const { deviceId } = useDetection();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Prefer server-side filtering; fallback to unfiltered if nothing found
        const primary = await getEvents({ deviceId, limit });
        if (!mounted) return;
        if (deviceId && (!primary || primary.length === 0)) {
          const fallback = await getEvents({ limit });
          if (!mounted) return;
          setItems((fallback || []).slice(0, limit));
        } else {
          setItems((primary || []).slice(0, limit));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [deviceId, limit]);

  const title = useMemo(() => `My Recent Alerts${deviceId ? ` • ${deviceId}` : ''}`,[deviceId]);

  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-accent-yellow">{title}</h3>
        <div className="flex items-center gap-2">
          {loading && <span className="text-xs text-gray-500">Loading...</span>}
          {deviceId && (
            <Link to={`/events?deviceId=${encodeURIComponent(deviceId)}`} className="text-xs text-accent-yellow hover:underline">
              View all
            </Link>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        {items.map(e => (
          <div key={e.id} className="bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-gray-200">{e.action}</div>
              <span className={`text-[11px] px-2 py-0.5 rounded border ${riskBadge(e.risk)}`}>{(Number(e.risk)*100).toFixed(0)}%</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">{new Date(e.date).toLocaleString()}</div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500">No recent alerts.</div>
        )}
      </div>
    </div>
    </Tilt3D>
  );
};

export default MyRecentAlerts;
