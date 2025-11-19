import StatsCards from '../../components/dashboard/StatsCards';
import EventTable from '../../components/dashboard/EventTable';
import DeviceList from '../../components/dashboard/DeviceList';
import UserList from '../../components/dashboard/UserList';
import { Link } from 'react-router-dom';
import Section from '../../components/common/Section';
import MotionInView from '../../components/common/MotionInView';
import { useEffect, useState, useMemo } from 'react';
import { getEvents } from '../../services/detectionService';
import SimplePie from '../../components/analytics/SimplePie';
import SimpleBar from '../../components/analytics/SimpleBar';
import SimpleLine from '../../components/analytics/SimpleLine';
import AddDriverForm from '../../components/forms/AddDriverForm';
import { UserPlus } from 'lucide-react';

const DashboardAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const ev = await getEvents({ limit: 100 });
        if (mounted) setEvents(Array.isArray(ev) ? ev : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Normalize and filter events for charting
  const validEvents = useMemo(() => {
    return (Array.isArray(events) ? events : [])
      .filter(e => e && typeof e.risk !== 'undefined' && !isNaN(Number(e.risk)) && e.date)
      .map(e => ({
        ...e,
        risk: Number(e.risk),
        date: e.date,
        id: e.id || e._id || String(e.date),
      }));
  }, [events]);

  // Risk pie
  const riskPie = useMemo(() => {
    let high = 0, mid = 0, low = 0;
    for (const e of validEvents) {
      const r = e.risk;
      if (r >= 0.7) high++;
      else if (r >= 0.4) mid++;
      else low++;
    }
    return [
      { label: 'High', value: high },
      { label: 'Medium', value: mid },
      { label: 'Low', value: low },
    ];
  }, [validEvents]);

  // Trend line (by day)
  const byDay = useMemo(() => {
    const map = new Map();
    for (const e of validEvents) {
      const d = new Date(e.date);
      if (isNaN(d)) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).slice(-10).map(([label, value]) => ({ label: label.slice(5), value }));
  }, [validEvents]);

  // Recent risk bar (last 8 events, show risk % as value)
  const riskBar = useMemo(() => {
    return validEvents.slice(0, 8).map((e, i) => ({
      label: String(i+1),
      value: Math.round(e.risk * 100),
      id: e.id,
      risk: e.risk,
      date: e.date,
    })).reverse();
  }, [validEvents]);

  // Helper: get last event date
  const lastEventDate = validEvents.length > 0 ? new Date(validEvents[0].date).toLocaleString() : null;

  const handleDriverAdded = (driver) => {
    console.log('Driver added successfully:', driver);
    // Trigger event to refresh drivers list
    window.dispatchEvent(new CustomEvent('driverAdded', { detail: driver }));
  };

  return (
    <div>
      {/* Add Driver Button - Fixed position */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAddDriver(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent-yellow hover:bg-accent-yellow/90 text-bg-primary font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          title="Add New Driver"
        >
          <UserPlus size={20} />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Add Driver Form Modal */}
      <AddDriverForm
        open={showAddDriver}
        onClose={() => setShowAddDriver(false)}
        onSuccess={handleDriverAdded}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            {/* Admin prioritizes management panels */}
            <MotionInView><DeviceList /></MotionInView>
            <MotionInView><UserList /></MotionInView>
            <MotionInView>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Management</div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link to="/devices" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Add/Configure Devices</Link>
                  <Link to="/users" className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5">Manage Users</Link>
                </div>
              </div>
            </MotionInView>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {/* Analytics widgets */}
            <MotionInView>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pie Chart */}
                <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
                  <div className="text-sm font-semibold text-accent-yellow mb-2">Risk Distribution</div>
                  <div className="w-full flex flex-col items-center min-w-0">
                    <div className="w-full max-w-[180px] min-w-0">
                      {riskPie.every(s=>s.value===0) ? (
                        <div className="text-xs text-gray-500 text-center">No data</div>
                      ) : (
                        <SimplePie data={riskPie} colors={["#ef4444","#f59e0b","#10b981"]} size={140} />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-300 space-y-1 w-full">
                      {(() => { const total = (riskPie[0]?.value||0)+(riskPie[1]?.value||0)+(riskPie[2]?.value||0)||1; return (
                        <>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#ef4444'}} /> High: {riskPie[0]?.value || 0} ({Math.round(((riskPie[0]?.value||0)/total)*100)}%)</div>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#f59e0b'}} /> Medium: {riskPie[1]?.value || 0} ({Math.round(((riskPie[1]?.value||0)/total)*100)}%)</div>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#10b981'}} /> Low: {riskPie[2]?.value || 0} ({Math.round(((riskPie[2]?.value||0)/total)*100)}%)</div>
                          <div className="mt-2 text-gray-400">Total events: {validEvents.length}</div>
                          {lastEventDate && <div className="text-gray-400">Last event: {lastEventDate}</div>}
                        </>
                      ); })()}
                    </div>
                  </div>
                </div>
                {/* Bar Chart */}
                <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
                  <div className="text-sm font-semibold text-accent-yellow mb-2">Recent Risk Levels</div>
                  <div className="w-full max-w-[220px] min-w-0 overflow-x-auto">
                    {riskBar.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center">No data</div>
                    ) : (
                      <svg width="220" height="100" viewBox="0 0 220 100" style={{width:'100%'}}>
                        {riskBar.map((bar, i) => {
                          const max = 100;
                          const h = Math.round((bar.value / max) * 60);
                          const x = 20 + i * 25;
                          const y = 80 - h;
                          return (
                            <g key={bar.id}>
                              <rect x={x} y={y} width={18} height={h} rx="4" fill="#2563eb" />
                              <text x={x+9} y={y-4} textAnchor="middle" fontSize="10" fill="#fff">{bar.value}%</text>
                              <text x={x+9} y={95} textAnchor="middle" fontSize="10" fill="#9ca3af">{bar.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>
                  {riskBar.length > 0 && <div className="mt-2 text-xs text-gray-400">Most recent: {new Date(riskBar[0].date).toLocaleString()}</div>}
                </div>
                {/* Line Chart */}
                <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
                  <div className="text-sm font-semibold text-accent-yellow mb-2">Event Trend (10 days)</div>
                  <div className="w-full max-w-[260px] min-w-0 overflow-x-auto">
                    {byDay.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center">No data</div>
                    ) : (
                      <SimpleLine points={byDay} width={260} height={100} />
                    )}
                  </div>
                  {byDay.length > 0 && <div className="mt-2 text-xs text-gray-400">First: {byDay[0].label}, Last: {byDay[byDay.length-1].label}</div>}
                </div>
              </div>
            </MotionInView>
            <MotionInView><StatsCards /></MotionInView>
            <MotionInView><EventTable /></MotionInView>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default DashboardAdmin;
