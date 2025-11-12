import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import { getEvents } from '../services/detectionService';
import { useDetection } from '../contexts/DetectionContext';

const EventLog = () => {
  const { events: liveEvents } = useDetection();
  const [initialEvents, setInitialEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setInitialEvents);
  }, []);

  const all = [...liveEvents, ...initialEvents];

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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-accent-yellow">Event Log</h2>
        <Button variant="outline" onClick={downloadCsv}>Download CSV</Button>
      </div>
      <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft overflow-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="py-2 px-3">Date</th>
              <th className="px-3">Risk</th>
              <th className="px-3">Status</th>
              <th className="px-3">Device ID</th>
              <th className="px-3">Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {all.map((e) => (
              <tr key={e.id} className="border-b border-white/5">
                <td className="py-2 px-3 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                <td className="px-3">{e.risk}</td>
                <td className="px-3">{e.status}</td>
                <td className="px-3">{e.deviceId}</td>
                <td className="px-3">{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventLog;
