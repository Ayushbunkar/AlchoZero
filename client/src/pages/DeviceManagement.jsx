import { useState } from 'react';
import Button from '../components/common/Button';
import { useDetection } from '../contexts/DetectionContext';

const DeviceManagement = () => {
  const { deviceId, setDeviceId } = useDetection();
  const [devices, setDevices] = useState([
    { id: 'mock-123', type: 'Camera', status: 'Online' },
    { id: 'mock-124', type: 'Sensor Pack', status: 'Online' },
  ]);
  const [newId, setNewId] = useState('');

  const addDevice = () => {
    if (!newId.trim()) return;
    setDevices((d) => [...d, { id: newId.trim(), type: 'Sensor', status: 'Offline' }]);
    setNewId('');
  };
  const removeDevice = (id) => setDevices((d) => d.filter((x) => x.id !== id));

  return (
    <div className="p-4 space-y-4">
      <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
        <h2 className="text-lg font-semibold text-accent-yellow mb-3">Devices</h2>
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="py-2">ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id} className="border-b border-white/5">
                <td className="py-2">{d.id}</td>
                <td>{d.type}</td>
                <td>{d.status}</td>
                <td>{deviceId === d.id ? 'Yes' : 'No'}</td>
                <td className="text-right space-x-2">
                  <Button variant="outline" onClick={() => setDeviceId(d.id)}>Activate</Button>
                  <Button variant="danger" onClick={() => removeDevice(d.id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex gap-2">
          <input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="New device ID"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200 outline-none focus:ring-2 ring-accent-yellow"
          />
          <Button onClick={addDevice}>Add</Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceManagement;
