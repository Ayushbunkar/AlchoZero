/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const ToastContext = createContext({ showToast: () => {} });

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    if (duration) setTimeout(() => remove(id), duration);
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className={`px-4 py-2 rounded-lg shadow-soft text-white ${t.type === 'warning' ? 'bg-accent-yellow text-black' : t.type === 'error' ? 'bg-accent-red' : t.type === 'success' ? 'bg-accent-green' : 'bg-blue-500'}`}>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
