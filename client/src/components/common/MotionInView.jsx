import React from 'react';
import { motion } from 'framer-motion';

const MotionInView = ({ children, delay = 0, y = 12, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default MotionInView;
