import { useEffect, useState } from 'react';
import { updateMe, bindDevice } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', threshold: 0.7, emergencyContact: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [bindId, setBindId] = useState('');
  const [binding, setBinding] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || '', threshold: user.threshold ?? 0.7, emergencyContact: user.emergencyContact || '' });
  }, [user]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.name === 'threshold' ? Number(e.target.value) : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const res = await updateMe(form);
      const u = res?.user;
      if (u) login(u.name, u.role, u.email); // reuse login setter to update context
      setMsg('Saved');
    } catch (err) {
      setMsg(err.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const doBind = async (e) => {
    e.preventDefault();
    if (!bindId) return;
    setBinding(true); setMsg('');
    try {
      const res = await bindDevice(bindId);
      if (res.deviceId) {
        login(user.name, user.role, user.email); // keep existing user; device sync handled by DetectionContext via localStorage
        localStorage.setItem('device_id', res.deviceId);
        setMsg('Device bound successfully');
      } else setMsg('Bind failed');
    } catch (err) {
      setMsg(err.message || 'Bind failed');
    } finally { setBinding(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Profile & Device</h1>
      <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Emergency Contact</label>
          <input name="emergencyContact" value={form.emergencyContact} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Threshold</label>
          <input name="threshold" type="number" step="0.01" min="0" max="1" value={form.threshold} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div className="text-xs text-gray-400">Device ID: {user?.deviceId || localStorage.getItem('device_id') || '—'}</div>
        <div className="pt-2 border-t border-white/10">
          <label className="text-xs text-gray-400">Bind Existing Device</label>
          <form onSubmit={doBind} className="flex gap-2 mt-1">
            <input value={bindId} onChange={(e)=>setBindId(e.target.value)} placeholder="Device ObjectId" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200 text-xs" />
            <button disabled={binding || !bindId} className="px-3 py-2 rounded-lg text-xs bg-accent-yellow text-black font-semibold disabled:opacity-50">{binding?'Binding…':'Bind'}</button>
          </form>
        </div>
        {msg && <div className="text-xs text-gray-300">{msg}</div>}
        <Button type="submit" variant="primary" className="w-full" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </form>
    </div>
  );
};

export default Profile;
