import { useEffect, useState } from 'react';
import { getDevices } from '../../services/dataService';
import Tilt3D from '../common/Tilt3D';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDevices().then(d => { setDevices(d); setLoading(false); }); }, []);

  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <h3 className="text-sm font-semibold text-accent-yellow mb-2">Devices {loading && <span className="text-gray-500 text-xs">Loading...</span>}</h3>
      <ul className="space-y-2 text-xs">
        {devices.map(dev => (
          <li key={dev.device_id} className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="flex justify-between"><span className="font-mono">{dev.device_id}</span><span className={dev.status==='ACTIVE'?'text-accent-green':'text-accent-red'}>{dev.status}</span></div>
            <div className="text-gray-400">Vehicle: {dev.VehicleId}</div>
            <div className="text-gray-500 text-[10px]">Last HB: {new Date(dev.lastHeartbeat).toLocaleTimeString()}</div>
          </li>
        ))}
        {!loading && devices.length===0 && <li className="text-gray-500">No devices.</li>}
      </ul>
    </div>
    </Tilt3D>
  );
};

export default DeviceList;
