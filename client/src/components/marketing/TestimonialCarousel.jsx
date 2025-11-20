// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Tilt3D from '../common/Tilt3D';

// const TestimonialCarousel = ({ items = [] }) => {
//   const [idx, setIdx] = useState(0);
//   const onPrev = () => setIdx((i) => (i - 1 + items.length) % items.length);
//   const onNext = () => setIdx((i) => (i + 1) % items.length);
//   const t = items[idx] || {};
//   return (
//     <Tilt3D>
//     <div className="relative bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-5 overflow-hidden">
//       <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black/20 to-transparent pointer-events-none" />
//       <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black/20 to-transparent pointer-events-none" />
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-semibold text-accent-yellow">What users say</h3>
//         <div className="flex gap-2">
//           <button onClick={onPrev} className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/5">Prev</button>
//           <button onClick={onNext} className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/5">Next</button>
//         </div>
//       </div>
//       <div className="min-h-[100px]">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.35 }}
//           >
//             <p className="text-sm text-gray-300">“{t.quote || '—'}”</p>
//             <div className="text-xs text-gray-400 mt-2">— {t.author || 'Anonymous'}, {t.role || ''}</div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//     </Tilt3D>
//   );
// };

// export default TestimonialCarousel;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt3D from "../common/Tilt3D";
import mockAvatar from "../../assets/images/testimonial-mock.svg";

const TestimonialCarousel = ({ items = [], autoPlay = true, delay = 3500 }) => {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef(null);

  const next = () => setIdx((i) => (i + 1) % items.length);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);

  // Auto slide logic
  useEffect(() => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(next, delay);
    return () => clearInterval(intervalRef.current);
  }, [idx]);

  // Pause autoslide on hover
  const pause = () => clearInterval(intervalRef.current);

  const t = items[idx] || {};

  return (
    <Tilt3D>
      <div
        className="relative bg-bg-subtle rounded-2xl border border-white/10 shadow-xl p-6 overflow-hidden group transition-all"
        onMouseEnter={pause}
        onMouseLeave={() => (intervalRef.current = setInterval(next, delay))}
      >
        {/* EDGE GRADIENTS */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-accent-yellow tracking-wide">
            What Users Say
          </h3>

          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="px-3 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              Prev
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="px-3 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        </div>

        {/* CONTENT SLIDE */}
        <div className="min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-3 mb-3">
                <motion.img
                  src={t.image || mockAvatar}
                  alt={t.author || 'User avatar'}
                  className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                />

                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {t.author || "Anonymous"}
                  </h4>
                  <p className="text-xs text-gray-400">{t.role}</p>

                  {/* RATING */}
                  <div className="flex">
                    {[...Array(t.stars || 5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUOTE */}
              <p className="text-sm text-gray-300 leading-relaxed">
                “{t.quote || "—"}”
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PROGRESS BAR INDICATORS */}
        <div className="flex gap-2 mt-5">
          {items.map((_, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{
                width: i === idx ? "32px" : "8px",
                opacity: i === idx ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
              className="h-1 rounded-full bg-yellow-500"
            />
          ))}
        </div>
      </div>
    </Tilt3D>
  );
};

export default TestimonialCarousel;
