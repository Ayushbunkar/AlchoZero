import React, { useState } from 'react';

const FAQ = ({ items = [] }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-bg-subtle">
      {items.map((q, i) => (
        <div key={q.q}>
          <button
            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5"
            onClick={() => setOpen((o) => (o === i ? null : i))}
          >
            <span className="text-sm text-gray-200">{q.q}</span>
            <span className="text-xs text-gray-400">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className="px-4 pb-3 text-xs text-gray-400">{q.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
