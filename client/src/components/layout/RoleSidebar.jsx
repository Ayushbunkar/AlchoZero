import { useAuth } from '../../contexts/AuthContext';
import SidebarDriver from '../../Dashboards/driver/SidebarDriver';
import SidebarAdmin from '../../Dashboards/admin/SidebarAdmin';
import SidebarSuperAdmin from '../../Dashboards/superadmin/SidebarSuperAdmin';

const RoleSidebar = () => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  if (role === 'superadmin' || role === 'super admin') return <SidebarSuperAdmin />;
  if (role === 'admin') return <SidebarAdmin />;
  return <SidebarDriver />;
};

export default RoleSidebar;
