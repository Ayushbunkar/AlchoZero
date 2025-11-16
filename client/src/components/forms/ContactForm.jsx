import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { isValidEmail, isValidPhone } from '../../utils/validators';

const ContactForm = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = form;
    if (!name.trim()) return showToast('Name is required', 'error');
    if (!isValidEmail(email)) return showToast('Enter a valid email', 'error');
    if (phone && !isValidPhone(phone)) return showToast('Enter a valid phone number', 'error');
    if ((message || '').trim().length < 10) return showToast('Message must be at least 10 characters', 'error');
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      showToast('Thanks! We received your message (demo).', 'success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-bg-subtle border border-white/10 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="Optional" />
        </div>
        <div>
          <label className="text-xs text-gray-400">Subject</label>
          <input name="subject" value={form.subject || ''} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="Optional" />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400">Message</label>
        <textarea name="message" value={form.message} onChange={onChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200 min-h-32" />
      </div>
      <button disabled={submitting} className="px-4 py-2 rounded-lg bg-accent-yellow text-black text-sm disabled:opacity-60" type="submit">
        {submitting ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
};

export default ContactForm;
