import React from 'react';
import { Home, Users, Bell, FileText, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Item = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-orange-100/10 text-accent-yellow' : 'text-gray-200 hover:bg-white/5'}`}>
    <Icon size={16} />
    <span className="text-sm">{label}</span>
  </NavLink>
);

const SidebarDashboard = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col gap-3 p-4 bg-bg-subtle border-r border-white/5">
      <div className="mb-3 text-accent-yellow font-semibold">Console</div>
      <nav className="flex flex-col gap-1">
        <Item to="/dashboard" icon={Home} label="Dashboard" />
        <Item to="/users" icon={Users} label="Drivers" />
        <Item to="/events" icon={Bell} label="Alerts" />
        <Item to="/analytics" icon={FileText} label="Reports" />
        <Item to="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};

export default SidebarDashboard;
