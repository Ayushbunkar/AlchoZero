import React from 'react';

const polarToCartesian = (cx, cy, r, angle) => {
  const a = (angle - 90) * Math.PI / 180.0;
  return { x: cx + (r * Math.cos(a)), y: cy + (r * Math.sin(a)) };
};

const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  // sweep-flag=1 for clockwise
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const SimplePie = ({ data = [], colors = [], size = 180, stroke = 18, className = '' }) => {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - stroke / 2;
  let accAngle = 0;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      style={{ maxWidth: '100%', minWidth: 0, display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      {data.map((d, i) => {
        if (!d.value) return null; // skip empty
        const fraction = d.value / total;
        const angle = fraction * 360;
        if (angle <= 0.01) return null; // too small to render
        const startAngle = accAngle;
        const endAngle = accAngle + angle;
        const isFull = fraction >= 0.999; // draw full circle when 100%
        const path = !isFull ? arcPath(cx, cy, r, startAngle, endAngle) : null;
        const midAngle = isFull ? 270 : (startAngle + angle / 2);
        accAngle = endAngle;
        return (
          <g key={d.label}>
            {isFull ? (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors[i % colors.length]} strokeWidth={stroke} strokeLinecap="round" />
            ) : (
              <path d={path} fill="none" stroke={colors[i % colors.length]} strokeWidth={stroke} strokeLinecap="butt" />
            )}
            {/* small tick */}
            <circle cx={polarToCartesian(cx, cy, r, midAngle).x} cy={polarToCartesian(cx, cy, r, midAngle).y} r={1.2} fill="#fff" opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
};

export default SimplePie;
