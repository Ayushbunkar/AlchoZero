import { useMobileSidebar } from '../../contexts/MobileSidebarContext';

const ConsoleSidebarTrigger = () => {
  const { setOpen } = useMobileSidebar();
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open Console Menu"
      className="fixed right-5 top-17 z-40 md:hidden px-3 py-2 rounded-lg bg-yellow-400 bg-accent-yellow text-black font-semibold text-sm border border-black/20 shadow-lg focus:outline-none focus:ring-2 ring-yellow-300/60"
      style={{ letterSpacing: 0.2 }}
    >
      ☰ 
    </button>
  );
};

export default ConsoleSidebarTrigger;
