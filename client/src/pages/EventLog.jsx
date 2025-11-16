import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
import { getEvents } from '../services/detectionService';
import { useDetection } from '../contexts/DetectionContext';

const EventLog = () => {
  const { events: liveEvents } = useDetection();
  const [initialEvents, setInitialEvents] = useState([]);
  const [search] = useSearchParams();
  const filterDeviceId = search.get('deviceId') || '';

  useEffect(() => {
    getEvents(filterDeviceId ? { deviceId: filterDeviceId } : {}).then(setInitialEvents);
  }, [filterDeviceId]);

  const all = useMemo(() => {
    const merged = [...liveEvents, ...initialEvents];
    if (!filterDeviceId) return merged;
    return merged.filter(e => (e.deviceId || '') === filterDeviceId);
  }, [liveEvents, initialEvents, filterDeviceId]);

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
          <div className="flex items-center gap-2">
            {filterDeviceId && (
              <div className="text-xs text-gray-300 bg-white/5 border border-white/10 rounded px-2 py-1">
                Filter: <span className="font-mono">{filterDeviceId}</span> • <Link to="/events" className="text-accent-yellow hover:underline">Clear</Link>
              </div>
            )}
            <Button variant="outline" onClick={downloadCsv}>Download CSV</Button>
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
                    <span className={`text-xs px-2 py-0.5 rounded border ${riskClass(e.risk)}`}>{e.risk || '—'}</span>
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
