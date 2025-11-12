import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

// Simple button with variants
export const Button = ({ children, onClick, variant = 'primary', className = '', as: Tag = 'button', ...rest }) => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-soft';
  const variants = {
    primary: 'bg-accent-yellow text-black hover:bg-yellow-300',
    danger: 'bg-accent-red text-white hover:bg-red-500',
    outline: 'border border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10',
  };
  return (
    <motion.button as={Tag} whileTap={{ scale: 0.95 }} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </motion.button>
  );
};

export default Button;
