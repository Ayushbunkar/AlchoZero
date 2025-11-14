import StatsCards from '../../components/dashboard/StatsCards';
import EventTable from '../../components/dashboard/EventTable';
import DeviceList from '../../components/dashboard/DeviceList';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useDetection } from '../../contexts/DetectionContext';

const DashboardDriver = () => {
  const { showToast } = useToast();
  const { confidence, status, threshold } = useDetection();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmHelp = () => { setConfirmOpen(false); showToast('Help request sent (mock).', 'success', 2500); };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Risk banner prioritized for driver */}
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Current Status</div>
            <div className={`text-xl font-semibold ${status === 'High Risk' ? 'text-accent-red' : status === 'Possible Impairment' ? 'text-accent-yellow' : 'text-accent-green'}`}>{status}</div>
            <div className="text-[11px] text-gray-400">Threshold: {Number(threshold).toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Confidence</div>
            <div className="text-2xl font-semibold text-white">{(Number(confidence) * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Quick actions up top */}
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex gap-2 items-center justify-between">
          <div className="text-sm text-gray-300">Quick Actions</div>
          <div className="space-x-2">
            <Button variant="danger">Notify Emergency Contact</Button>
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>Request Help</Button>
          </div>
        </div>

        <EventTable />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DeviceList />
          <StatsCards />
        </div>
      </div>
      <ConfirmDialog open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={confirmHelp} title="Request Help" message="Send a help request to your emergency contact?" />
    </div>
  );
};

export default DashboardDriver;
