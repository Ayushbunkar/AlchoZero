import { useAuth } from '../contexts/AuthContext';
import DashboardDriver from '../Dashboards/driver/DashboardDriver';
import DashboardAdmin from '../Dashboards/admin/DashboardAdmin';
import DashboardSuperAdmin from '../Dashboards/superadmin/DashboardSuperAdmin';

const RoleDashboard = () => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  if (role === 'superadmin' || role === 'super admin') return <DashboardSuperAdmin />;
  if (role === 'admin') return <DashboardAdmin />;
  return <DashboardDriver />;
};

export default RoleDashboard;
