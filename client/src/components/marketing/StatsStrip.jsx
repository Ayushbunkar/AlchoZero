import React from 'react';
import { motion } from 'framer-motion';
import Tilt3D from '../common/Tilt3D';

const Stat = ({ label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.4, delay }}
  >
    <Tilt3D maxTilt={6} scale={1.015}>
      <div className="text-center p-3 rounded-lg bg-black/30 border border-white/10">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-[11px] text-gray-400 mt-1">{label}</div>
      </div>
    </Tilt3D>
  </motion.div>
);

const StatsStrip = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <Stat key={s.label} {...s} delay={i * 0.05} />
      ))}
    </div>
  );
};

export default StatsStrip;
