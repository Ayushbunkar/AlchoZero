import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Gauge, Cog, ScanFace, ListOrdered, Users, BarChart3, X } from 'lucide-react';

const Item = ({ to, icon: Icon, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}
  >
    <Icon size={18} />
    {children}
  </NavLink>
);

const RoleSidebarMobile = ({ open, onClose }) => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: Gauge },
    ...(role === 'driver'
      ? [
          { to: '/events', label: 'Events', icon: ListOrdered },
        ]
      : role === 'admin'
      ? [
          { to: '/devices', label: 'Devices', icon: ScanFace },
          { to: '/events', label: 'Events', icon: ListOrdered },
          { to: '/users', label: 'Users', icon: Users },
          { to: '/settings', label: 'Settings', icon: Cog },
        ]
      : [
          { to: '/devices', label: 'Devices', icon: ScanFace },
          { to: '/events', label: 'Events', icon: ListOrdered },
          { to: '/users', label: 'Users', icon: Users },
          { to: '/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/settings', label: 'Settings', icon: Cog },
        ]),
  ];

  return (
    <div className={`md:hidden fixed left-0 right-0 bottom-0 top-14 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-bg-subtle border-r border-white/10 p-4 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-end mb-3">
          <button aria-label="Close" onClick={onClose} className="text-gray-300 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-1">
          {items.map((it) => (
            <Item key={it.to} to={it.to} icon={it.icon} onClick={onClose}>{it.label}</Item>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSidebarMobile;
