import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

//login page is a mock login for testing purposes
const Login = () => {
  const { login, user } = useAuth();
  const [name, setName] = useState('Ayush');
  const [role, setRole] = useState('Driver');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (e) => {
    e.preventDefault();
    login(name || 'Guest', role || 'Driver');
    const from = (location.state && location.state.from) || localStorage.getItem('last_protected') || '/dashboard';
    navigate(from, { replace: true });
  };

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Login (Mock)</h1>
      <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
            <option>Driver</option>
            <option>Admin</option>
            <option>SuperAdmin</option>
          </select>
        </div>
        <Button type="submit" variant="primary" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default Login;
