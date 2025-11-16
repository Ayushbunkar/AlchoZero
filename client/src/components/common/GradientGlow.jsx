import React from 'react';

// Decorative radial glow used behind hero content
// Uses a blurred elliptical radial-gradient with subtle ring lines
const GradientGlow = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-[-10%] flex justify-center ${className}`} aria-hidden>
      <div
        className="relative"
        style={{ width: '1200px', height: '600px' }}
      >
        {/* Soft radial glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 85%, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.15) 35%, rgba(37,99,235,0.0) 70%)',
            transform: 'translateZ(0)',
          }}
        />
        {/* Subtle concentric rings */}
        <div
          className="absolute inset-0 rounded-full opacity-30 mix-blend-screen"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 85%, rgba(255,255,255,0.10) 0 1px, rgba(255,255,255,0.0) 1px 28px)',
            maskImage: 'radial-gradient(ellipse 65% 50% at 50% 85%, black 40%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 50% at 50% 85%, black 40%, transparent 75%)',
            transform: 'translateZ(0)',
          }}
        />
      </div>
    </div>
  );
};

export default GradientGlow;
