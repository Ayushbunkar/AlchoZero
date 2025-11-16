import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
import { useDetection } from '../contexts/DetectionContext';
import { getDevices, getVehicles, addVehicle } from '../services/dataService';
import { useToast } from '../contexts/ToastContext';

const DeviceManagement = () => {
  const { deviceId, setDeviceId } = useDetection();
  const { showToast } = useToast();
  const [devices, setDevices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ licensePlate: '', model: '', deviceId: '', currentDriverId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [d, v] = await Promise.all([getDevices(), getVehicles()]);
      if (!mounted) return;
      setDevices(d);
      setVehicles(v);
      if (d[0]?.device_id) setForm((f) => ({ ...f, deviceId: d[0].device_id }));
    })();
    return () => { mounted = false; };
  }, []);

  const removeDevice = (id) => setDevices((d) => d.filter((x) => x.device_id !== id));

  const submitVehicle = async () => {
    const plate = form.licensePlate.trim();
    if (!plate) {
      showToast('License plate is required', 'warning');
      return;
    }
    const plateRe = /^[A-Za-z0-9\-\s]{4,20}$/;
    if (!plateRe.test(plate)) {
      showToast('Enter a valid license plate (4-20 chars)', 'warning');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        licensePlate: plate,
        model: form.model.trim() || undefined,
        deviceId: form.deviceId || undefined,
        currentDriverId: form.currentDriverId || undefined,
      };
      await addVehicle(payload);
      const v = await getVehicles();
      setVehicles(v);
      setForm({ licensePlate: '', model: '', deviceId: devices[0]?.device_id || '', currentDriverId: '' });
      showToast('Vehicle added', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add vehicle';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Section>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-accent-yellow">Device Management</h2>
          <Breadcrumbs />
        </div>
      </Section>
      <Section>
        <MotionInView className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
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
              <tr key={d.device_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2">{d.device_id}</td>
                <td>{d.VehicleId}</td>
                <td>{d.status}</td>
                <td>{deviceId === d.device_id ? 'Yes' : 'No'}</td>
                <td className="text-right space-x-2">
                  <Button variant="outline" onClick={() => setDeviceId(d.device_id)}>Activate</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </MotionInView>

        <MotionInView className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 mt-4">
          <h2 className="text-lg font-semibold text-accent-yellow mb-3">Add Vehicle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400">License Plate</label>
            <input value={form.licensePlate} onChange={(e)=>setForm(f=>({...f, licensePlate:e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="e.g. MH12 AB 1234" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Model</label>
            <input value={form.model} onChange={(e)=>setForm(f=>({...f, model:e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="e.g. Hyundai i20" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Attach Device</label>
            <select value={form.deviceId} onChange={(e)=>setForm(f=>({...f, deviceId:e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
              {devices.length === 0 && (<option value="">No devices</option>)}
              {devices.map(d => (<option key={d.device_id} value={d.device_id}>{d.device_id}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Current Driver (optional)</label>
            <input value={form.currentDriverId} onChange={(e)=>setForm(f=>({...f, currentDriverId:e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="driver id/name" />
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={submitVehicle} disabled={saving}>{saving ? 'Saving...' : 'Save Vehicle'}</Button>
        </div>
        <div className="mt-4">
          <div className="text-sm font-semibold text-accent-yellow mb-2">Existing Vehicles</div>
          <ul className="space-y-2 text-xs">
            {vehicles.map(v => (
              <li key={v.licensePlate} className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="flex justify-between"><span className="font-mono">{v.licensePlate}</span><span className="text-gray-400">{v.model}</span></div>
                <div className="text-gray-400">Device: {v.deviceId} • Driver: {v.currentDriverId || '—'}</div>
                <div className="text-gray-500 text-[10px]">Last Seen: {new Date(v.lastSeen).toLocaleString()}</div>
              </li>
            ))}
            {vehicles.length===0 && <li className="text-gray-500">No vehicles.</li>}
          </ul>
        </div>
        </MotionInView>
      </Section>
    </div>
  );
};

export default DeviceManagement;
