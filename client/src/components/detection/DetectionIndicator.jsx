import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const DetectionIndicator = ({ confidence }) => {
  const pct = Math.round(confidence * 100);
  let color = 'bg-accent-green';
  if (confidence >= 0.7) color = 'bg-accent-red';
  else if (confidence >= 0.4) color = 'bg-accent-yellow';

  return (
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300 text-sm">Risk Meter</span>
        <span className="text-gray-400 text-xs">{confidence.toFixed(2)}</span>
      </div>
      <div className="h-4 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-400">{pct}% risk</div>
    </div>
  );
};

export default DetectionIndicator;
