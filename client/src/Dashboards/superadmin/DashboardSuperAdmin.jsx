import StatsCards from '../../components/dashboard/StatsCards';
import EventTable from '../../components/dashboard/EventTable';
import DeviceList from '../../components/dashboard/DeviceList';
import UserList from '../../components/dashboard/UserList';
import { Link } from 'react-router-dom';
import Section from '../../components/common/Section';
import MotionInView from '../../components/common/MotionInView';

const DashboardSuperAdmin = () => {
  return (
    <div>
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Put governance first for SuperAdmin */}
            <MotionInView>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Administration</div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link to="/devices" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Manage Devices</Link>
                  <Link to="/users" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Manage Users</Link>
                  <Link to="/analytics" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Analytics</Link>
                  <Link to="/settings" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Platform Settings</Link>
                </div>
              </div>
            </MotionInView>
            <MotionInView><StatsCards /></MotionInView>
            <MotionInView><EventTable /></MotionInView>
          </div>
          <div className="space-y-4">
            <MotionInView><DeviceList /></MotionInView>
            <MotionInView><UserList /></MotionInView>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default DashboardSuperAdmin;
