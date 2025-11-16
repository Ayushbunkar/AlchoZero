import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MotionInView from '../components/common/MotionInView';
import Tilt3D from '../components/common/Tilt3D';
import SimplePie from '../components/analytics/SimplePie';
import SimpleBar from '../components/analytics/SimpleBar';
import SimpleLine from '../components/analytics/SimpleLine';
import { getEvents as getEventSeries } from '../services/detectionService';
import { getDevices } from '../services/dataService';
import { useToast } from '../contexts/ToastContext';

const Analytics = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [devices, setDevices] = useState([]);
  const [rangeDays, setRangeDays] = useState(14);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const limit = rangeDays >= 30 ? 1000 : 500;
        const fromISO = fromDate ? new Date(`${fromDate}T00:00:00`).toISOString() : undefined;
        const toISO = toDate ? new Date(`${toDate}T23:59:59`).toISOString() : undefined;
        const [ev, dev] = await Promise.all([
          deviceFilter !== 'all'
            ? getEventSeries({ deviceId: deviceFilter, limit, from: fromISO, to: toISO })
            : getEventSeries({ limit, from: fromISO, to: toISO }),
          getDevices(),
        ]);
        if (!mounted) return;
        setEvents(Array.isArray(ev) ? ev : []);
        setDevices(Array.isArray(dev) ? dev : []);
      } catch (err) {
        showToast(`Analytics data failed to load: ${err?.message || err}`, 'error', 3500);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [deviceFilter, rangeDays, showToast]);

  const byDay = useMemo(() => {
    const map = new Map();
    const cutoff = fromDate ? new Date(`${fromDate}T00:00:00`) : (() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); return d; })();
    const endcap = toDate ? new Date(`${toDate}T23:59:59`) : null;
    for (const e of events) {
      const d = new Date(e.date);
      if (isNaN(d) || d < cutoff) continue;
      if (endcap && d > endcap) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).slice(-14);
    return arr.map(([label, value]) => ({ label: label.slice(5), value }));
  }, [events, rangeDays, fromDate, toDate]);

  const riskPie = useMemo(() => {
    let high = 0, mid = 0, low = 0;
    const cutoff = fromDate ? new Date(`${fromDate}T00:00:00`) : (() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); return d; })();
    const endcap = toDate ? new Date(`${toDate}T23:59:59`) : null;
    for (const e of events) {
      const r = Number(e.risk || 0);
      const d = new Date(e.date);
      if (isNaN(d) || d < cutoff) continue;
      if (endcap && d > endcap) continue;
      if (r >= 0.7) high++; else if (r >= 0.4) mid++; else low++;
    }
    return [
      { label: 'High', value: high },
      { label: 'Medium', value: mid },
      { label: 'Low', value: low },
    ];
  }, [events, rangeDays, fromDate, toDate]);

  const topDevices = useMemo(() => {
    const counts = new Map();
    const cutoff = fromDate ? new Date(`${fromDate}T00:00:00`) : (() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); return d; })();
    const endcap = toDate ? new Date(`${toDate}T23:59:59`) : null;
    for (const e of events) {
      const id = e.deviceId || '—';
      const d = new Date(e.date);
      if (isNaN(d) || d < cutoff) continue;
      if (endcap && d > endcap) continue;
      counts.set(id, (counts.get(id) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a,b) => b[1]-a[1])
      .slice(0, 8)
      .map(([id, value]) => ({ id, label: String(id).slice(-4), value }));
  }, [events, rangeDays, fromDate, toDate]);

  const exportCsv = () => {
    const lines = [];
    lines.push('Risk Distribution');
    lines.push('Bucket,Count');
    for (const s of riskPie) lines.push(`${s.label},${s.value}`);
    lines.push('');
    lines.push('Top Devices');
    lines.push('DeviceId,Events');
    for (const d of topDevices) lines.push(`${d.id},${d.value}`);
    lines.push('');
    lines.push('By Day');
    lines.push('Date,Events');
    for (const p of byDay) lines.push(`${p.label},${p.value}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = useMemo(() => {
    const cutoff = fromDate ? new Date(`${fromDate}T00:00:00`) : (() => { const d = new Date(); d.setDate(d.getDate() - rangeDays + 1); return d; })();
    const endcap = toDate ? new Date(`${toDate}T23:59:59`) : null;
    return events
      .filter(e => {
        const d = new Date(e.date);
        if (isNaN(d) || d < cutoff) return false;
        if (endcap && d > endcap) return false;
        return true;
      })
      .sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [events, rangeDays, fromDate, toDate]);

  const topDeviceId = useMemo(() => topDevices[0]?.id || null, [topDevices]);
  const filteredEventsForTop = useMemo(() => {
    if (!topDeviceId) return filteredEvents.slice(0, 8);
    return filteredEvents.filter(e => e.deviceId === topDeviceId).slice(0, 8);
  }, [filteredEvents, topDeviceId]);

  const deviceStatus = useMemo(() => {
    let active = 0, inactive = 0;
    for (const d of devices) {
      if ((d.status || '').toUpperCase() === 'ACTIVE') active++; else inactive++;
    }
    return { active, inactive };
  }, [devices]);

  return (
    <div>
      <Section>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-accent-yellow">Analytics</h2>
          <Breadcrumbs />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label className="text-gray-400">Range:</label>
          <select
            value={rangeDays}
            onChange={(e)=> setRangeDays(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded px-2 py-1"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
          <label className="text-gray-400 ml-3">From:</label>
          <input type="date" value={fromDate} onChange={(e)=> setFromDate(e.target.value)} className="bg-black/30 border border-white/10 rounded px-2 py-1" />
          <label className="text-gray-400">To:</label>
          <input type="date" value={toDate} onChange={(e)=> setToDate(e.target.value)} className="bg-black/30 border border-white/10 rounded px-2 py-1" />
          <label className="text-gray-400 ml-3">Device:</label>
          <select
            value={deviceFilter}
            onChange={(e)=> setDeviceFilter(e.target.value)}
            className="bg-black/30 border border-white/10 rounded px-2 py-1"
          >
            <option value="all">All Devices</option>
            {devices.map(d => (
              <option key={d.device_id} value={d.device_id}>{d.device_id}</option>
            ))}
          </select>
          <button onClick={exportCsv} className="ml-2 px-3 py-1 rounded border border-white/10 hover:bg-white/5">Download CSV</button>
        </div>
      </Section>
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionInView>
            <Tilt3D intensity="subtle">
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-accent-yellow">Risk Distribution</div>
                  {loading && <span className="text-xs text-gray-500">Loading...</span>}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    {riskPie.every(s=>s.value===0) ? (
                    <div className="text-xs text-gray-500">No events for selected filter.</div>
                  ) : (
                    <SimplePie
                      data={riskPie}
                      colors={["#ef4444","#f59e0b","#10b981"]}
                      size={180}
                    />
                  )}
                    <div className="text-xs text-gray-300 space-y-1">
                      {(() => { const total = (riskPie[0]?.value||0)+(riskPie[1]?.value||0)+(riskPie[2]?.value||0)||1; return (
                        <>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#ef4444'}} /> High: {riskPie[0]?.value || 0} ({Math.round(((riskPie[0]?.value||0)/total)*100)}%)</div>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#f59e0b'}} /> Medium: {riskPie[1]?.value || 0} ({Math.round(((riskPie[1]?.value||0)/total)*100)}%)</div>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:'#10b981'}} /> Low: {riskPie[2]?.value || 0} ({Math.round(((riskPie[2]?.value||0)/total)*100)}%)</div>
                        </>
                      ); })()}
                  </div>
                </div>
                  <div className="mt-3 border-t border-white/10 pt-2">
                    <div className="text-xs text-gray-400 mb-1">Recent events (by date)</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-gray-300">
                        <thead>
                          <tr className="text-left text-gray-400">
                            <th className="py-1 pr-2">Date</th>
                            <th className="pr-2">Risk</th>
                            <th className="pr-2">Status</th>
                            <th className="pr-2">Device</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvents.slice(0, 8).map((e) => (
                            <tr key={e.id} className="border-t border-white/5">
                              <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                              <td className="pr-2">{e.risk}</td>
                              <td className="pr-2">{e.status}</td>
                              <td className="pr-2 max-w-[140px] truncate" title={String(e.deviceId)}>{e.deviceId}</td>
                            </tr>
                          ))}
                          {filteredEvents.length === 0 && (
                            <tr><td className="py-2 text-gray-500" colSpan={4}>No events</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </Tilt3D>
          </MotionInView>

          <MotionInView delay={0.05}>
            <Tilt3D intensity="subtle">
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Top Devices (events)</div>
                  {topDevices.length === 0 ? (
                  <div className="text-xs text-gray-500">No device activity.</div>
                ) : (
                    <SimpleBar data={topDevices} width={420} height={180} onBarClick={(item)=> navigate(`/analytics/device/${encodeURIComponent(item.id)}`)} />
                )}
                  <div className="mt-3 border-t border-white/10 pt-2">
                    <div className="text-xs text-gray-400 mb-1">Recent events {topDeviceId ? `(top device ${String(topDeviceId).slice(-6)})` : ''}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-gray-300">
                        <thead>
                          <tr className="text-left text-gray-400">
                            <th className="py-1 pr-2">Date</th>
                            <th className="pr-2">Risk</th>
                            <th className="pr-2">Status</th>
                            <th className="pr-2">Device</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEventsForTop.map((e) => (
                            <tr key={e.id} className="border-t border-white/5">
                              <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                              <td className="pr-2">{e.risk}</td>
                              <td className="pr-2">{e.status}</td>
                              <td className="pr-2 max-w-[140px] truncate" title={String(e.deviceId)}>{e.deviceId}</td>
                            </tr>
                          ))}
                          {filteredEventsForTop.length === 0 && (
                            <tr><td className="py-2 text-gray-500" colSpan={4}>No events</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </Tilt3D>
          </MotionInView>

          <MotionInView delay={0.1}>
            <Tilt3D intensity="subtle">
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <div className="text-sm font-semibold text-accent-yellow mb-2">Device Status</div>
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-green">{deviceStatus.active}</div>
                    <div className="text-xs text-gray-400 mt-1">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-red">{deviceStatus.inactive}</div>
                    <div className="text-xs text-gray-400 mt-1">Inactive</div>
                  </div>
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
                          <th className="pr-2">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                          {filteredEvents.slice(0, 6).map((e) => (
                          <tr key={e.id} className="border-t border-white/5">
                            <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                            <td className="pr-2">{e.risk}</td>
                            <td className="pr-2">{e.status}</td>
                              <td className="pr-2 max-w-[140px] truncate" title={String(e.deviceId)}>{e.deviceId}</td>
                          </tr>
                        ))}
                        {filteredEvents.length === 0 && (
                          <tr><td className="py-2 text-gray-500" colSpan={4}>No events</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </MotionInView>
        </div>
      </Section>

      <Section title="Last 14 days" subtitle="Event volume trend (server data)">
        <MotionInView>
          <Tilt3D intensity="subtle">
            <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
              {byDay.length === 0 ? (
                <div className="text-sm text-gray-500">No data in the selected time range.</div>
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
                        <th className="pr-2">Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.slice(0,10).map((e) => (
                        <tr key={e.id} className="border-t border-white/5">
                          <td className="py-1 pr-2 whitespace-nowrap">{new Date(e.date).toLocaleString()}</td>
                          <td className="pr-2">{e.risk}</td>
                          <td className="pr-2">{e.status}</td>
                          <td className="pr-2">{e.deviceId}</td>
                        </tr>
                      ))}
                      {filteredEvents.length === 0 && (
                        <tr><td className="py-2 text-gray-500" colSpan={4}>No events</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tilt3D>
        </MotionInView>
      </Section>
    </div>
  );
};

export default Analytics;
