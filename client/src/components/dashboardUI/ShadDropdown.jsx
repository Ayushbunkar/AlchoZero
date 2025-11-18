import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ShadDropdown = ({ label, value, options = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 bg-bg-subtle border border-white/10 rounded px-3 py-2 text-sm">
        <span className="text-xs text-gray-200">{label}</span>
        <span className="ml-2 text-xs text-gray-400">{value || 'Any'}</span>
      </button>
      {open && (
        <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="absolute z-50 mt-2 bg-bg-subtle border border-white/10 rounded shadow-lg w-44 py-1">
          {options.map((o) => (
            <li key={o} onClick={() => { onChange(o === 'Any' ? '' : o); setOpen(false); }} className="px-3 py-2 text-sm hover:bg-white/5 cursor-pointer">{o}</li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default ShadDropdown;
