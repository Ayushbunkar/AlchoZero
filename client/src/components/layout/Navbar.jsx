import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SunMedium, Moon, Menu } from 'lucide-react';
// MobileSidebarContext not needed for navbar menu toggle

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
  // Right hamburger now always toggles the navbar menu
  // Close mobile menu on route change
  React.useEffect(() => { setOpen(false); }, [location.pathname]);
  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  return (
    <>
    <nav className="w-full bg-bg-subtle/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-accent-yellow font-semibold tracking-wide">AlchoZero</Link>
      </div>
      {/* Right-aligned hamburger for mobile */}
      <button
        type="button"
        aria-label="Toggle Menu"
        aria-expanded={open}
        aria-controls="navbar-mobile-menu"
        className="md:hidden ml-auto mr-2 text-accent-yellow px-2 py-1 h-9 w-9 grid place-items-center rounded-lg focus:outline-none focus:ring-2 ring-accent-yellow/40"
        onClick={() => { setOpen((o) => !o); }}
      >
        <Menu size={18} />
      </button>
      <div id="navbar-mobile-menu" className={`flex-col md:flex-row md:flex ${open ? 'flex' : 'hidden'} md:items-center gap-2 absolute md:static left-0 right-0 top-full md:top-auto bg-bg md:bg-transparent px-4 md:px-0 py-3 md:py-0 border-b md:border-none border-white/10 shadow-xl z-60`}>
  <NavItem to="/">Home</NavItem>
  <NavItem to="/about">About</NavItem>
  <NavItem to="/contact">Contact</NavItem>
  {user && <NavItem to="/dashboard">Dashboard</NavItem>}
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
    {/* Backdrop when mobile nav menu is open */}
    {open && (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    )}
    </>
  );
};

export default Navbar;
