import { useEffect, useRef, useState } from 'react';

// Simulate receiving detection data every few seconds
export const useSocket = ({ intervalMs = 5000 } = {}) => {
  const [latest, setLatest] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // emit immediately
    const emit = () => {
      const confidence = Math.max(0, Math.min(1, Number((Math.random()).toFixed(2))));
      setLatest({ confidence });
    };
    emit();
    timerRef.current = setInterval(emit, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  return { latest };
};
