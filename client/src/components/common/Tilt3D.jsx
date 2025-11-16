import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Lightweight 3D tilt wrapper for cards/blocks
// Props:
// - maxTilt (deg), scale (hover)
// - intensity: 'subtle' | 'default' | 'active' (overrides maxTilt/scale)
// - disableOnTouch: boolean (default true)
const Tilt3D = ({ children, className = '', maxTilt = 8, scale = 1.02, intensity, disableOnTouch = true }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    // Detect coarse (touch) pointers to disable tilt by default
    try {
      const mq = window.matchMedia && window.matchMedia('(pointer: coarse)');
      const update = () => setIsCoarse(!!(mq && mq.matches));
      update();
      if (mq && mq.addEventListener) mq.addEventListener('change', update);
      return () => { if (mq && mq.removeEventListener) mq.removeEventListener('change', update); };
    } catch {
      setIsCoarse(false);
    }
  }, []);

  // Intensity presets override provided values
  let effectiveTilt = maxTilt;
  let effectiveScale = scale;
  if (intensity === 'subtle') { effectiveTilt = 4; effectiveScale = 1.01; }
  else if (intensity === 'active') { effectiveTilt = 10; effectiveScale = 1.04; }
  else if (intensity === 'default') { effectiveTilt = 8; effectiveScale = 1.02; }

  // Reduce tilt on small screens to avoid motion overload
  try {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      effectiveTilt = Math.max(2, Math.round(effectiveTilt * 0.6));
      effectiveScale = Math.min(1.03, Math.max(1.0, 1 + (effectiveScale - 1) * 0.6));
    }
  } catch {}

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - py) * (effectiveTilt * 2); // invert vertical for natural feel
    const ry = (px - 0.5) * (effectiveTilt * 2);
    setTilt({ x: rx, y: ry });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  const style = prefersReducedMotion
    ? {}
    : {
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      };

  const disabled = prefersReducedMotion || (disableOnTouch && isCoarse);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={disabled ? undefined : onMove}
      onMouseLeave={disabled ? undefined : reset}
      animate={disabled ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
      whileHover={disabled ? {} : { scale: effectiveScale }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default Tilt3D;
