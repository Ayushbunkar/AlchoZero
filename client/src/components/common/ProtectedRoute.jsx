import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  // track last attempted protected path for redirect after login
  if (!user) localStorage.setItem('last_protected', location.pathname);
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

export default ProtectedRoute;
