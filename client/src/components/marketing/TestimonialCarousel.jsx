import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt3D from '../common/Tilt3D';

const TestimonialCarousel = ({ items = [] }) => {
  const [idx, setIdx] = useState(0);
  const onPrev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const onNext = () => setIdx((i) => (i + 1) % items.length);
  const t = items[idx] || {};
  return (
    <Tilt3D>
    <div className="relative bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-5 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black/20 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-accent-yellow">What users say</h3>
        <div className="flex gap-2">
          <button onClick={onPrev} className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/5">Prev</button>
          <button onClick={onNext} className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/5">Next</button>
        </div>
      </div>
      <div className="min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm text-gray-300">“{t.quote || '—'}”</p>
            <div className="text-xs text-gray-400 mt-2">— {t.author || 'Anonymous'}, {t.role || ''}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </Tilt3D>
  );
};

export default TestimonialCarousel;
