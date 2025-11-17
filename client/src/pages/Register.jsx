import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Driver' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const score = useMemo(() => {
    const p = form.password || '';
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0-5
  }, [form.password]);
  const strengthLabel = ['Very Weak','Weak','Okay','Good','Strong','Very Strong'][score] || 'Very Weak';
  const strongEnough = score >= 3 && (form.password?.length || 0) >= 8;

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError('All fields required.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!strongEnough) {
      setError('Password is not strong enough. Use 8+ chars with mixed case, numbers, and a symbol.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Create Account</h1>
      <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <input name="name" value={form.name} onChange={update} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <input name="email" type="email" value={form.email} onChange={update} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400">Password</label>
            <input name="password" type="password" value={form.password} onChange={update} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
            <div className="mt-2">
              <div className="h-1 w-full bg-white/10 rounded">
                <div className={`h-1 rounded ${score<=1?'bg-red-500':score===2?'bg-orange-400':score===3?'bg-yellow-400':score===4?'bg-green-500':'bg-emerald-500'}`} style={{ width: `${(score/5)*100}%` }} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Strength: {strengthLabel}</div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400">Confirm</label>
            <input name="confirm" type="password" value={form.confirm} onChange={update} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400">Role</label>
          <select name="role" value={form.role} onChange={update} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
            <option>Driver</option>
            <option>Admin</option>
            <option>SuperAdmin</option>
          </select>
        </div>
        {error && <div className="text-xs text-accent-red">{error}</div>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading || !strongEnough}>{loading ? 'Registering...' : 'Register'}</Button>
        <div className="text-xs text-gray-400 text-center">Already have an account? <Link to="/login" className="text-accent-yellow hover:underline">Login</Link></div>
      </form>
    </div>
  );
};

export default Register;