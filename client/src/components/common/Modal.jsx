import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const dialog = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const Modal = ({ open, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" initial="hidden" animate="visible" exit="hidden" variants={backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div className="bg-bg-subtle rounded-xl w-full max-w-md shadow-soft border border-white/10 max-h-[75vh] flex flex-col" variants={dialog} onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-white/10 text-white shrink-0">
              <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="px-5 py-4 text-gray-200 overflow-y-auto flex-1">{children}</div>
            {footer && <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2 shrink-0">{footer}</div>}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
