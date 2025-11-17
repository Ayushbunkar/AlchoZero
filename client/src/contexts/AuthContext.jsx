/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Auth context with simple mock login/logout
const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, register: () => {}, loginCredentials: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (name = 'Ayush', role = 'Driver', email) => setUser({ name, role, email });
  const logout = () => setUser(null);
  const register = async ({ name, email, password, role = 'Driver' }) => {
    // Lazy import to avoid circular
    const { registerUser } = await import('../services/api');
    const data = await registerUser({ name, email, password, role });
    const newUser = data.user || { name, email, role };
    setUser(newUser);
    if (data.token) localStorage.setItem('auth_token', data.token);
    return newUser;
  };
  const loginCredentials = async ({ email, password }) => {
    const { loginUser } = await import('../services/api');
    const data = await loginUser({ email, password });
    const newUser = data.user || { name: email.split('@')[0], email, role: 'Driver' };
    setUser(newUser);
    if (data.token) localStorage.setItem('auth_token', data.token);
    return newUser;
  };

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const value = useMemo(() => ({ user, login, logout, register, loginCredentials }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
