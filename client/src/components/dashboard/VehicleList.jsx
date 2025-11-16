import { useEffect, useState } from 'react';
import { getVehicles } from '../../services/dataService';
import Tilt3D from '../common/Tilt3D';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getVehicles().then(d => { setVehicles(d); setLoading(false); }); }, []);

  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <h3 className="text-sm font-semibold text-accent-yellow mb-2">Vehicles {loading && <span className="text-gray-500 text-xs">Loading...</span>}</h3>
      <ul className="space-y-2 text-xs">
        {vehicles.map(v => (
          <li key={v.licensePlate} className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="flex justify-between"><span className="font-mono">{v.licensePlate}</span><span className="text-gray-400">{v.model}</span></div>
            <div className="text-gray-400">Device: {v.deviceId} • Driver: {v.currentDriverId}</div>
            <div className="text-gray-500 text-[10px]">Last Seen: {new Date(v.lastSeen).toLocaleString()}</div>
          </li>
        ))}
        {!loading && vehicles.length===0 && <li className="text-gray-500">No vehicles.</li>}
      </ul>
    </div>
    </Tilt3D>
  );
};

export default VehicleList;
