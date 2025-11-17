import React from 'react';
import MotionInView from '../common/MotionInView';
import Tilt3D from '../common/Tilt3D';

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => (
  <MotionInView delay={delay}>
    <Tilt3D>
      <div className="p-4 rounded-xl bg-bg-subtle border border-white/10 shadow-soft transition-transform h-full flex flex-col min-h-[100px]">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={18} className="text-accent-yellow" />}
          <h3 className="text-accent-yellow font-medium text-sm">{title}</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed grow">{desc}</p>
      </div>
    </Tilt3D>
  </MotionInView>
);

const FeatureGrid = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
      {items.map((f, idx) => (
        <FeatureCard key={f.title} {...f} delay={idx * 0.05} />
      ))}
    </div>
  );
};

export default FeatureGrid;
