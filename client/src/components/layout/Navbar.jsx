import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SunMedium, Moon } from 'lucide-react';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-1 rounded-lg text-sm border-b-2 ${isActive ? 'border-accent-yellow text-white' : 'border-transparent text-gray-400 hover:text-white'}`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  // Close mobile menu on route change
  React.useEffect(() => { setOpen(false); }, [location.pathname]);
  return (
    <nav className="w-full bg-bg-subtle/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button aria-label="Toggle Menu" className="md:hidden text-accent-yellow" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <Link to="/home" className="text-accent-yellow font-semibold tracking-wide">AlchoZero</Link>
      </div>
      <div className={`flex-col md:flex-row md:flex ${open ? 'flex' : 'hidden'} md:items-center gap-2 absolute md:static left-0 right-0 top-full md:top-auto bg-bg-subtle md:bg-transparent px-4 md:px-0 py-3 md:py-0 border-b md:border-none border-white/10`}>        
  <NavItem to="/">Home</NavItem>
  <NavItem to="/about">About</NavItem>
  <NavItem to="/contact">Contact</NavItem>
  <NavItem to="/dashboard">Dashboard</NavItem>
        <button aria-label="Toggle Theme" onClick={toggleTheme} className="px-2 py-1 rounded-lg text-sm border border-white/10 text-gray-300 hover:text-white">
          {theme === 'neon' ? <Moon size={16} /> : <SunMedium size={16} />}
        </button>
        {user ? (
          <button onClick={logout} className="px-3 py-1 rounded-lg text-sm bg-accent-red text-white hover:bg-red-500">Logout {user.name}</button>
        ) : (
          <NavItem to="/login">Login</NavItem>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
