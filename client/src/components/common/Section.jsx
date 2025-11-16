import React from 'react';

const Section = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`w-full py-8 md:py-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h2 className="text-xl md:text-2xl font-semibold text-accent-yellow">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-400 mt-1 max-w-3xl">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
