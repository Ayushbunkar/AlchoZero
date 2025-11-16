import { NavLink } from 'react-router-dom';
import { Gauge, Cog, ScanFace, ListOrdered } from 'lucide-react';
import Tilt3D from '../common/Tilt3D';

const Item = ({ to, icon, children }) => {
  const Icon = icon;
  return (
    <Tilt3D intensity="subtle">
      <NavLink to={to} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
        <Icon size={18} />
        {children}
      </NavLink>
    </Tilt3D>
  );
};

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-56 bg-bg-subtle border-r border-white/10 p-4 text-gray-400">
      <div className="font-semibold text-white mb-3">Console</div>
      <div className="flex flex-col gap-1">
        <Item to="/dashboard" icon={Gauge}>Dashboard</Item>
        <Item to="/devices" icon={ScanFace}>Devices</Item>
        <Item to="/events" icon={ListOrdered}>Events</Item>
        <Item to="/settings" icon={Cog}>Settings</Item>
      </div>
    </aside>
  );
};

export default Sidebar;
