import { useEffect, useState } from 'react';
import { getEvents } from '../../services/dataService';
import Tilt3D from '../common/Tilt3D';

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getEvents().then((d) => { setEvents(d); setLoading(false); });
  }, []);

  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-accent-yellow">Recent Events</h3>
        {loading && <span className="text-xs text-gray-500">Loading...</span>}
      </div>
      <table className="w-full text-xs text-gray-300">
        <thead>
          <tr className="text-left text-gray-400 border-b border-white/10">
            <th className="py-2 px-2">Event ID</th>
            <th className="px-2">Type</th>
            <th className="px-2">Driver</th>
            <th className="px-2">Vehicle</th>
            <th className="px-2">Status</th>
            <th className="px-2">Detail</th>
            <th className="px-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.eventId} className="border-b border-white/5">
              <td className="py-2 px-2 font-mono">{e.eventId}</td>
              <td className="px-2">{e.eventType}</td>
              <td className="px-2">{e.driverId}</td>
              <td className="px-2">{e.vehicleId}</td>
              <td className="px-2">{e.status}</td>
              <td className="px-2">{e.metadata?.eventDetail}</td>
              <td className="px-2 whitespace-nowrap">{new Date(e.event_timestamp).toLocaleString()}</td>
            </tr>
          ))}
          {!loading && events.length === 0 && (
            <tr><td colSpan={7} className="py-4 text-center text-gray-500">No events</td></tr>
          )}
        </tbody>
      </table>
    </div>
    </Tilt3D>
  );
};

export default EventTable;
