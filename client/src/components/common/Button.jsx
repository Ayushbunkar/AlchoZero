import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

// Simple button with variants
export const Button = ({ children, onClick, variant = 'primary', className = '', ...rest }) => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-soft disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';
  const variants = {
    primary: 'bg-yellow-400 bg-accent-yellow text-black hover:bg-yellow-300 border border-black/10 focus:ring-2 ring-accent-yellow/40',
    danger: 'bg-accent-red text-white hover:bg-red-500 focus:ring-2 ring-red-500/40',
    outline: 'border border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10 focus:ring-2 ring-accent-yellow/30',
  };
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </motion.button>
  );
};

export default Button;
