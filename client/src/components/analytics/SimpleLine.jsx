import React from 'react';

const SimpleLine = ({ points = [], width = 520, height = 180, className = '' }) => {
  if (!points.length) return <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet" className={className}></svg>;
  const values = points.map(p => p.value || 0);
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const padX = 20, padY = 14;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const stepX = innerW / Math.max(1, points.length - 1);
  const yScale = (v) => {
    return padY + innerH - ((v - min) / (max - min || 1)) * innerH;
  };
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * stepX} ${yScale(p.value)}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={padX} x2={width - padX} y1={padY + innerH * t} y2={padY + innerH * t} stroke="rgba(255,255,255,0.06)" />
      ))}
      <path d={path} fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={padX + i * stepX} cy={yScale(p.value)} r="2.5" fill="#10b981" />
      ))}
      {/* x labels */}
      {points.map((p, i) => (
        <text key={`l-${i}`} x={padX + i * stepX} y={height - 2} fontSize="10" fill="#9ca3af" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
};

export default SimpleLine;
