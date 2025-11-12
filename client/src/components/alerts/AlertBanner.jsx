import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AlertBanner = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          className="w-full bg-accent-red text-white px-4 py-2 rounded-lg shadow-soft border border-red-600"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AlertBanner;
