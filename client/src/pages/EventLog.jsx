import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
import { getEvents } from '../services/detectionService';
import { useDetection } from '../contexts/DetectionContext';
import { getMyEvents } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EventLog = () => {
  const { events: liveEvents } = useDetection();
  const { user } = useAuth();
  const [search] = useSearchParams();
  const initialDeviceParam = search.get('deviceId') || '';
  const [filterDeviceId, setFilterDeviceId] = useState(initialDeviceParam);
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedEvents, setFetchedEvents] = useState([]);

  const mapEvent = (e) => {
    if (!e) return null;
    const riskLevel = typeof e.riskLevel === 'number' ? Number(e.riskLevel.toFixed(2)) : (typeof e.risk === 'number' ? Number(e.risk.toFixed(2)) : 0);
    return {
      id: e._id || e.id,
      date: e.timestamp || e.date || new Date().toISOString(),
      risk: riskLevel,
      status: e.status || (riskLevel >= 0.7 ? 'High Risk' : riskLevel >= 0.4 ? 'Possible Impairment' : 'Normal'),
      deviceId: e.deviceId || '—',
      action: riskLevel >= 0.7 ? 'Suggested Pull Over' : 'Monitoring'
    };
  };

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      let evs;
      const params = {};
      if (fFrom) params.from = fFrom;
      if (fTo) params.to = fTo;
      if (filterDeviceId) params.deviceId = filterDeviceId;
      // Drivers use scoped events; elevated roles may view all
      if (user?.role === 'Driver') {
        evs = await getMyEvents(params);
      } else {
        evs = await getEvents(params);
      }
      setFetchedEvents(evs.map(mapEvent).filter(Boolean));
    } catch (e) {
      setError(e.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterDeviceId]);

  // Auto refresh every 30s
  useEffect(() => {
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
  }, [filterDeviceId, fFrom, fTo, user?.role]);

  // If logged in as Driver, default the device filter to the driver's device id (if available)
  useEffect(() => {
    if (user?.role === 'Driver') {
      const deviceIdFromUser = user?.deviceId || localStorage.getItem('device_id') || '';
      if (deviceIdFromUser && !filterDeviceId) setFilterDeviceId(deviceIdFromUser);
    }
  }, [user]);

  const mergedLive = liveEvents.map(mapEvent).filter(Boolean);
  const all = useMemo(() => {
    const byId = new Map();
    [...mergedLive, ...fetchedEvents].forEach(ev => { if (ev && !byId.has(ev.id)) byId.set(ev.id, ev); });
    let arr = Array.from(byId.values());
    if (filterDeviceId) arr = arr.filter(e => e.deviceId === filterDeviceId);
    // Sort desc by date
    return arr.sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [mergedLive, fetchedEvents, filterDeviceId]);

  const riskClass = (risk) => {
    const r = String(risk || '').toLowerCase();
    if (r.includes('high')) return 'text-red-300 bg-red-500/10 border-red-500/20';
    if (r.includes('medium')) return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
    if (r.includes('low')) return 'text-green-300 bg-green-500/10 border-green-500/20';
    return 'text-gray-300 bg-white/5 border-white/10';
  };

  const downloadCsv = () => {
    const header = ['Date', 'Risk', 'Status', 'DeviceID', 'Action'];
    const rows = all.map((e) => [e.date, e.risk, e.status, e.deviceId, e.action]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h2 className="text-lg font-semibold text-accent-yellow">Event Log</h2>
            <span className="sm:hidden block"><Breadcrumbs /></span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              {filterDeviceId && (
                <div className="text-xs text-gray-300 bg-white/5 border border-white/10 rounded px-2 py-1">
                  Filter: <span className="font-mono">{filterDeviceId}</span> • <Link to="/events" className="text-accent-yellow hover:underline">Clear</Link>
                </div>
              )}
              <input
                type="date"
                value={fFrom}
                onChange={e => setFFrom(e.target.value ? `${e.target.value}T00:00:00.000Z` : '')}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-accent-yellow"
              />
              <input
                type="date"
                value={fTo ? fTo.slice(0,10) : ''}
                onChange={e => setFTo(e.target.value ? `${e.target.value}T23:59:59.999Z` : '')}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-accent-yellow"
              />
              <Button variant="outline" onClick={fetchData} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
              <Button variant="outline" onClick={downloadCsv}>Download CSV</Button>
            </div>
            {error && <div className="text-xs text-red-400">{error}</div>}
          </div>
        </div>
      </Section>
      <Section>
        {/* Mobile list (<= md) */}
        <MotionInView className="md:hidden grid gap-2">
          {all.map((e) => (
            <div key={e.id} className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-[13px] text-gray-300 font-medium">{e.deviceId || '—'}</div>
                <span className={`text-[11px] px-2 py-0.5 rounded border ${riskClass(e.risk)}`}>{e.risk || '—'}</span>
              </div>
              <div className="text-[11px] text-gray-400 mb-2">{new Date(e.date).toLocaleString()}</div>
              <div className="text-[13px] text-gray-200">{e.action || '—'}</div>
              <div className="mt-2 text-[11px] text-gray-400">Status: <span className="text-gray-200">{e.status || '—'}</span></div>
            </div>
          ))}
          {all.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">No events</div>
          )}
        </MotionInView>

        {/* Desktop table (md+) */}
        <MotionInView className="hidden md:block bg-bg-subtle rounded-xl border border-white/10 shadow-soft overflow-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="py-2 px-3 whitespace-nowrap">Date</th>
                <th className="px-3">Risk</th>
                <th className="px-3">Status</th>
                <th className="px-3">Device ID</th>
                <th className="px-3">Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {all.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                  <td className="px-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${riskClass(e.risk)}`}>{e.risk ?? '—'}</span>
                  </td>
                  <td className="px-3">{e.status || '—'}</td>
                  <td className="px-3">{e.deviceId || '—'}</td>
                  <td className="px-3">{e.action || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MotionInView>
      </Section>
    </div>
  );
};

export default EventLog;
