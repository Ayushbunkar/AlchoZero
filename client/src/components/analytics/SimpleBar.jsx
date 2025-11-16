import React from 'react';

// data: [{ label, value, id? }]
// onBarClick: (item, index) => void
const SimpleBar = ({ data = [], width = 420, height = 180, className = '', onBarClick }) => {
  const max = Math.max(1, ...data.map(d => d.value || 0));
  const barGap = 10;
  const barWidth = Math.max(6, (width - (data.length + 1) * barGap) / Math.max(1, data.length));
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {data.map((d, i) => {
        const h = Math.round(((d.value || 0) / max) * (height - 28));
        const x = barGap + i * (barWidth + barGap);
        const y = height - h - 16;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={h} rx="6" fill="rgba(37,99,235,0.9)" style={{cursor: onBarClick ? 'pointer' : 'default'}} onClick={onBarClick ? () => onBarClick(d, i) : undefined} />
            <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default SimpleBar;
