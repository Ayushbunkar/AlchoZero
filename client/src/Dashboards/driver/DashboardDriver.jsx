// Driver sees only personal status and actions; no admin panels
import Button from '../../components/common/Button';
import MyRecentAlerts from '../../components/dashboard/MyRecentAlerts';
import { useEffect, useState, useMemo } from 'react';
import { getEvents } from '../../services/detectionService';
import SimplePie from '../../components/analytics/SimplePie';
import SimpleBar from '../../components/analytics/SimpleBar';
import SimpleLine from '../../components/analytics/SimpleLine';
import ConfirmDialog from '../../components/common/ConfirmDialog';
// ...existing code...
import { useToast } from '../../contexts/ToastContext';
import { useDetection } from '../../contexts/DetectionContext';
import Section from '../../components/common/Section';
import MotionInView from '../../components/common/MotionInView';

const DashboardDriver = () => {
  const { showToast } = useToast();
  const { confidence, status, threshold, deviceId, events: localEvents } = useDetection();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const confirmHelp = () => { setConfirmOpen(false); showToast('Help request sent (mock).', 'success', 2500); };

  // Fetch only this driver's events; fallback to local context if backend is empty
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const ev = await getEvents({ deviceId, limit: 50 });
        if (!mounted) return;
        if (Array.isArray(ev) && ev.length > 0) {
          setEvents(ev);
        } else {
          setEvents(Array.isArray(localEvents) ? localEvents.slice(0, 50) : []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [deviceId, localEvents]);

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

  // Recent risk bar (last 8 events)
  const riskBar = useMemo(() => {
    return validEvents.slice(0, 8).map((e, i) => ({
      label: String(i+1),
      value: e.risk,
      id: e.id,
    })).reverse();
  }, [validEvents]);

    return (
      <div>
        <Section>
          <MotionInView>
            {/* Analytics for driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
                <div className="text-sm font-semibold text-accent-yellow mb-2">My Risk Distribution</div>
                <div className="w-full flex flex-col items-center min-w-0">
                  <div className="w-full max-w-[220px] min-w-0">
                    <SimplePie data={riskPie} colors={["#ef4444","#f59e0b","#10b981"]} size={180} />
                  </div>
                  <div className="mt-2 text-xs text-gray-300 space-y-1 w-full">
                    {(() => { const total = (riskPie[0]?.value||0)+(riskPie[1]?.value||0)+(riskPie[2]?.value||0)||1; return (
                      <>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#ef4444'}} /> High: {riskPie[0]?.value || 0} ({Math.round(((riskPie[0]?.value||0)/total)*100)}%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#f59e0b'}} /> Medium: {riskPie[1]?.value || 0} ({Math.round(((riskPie[1]?.value||0)/total)*100)}%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#10b981'}} /> Low: {riskPie[2]?.value || 0} ({Math.round(((riskPie[2]?.value||0)/total)*100)}%)</div>
                      </>
                    ); })()}
                  </div>
                </div>
              </div>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Recent Risk Levels</div>
                <div className="w-full max-w-[320px] min-w-0 overflow-x-auto">
                  <SimpleBar data={riskBar} width={320} height={120} />
                </div>
              </div>
            </div>
          </MotionInView>

          <MotionInView>
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center mt-4 min-w-0">
              <div className="text-sm font-semibold text-accent-yellow mb-2">Event Trend (last 10 days)</div>
              <div className="w-full max-w-[520px] min-w-0 overflow-x-auto">
                <SimpleLine points={byDay} width={520} height={160} />
              </div>
            </div>
          </MotionInView>

          <MotionInView>
            {/* Quick actions up top */}
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center justify-between">
              <div className="text-sm text-gray-300">Quick Actions</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="danger">Notify Emergency Contact</Button>
                <Button variant="outline" onClick={() => setConfirmOpen(true)}>Request Help</Button>
              </div>
            </div>
          </MotionInView>

          <MotionInView>
            {/* Driver dashboard: personal alerts only */}
            <MyRecentAlerts />
          </MotionInView>
        </Section>
        <ConfirmDialog open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={confirmHelp} title="Request Help" message="Send a help request to your emergency contact?" />
      </div>
    );
};

export default DashboardDriver;
