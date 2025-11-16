import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const Hero = ({ title, highlight, subtitle, primaryAction, secondaryAction, onPrimary, onSecondary, imageSrc, imageAlt = '', imageSide = 'right' }) => {
  const hasImage = Boolean(imageSrc);
  if (!hasImage) {
    return (
      <div className="text-center py-10 md:py-16">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title} <span className="text-accent-red">{highlight}</span>
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          className="flex justify-center gap-3 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {primaryAction && <Button variant="primary" onClick={onPrimary}>{primaryAction}</Button>}
          {secondaryAction && (
            <button
              className="px-4 py-2 rounded-lg text-sm border border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10"
              onClick={onSecondary}
            >
              {secondaryAction}
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  const imageFirst = imageSide === 'left';
  return (
    <div className="py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {imageFirst && (
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover" loading="eager" />
          </motion.div>
        )}
        <div className={imageFirst ? 'order-last md:order-none text-center md:text-left' : 'text-center md:text-left'}>
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title} <span className="text-accent-red">{highlight}</span>
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-gray-400 max-w-2xl mt-3 text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            className="flex justify-center md:justify-start gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {primaryAction && <Button variant="primary" onClick={onPrimary}>{primaryAction}</Button>}
            {secondaryAction && (
              <button
                className="px-4 py-2 rounded-lg text-sm border border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10"
                onClick={onSecondary}
              >
                {secondaryAction}
              </button>
            )}
          </motion.div>
        </div>
        {!imageFirst && (
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover" loading="eager" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;
