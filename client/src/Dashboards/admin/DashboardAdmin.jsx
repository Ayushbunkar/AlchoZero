import StatsCards from '../../components/dashboard/StatsCards';
import EventTable from '../../components/dashboard/EventTable';
import DeviceList from '../../components/dashboard/DeviceList';
import UserList from '../../components/dashboard/UserList';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="space-y-4">
          {/* Admin prioritizes management panels */}
          <DeviceList />
          <UserList />
          <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
            <div className="text-sm font-semibold text-accent-yellow mb-2">Management</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link to="/devices" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Add/Configure Devices</Link>
              <Link to="/users" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Manage Users</Link>
            </div>
          </div>
        </div>
        <div className="xl:col-span-2 space-y-4">
          <StatsCards />
          <EventTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
