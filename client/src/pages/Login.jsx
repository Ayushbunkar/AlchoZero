import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';

//login page is a mock login for testing purposes
const Login = () => {
  const { loginCredentials, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    try {
      await loginCredentials({ email, password });
      const from = (location.state && location.state.from) || localStorage.getItem('last_protected') || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  // Prefill from URL params: /login?email=test@example.com&auto=1 (legacy params ignored)
  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    const qEmail = params.get('email');
    const qAuto = params.get('auto');
    if (qEmail) setEmail(qEmail);
    if (qAuto && qEmail && !user) {
      loginCredentials({ email: qEmail, password: 'demo' }).then(() => {
        const from = (location.state && location.state.from) || localStorage.getItem('last_protected') || '/dashboard';
        navigate(from, { replace: true });
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Login</h1>
      <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        {error && <div className="text-xs text-accent-red">{error}</div>}
        <div className="text-right -mt-2">
          <Link to="/reset-password" className="text-xs text-gray-300 hover:text-white">Forgot password?</Link>
        </div>
        <Button type="submit" variant="primary" className="w-full">Login</Button>
        <div className="text-center text-xs text-gray-400">No account? <Link to="/register" className="text-accent-yellow hover:underline">Register</Link></div>
      </form>
    </div>
  );
};

export default Login;
