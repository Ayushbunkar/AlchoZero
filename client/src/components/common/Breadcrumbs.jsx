import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const labelMap = {
  '': 'Home',
  about: 'About',
  contact: 'Contact',
  dashboard: 'Dashboard',
  events: 'Event Log',
  devices: 'Devices',
  settings: 'Settings',
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const parts = pathname.replace(/^\/+/, '').split('/');
  const crumbs = [];
  let acc = '';
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? '' : '/') + parts[i];
    const label = labelMap[parts[i]] || parts[i];
    crumbs.push({ to: '/' + acc, label });
  }
  if (crumbs.length === 0) crumbs.push({ to: '/', label: 'Home' });
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
      <ol className="flex gap-2 items-center">
        <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
        {crumbs.map((c, i) => (
          <li key={c.to} className="flex gap-2 items-center">
            <span>/</span>
            {i === crumbs.length - 1 ? (
              <span className="text-gray-300">{c.label}</span>
            ) : (
              <Link to={c.to} className="hover:text-gray-200">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
