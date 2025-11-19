import React from 'react';

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = (angle - 90) * Math.PI / 180;
  return { 
    x: cx + r * Math.cos(rad), 
    y: cy + r * Math.sin(rad) 
  };
};

const SimplePie = ({ data = [], colors = [], size = 180, stroke = 16, className = '' }) => {
  const total = data.reduce((a, b) => a + (b.value || 0), 0) || 1;
  // Add padding to prevent stroke overflow
  const padding = stroke / 2 + 2;
  const viewBoxSize = size + padding * 2;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const radius = size / 2;
  
  let currentAngle = 0;
  
  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width="100%"
      height="100%"
      style={{ maxWidth: '100%', minWidth: 0, display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* Background circle */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={radius} 
        fill="none" 
        stroke="rgba(255,255,255,0.05)" 
        strokeWidth={stroke} 
      />
      
      {/* Arc segments */}
      {data.map((d, i) => {
        if (!d.value || d.value <= 0) return null;
        
        const fraction = d.value / total;
        const angle = fraction * 360;
        
        if (angle < 0.5) return null; // Skip very small segments
        
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        // Calculate arc path
        const start = polarToCartesian(cx, cy, radius, startAngle);
        const end = polarToCartesian(cx, cy, radius, endAngle);
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
        ].join(' ');
        
        // Calculate midpoint for marker
        const midAngle = startAngle + angle / 2;
        const markerPos = polarToCartesian(cx, cy, radius, midAngle);
        
        currentAngle = endAngle;
        
        return (
          <g key={`${d.label}-${i}`}>
            <path
              d={pathData}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* Dot marker */}
            <circle
              cx={markerPos.x}
              cy={markerPos.y}
              r={1.8}
              fill="#fff"
              opacity="0.7"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default SimplePie;
