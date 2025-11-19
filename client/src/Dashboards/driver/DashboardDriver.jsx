// Driver sees only personal status and actions; no admin panels
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import MyRecentAlerts from '../../components/dashboard/MyRecentAlerts';
import { useEffect, useState, useMemo } from 'react';
import { getMyEvents } from '../../services/api';
import { getMyDriverStats } from '../../services/api';
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
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const confirmHelp = () => { setConfirmOpen(false); showToast('Help request sent (mock).', 'success', 2500); };
  const navigate = useNavigate();

  // Fetch only this driver's events; fallback to local context if backend is empty
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const raw = await getMyEvents({ limit: 50 });
        if (!mounted) return;
        const ev = Array.isArray(raw) ? raw.map(e => ({
          id: e._id || e.id,
          date: e.timestamp || e.date || new Date().toISOString(),
          risk: typeof e.riskLevel === 'number' ? Number(e.riskLevel.toFixed(2)) : (typeof e.risk === 'number' ? e.risk : 0),
          deviceId: e.deviceId,
          status: e.status || (e.riskLevel >= 0.7 ? 'High Risk' : e.riskLevel >= 0.4 ? 'Possible Impairment' : 'Normal'),
          action: e.riskLevel >= 0.7 ? 'Suggested Pull Over' : 'Monitoring'
        })) : [];
        setEvents(ev);
      } catch {
        setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [deviceId, localEvents]);

  // Fetch summary stats for this driver
  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatsLoading(true);
      try {
        const s = await getMyDriverStats();
        if (!mounted) return;
        setStats(s || {});
      } catch (e) {
        setStats({});
      } finally {
        if (mounted) setStatsLoading(false);
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
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-10).map(([label, value]) => ({ label: label.slice(5), value }));
  }, [validEvents]);

  // Recent risk bar (last 8 events)
  const riskBar = useMemo(() => {
    return validEvents.slice(0, 8).map((e, i) => ({
      label: String(i + 1),
      value: e.risk,
      id: e.id,
    })).reverse();
  }, [validEvents]);

  return (
    <div>
      <Section>
        <MotionInView>
          {/* Top summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col">
              <div className="text-xs text-gray-400">Average Speed</div>
              <div className="text-2xl font-semibold mt-1">{statsLoading ? '—' : (stats?.avgSpeed != null ? `${stats.avgSpeed} km/h` : 'N/A')}</div>
            </div>
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col">
              <div className="text-xs text-gray-400">Driving Score</div>
              <div className="text-2xl font-semibold mt-1">{statsLoading ? '—' : (stats?.drivingScore != null ? stats.drivingScore : 'N/A')}</div>
            </div>
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col">
              <div className="text-xs text-gray-400">Distance (last 90d)</div>
              <div className="text-2xl font-semibold mt-1">{statsLoading ? '—' : (stats?.totalDistanceMeters != null ? `${(stats.totalDistanceMeters/1000).toFixed(2)} km` : 'N/A')}</div>
            </div>
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col">
              <div className="text-xs text-gray-400">Avg Risk</div>
              <div className="text-2xl font-semibold mt-1">{statsLoading ? '—' : (stats?.avgRisk != null ? (stats.avgRisk * 100).toFixed(1) + '%' : 'N/A')}</div>
            </div>
          </div>
        </MotionInView>
        <MotionInView>
          {/* Analytics for driver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center min-w-0">
              <div className="text-sm font-semibold text-accent-yellow mb-2">My Risk Distribution</div>
              <div className="w-full flex flex-col items-center min-w-0">
                <div className="w-full max-w-[220px] min-w-0">
                  <SimplePie data={riskPie} colors={["#ef4444", "#f59e0b", "#10b981"]} size={180} />
                </div>
                <div className="mt-2 text-xs text-gray-300 space-y-1 w-full">
                  {(() => {
                    const total = (riskPie[0]?.value || 0) + (riskPie[1]?.value || 0) + (riskPie[2]?.value || 0) || 1; return (
                      <>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#ef4444' }} /> High: {riskPie[0]?.value || 0} ({Math.round(((riskPie[0]?.value || 0) / total) * 100)}%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#f59e0b' }} /> Medium: {riskPie[1]?.value || 0} ({Math.round(((riskPie[1]?.value || 0) / total) * 100)}%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#10b981' }} /> Low: {riskPie[2]?.value || 0} ({Math.round(((riskPie[2]?.value || 0) / total) * 100)}%)</div>
                      </>
                    );
                  })()}
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
              <Button variant="outline" onClick={() => navigate('/events')}>My Events</Button>
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
