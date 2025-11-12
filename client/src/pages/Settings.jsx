import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import { isValidThreshold, isNonEmpty } from '../utils/validators';
import { useAuth } from '../contexts/AuthContext';
import { useDetection } from '../contexts/DetectionContext';

const Settings = () => {
  const { user } = useAuth();
  const { threshold, setThreshold, notify, setNotify, emergencyContact, setEmergencyContact } = useDetection();
  const [name, setName] = useState(user?.name || '');
  const [driverId, setDriverId] = useState('DRV-001');

  useEffect(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      const obj = JSON.parse(saved);
      if (obj.name) setName(obj.name);
      if (obj.driverId) setDriverId(obj.driverId);
    }
  }, []);

  const save = () => {
    if (!isNonEmpty(name) || !isNonEmpty(driverId) || !isValidThreshold(threshold)) return;
    localStorage.setItem('profile', JSON.stringify({ name, driverId }));
    // Detection-related settings are persisted by DetectionContext effects
    alert('Settings saved.');
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-accent-yellow">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 space-y-3">
          <div className="text-gray-300 text-sm">User Profile (mock)</div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Driver Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Driver ID</label>
            <input value={driverId} onChange={(e) => setDriverId(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          </div>
        </div>
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 space-y-3">
          <div className="text-gray-300 text-sm">Risk Threshold</div>
          <input type="range" min={0} max={1} step={0.01} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
          <div className="text-xs text-gray-400">Current: {threshold.toFixed(2)}</div>
          <div className="text-gray-300 text-sm mt-2">Notifications</div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Enable alerts
          </label>
          <div className="text-gray-300 text-sm mt-2">Emergency Contact</div>
          <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          <div className="pt-2"><Button onClick={save}>Save</Button></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
