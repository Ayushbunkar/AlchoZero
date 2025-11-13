import { useState } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import EventTable from '../components/dashboard/EventTable';
import DeviceList from '../components/dashboard/DeviceList';
import VehicleList from '../components/dashboard/VehicleList';
import UserList from '../components/dashboard/UserList';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const { showToast } = useToast();
  // Dashboard refactored to show domain data (events, devices, vehicles, users)
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRequestHelp = () => setConfirmOpen(true);
  const confirmHelp = () => {
    setConfirmOpen(false);
    showToast('Help request sent (mock).', 'success', 2500);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <StatsCards />
          <EventTable />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeviceList />
            <VehicleList />
          </div>
        </div>
        <div className="space-y-4">
          <UserList />
          <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex gap-2">
            <Button variant="danger">Notify Emergency Contact</Button>
            <Button variant="outline" onClick={handleRequestHelp}>Request Help</Button>
          </div>
        </div>
      </div>
  {/* Toasts are handled globally by ToastProvider */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmHelp}
        title="Request Help"
        message="Do you want to send a help request to your emergency contact?"
      />
    </div>
  );
};

export default Dashboard;
