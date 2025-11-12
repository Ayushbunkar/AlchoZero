import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

const bgByType = {
  info: 'bg-blue-500',
  success: 'bg-accent-green',
  warning: 'bg-accent-yellow text-black',
  error: 'bg-accent-red',
};

const Toast = ({ open, message, type = 'info' }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className={`px-4 py-2 rounded-lg shadow-soft text-white ${bgByType[type]}`}> {message} </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
