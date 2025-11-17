import { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const { forgotPassword } = await import('../services/api');
      const res = await forgotPassword({ email });
      setMessage(res?.message || 'If that email exists, a reset link was sent.');
    } catch (err) {
      setError(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Reset Password</h1>
      <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        {error && <div className="text-xs text-accent-red">{error}</div>}
        {message && <div className="text-xs text-green-400">{message}</div>}
        <button type="submit" className="w-full px-4 py-2 rounded-lg text-sm bg-accent-yellow text-black font-semibold disabled:opacity-60" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        <div className="text-center text-xs text-gray-400">Remembered it? <Link to="/login" className="text-accent-yellow hover:underline">Back to login</Link></div>
      </form>
    </div>
  );
};

export default ResetPassword;