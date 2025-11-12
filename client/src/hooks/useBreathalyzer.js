import { useEffect, useState } from 'react';

// Simulate breathalyzer readings (e.g., BAC values 0.00 - 0.15)
export const useBreathalyzer = ({ intervalMs = 8000 } = {}) => {
  const [reading, setReading] = useState(0.0);

  useEffect(() => {
    const tick = () => {
      const val = Number((Math.random() * 0.15).toFixed(3));
      setReading(val);
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { reading };
};
