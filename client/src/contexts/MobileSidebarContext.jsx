import { createContext, useContext, useMemo, useState } from 'react';

const MobileSidebarContext = createContext({ open: false, setOpen: () => {} });

export const MobileSidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MobileSidebarContext.Provider value={value}>{children}</MobileSidebarContext.Provider>;
};

export const useMobileSidebar = () => useContext(MobileSidebarContext);
