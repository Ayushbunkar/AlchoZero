import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleGuard = ({ roles = [], children }) => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.map(r=>r.toLowerCase()).includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RoleGuard;