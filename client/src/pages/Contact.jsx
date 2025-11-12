import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (em) => /\S+@\S+\.\S+/.test(em);
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast('Name required', 'error');
    if (!validateEmail(email)) return showToast('Invalid email', 'error');
    if (message.trim().length < 10) return showToast('Message too short (min 10 chars)', 'error');
    setSent(true);
    showToast('Message sent (mock)!', 'success', 2500);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-accent-yellow mb-4">Contact Us</h1>
      {sent ? (
        <div className="bg-bg-subtle border border-white/10 rounded-xl p-4 text-sm text-accent-green">Thanks! We'll get back to you (mock).</div>
      ) : (
        <form onSubmit={submit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200 min-h-28" />
          </div>
          <button className="px-4 py-2 rounded-lg bg-accent-yellow text-black text-sm" type="submit">Send</button>
        </form>
      )}
  {/* Toasts are handled globally by ToastProvider */}
    </div>
  );
};

export default Contact;
