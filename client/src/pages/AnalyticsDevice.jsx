import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
import Tilt3D from '../components/common/Tilt3D';
import SimplePie from '../components/analytics/SimplePie';
import SimpleLine from '../components/analytics/SimpleLine';
import { getEvents as getEventSeries } from '../services/detectionService';

const AnalyticsDevice = () => {
  const { deviceId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(14);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const limit = rangeDays >= 30 ? 1000 : 500;
        const fromISO = (() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); d.setHours(0,0,0,0); return d.toISOString(); })();
        const ev = await getEventSeries({ deviceId, limit, from: fromISO });
        if (!mounted) return;
        setEvents(Array.isArray(ev) ? ev : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [deviceId, rangeDays]);

  const cutoff = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); d.setHours(0,0,0,0); return d; }, [rangeDays]);

  const filtered = useMemo(() => events.filter(e => { const d = new Date(e.date); return !isNaN(d) && d >= cutoff; }), [events, cutoff]);

  const byDay = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([label, value]) => ({ label: label.slice(5), value }));
  }, [filtered]);

  const riskPie = useMemo(() => {
    let high = 0, mid = 0, low = 0;
    for (const e of filtered) {
      const r = Number(e.risk || 0);
      if (r >= 0.7) high++; else if (r >= 0.4) mid++; else low++;
    }
    return [
      { label: 'High', value: high },
      { label: 'Medium', value: mid },
      { label: 'Low', value: low },
    ];
  }, [filtered]);

  const recentEvents = useMemo(() => filtered.slice().sort((a,b) => new Date(b.date) - new Date(a.date)), [filtered]);

  return (
    <div>
      <Section>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-accent-yellow">Device Analytics • <span className="font-mono text-white/90">{deviceId}</span></h2>
          <Breadcrumbs />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <Link to="/analytics" className="px-2 py-1 rounded border border-white/10 text-gray-300 hover:bg-white/5">Back to Analytics</Link>
          <label className="text-gray-400 ml-2">Range:</label>
          <select value={rangeDays} onChange={(e)=> setRangeDays(Number(e.target.value))} className="bg-black/30 border border-white/10 rounded px-2 py-1">
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
          {loading && <span className="text-xs text-gray-500">Loading...</span>}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionInView>
            <Tilt3D intensity="subtle">
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Risk Distribution</div>
                {riskPie.every(s=>s.value===0) ? (
                  <div className="text-xs text-gray-500">No events for selected range.</div>
                ) : (
                  <SimplePie data={riskPie} colors={["#ef4444","#f59e0b","#10b981"]} size={180} />
                )}
                <div className="mt-2 text-xs text-gray-300 space-y-1">
                  {(() => { const total = (riskPie[0]?.value||0)+(riskPie[1]?.value||0)+(riskPie[2]?.value||0)||1; return (
                    <>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#ef4444'}} /> High: {riskPie[0]?.value || 0} ({Math.round(((riskPie[0]?.value||0)/total)*100)}%)</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#f59e0b'}} /> Medium: {riskPie[1]?.value || 0} ({Math.round(((riskPie[1]?.value||0)/total)*100)}%)</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#10b981'}} /> Low: {riskPie[2]?.value || 0} ({Math.round(((riskPie[2]?.value||0)/total)*100)}%)</div>
                    </>
                  ); })()}
                </div>
                <div className="mt-3 border-t border-white/10 pt-2">
                  <div className="text-xs text-gray-400 mb-1">Recent events</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-gray-300">
                      <thead>
                        <tr className="text-left text-gray-400">
                          <th className="py-1 pr-2">Date</th>
                          <th className="pr-2">Risk</th>
                          <th className="pr-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents.slice(0,8).map((e) => (
                          <tr key={e.id} className="border-t border-white/5">
                            <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                            <td className="pr-2">{typeof e.risk === 'number' ? (e.risk >= 0.7 ? 'high' : e.risk >= 0.4 ? 'medium' : 'low') : e.risk}</td>
                            <td className="pr-2">{e.status}</td>
                          </tr>
                        ))}
                        {recentEvents.length === 0 && (
                          <tr><td className="py-2 text-gray-500" colSpan={3}>No events</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </MotionInView>

          <div className="lg:col-span-2">
            <MotionInView>
              <Tilt3D intensity="subtle">
                <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                  <div className="text-sm font-semibold text-accent-yellow mb-2">Event Trend</div>
                  {byDay.length === 0 ? (
                    <div className="text-xs text-gray-500">No data to display.</div>
                  ) : (
                    <SimpleLine points={byDay} width={720} height={220} />
                  )}
                  <div className="mt-3 border-t border-white/10 pt-2">
                    <div className="text-xs text-gray-400 mb-1">Recent events (last 10)</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-gray-300">
                        <thead>
                          <tr className="text-left text-gray-400">
                            <th className="py-1 pr-2">Date</th>
                            <th className="pr-2">Risk</th>
                            <th className="pr-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentEvents.slice(0,10).map((e) => (
                            <tr key={e.id} className="border-t border-white/5">
                              <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                              <td className="pr-2">{typeof e.risk === 'number' ? (e.risk >= 0.7 ? 'high' : e.risk >= 0.4 ? 'medium' : 'low') : e.risk}</td>
                              <td className="pr-2">{e.status}</td>
                            </tr>
                          ))}
                          {recentEvents.length === 0 && (
                            <tr><td className="py-2 text-gray-500" colSpan={3}>No events</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </MotionInView>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AnalyticsDevice;
