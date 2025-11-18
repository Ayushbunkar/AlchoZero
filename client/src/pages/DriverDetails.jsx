import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Section from '../components/common/Section';
import { getDriver } from '../services/driversService';
import { api } from '../services/api';

// Minimal SVG Line Chart (dependency-free) - accepts data [{ts, score}]
const LineSvgChart = ({ data = [], height = 220 }) => {
  if (!data.length) return <div className="text-sm text-gray-400">No data</div>;
  const w = 800; const h = height; const pad = 24;
  const xs = data.map((d, i) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1));
  const vals = data.map(d => Math.round(d.score));
  const max = Math.max(100, Math.max(...vals));
  const ys = vals.map(v => pad + (1 - v / max) * (h - pad * 2));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  return (
    <div style={{ width: '100%', height }} className="rounded bg-white/3 p-2">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="url(#g1)" stroke="none" points={`${points} ${xs[xs.length-1]},${h-pad} ${xs[0]},${h-pad}`} />
        <polyline fill="none" stroke="#fb923c" strokeWidth="2" points={points} strokeLinejoin="round" strokeLinecap="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r={2.5} fill="#ff7a18" />
        ))}
      </svg>
    </div>
  );
};

// Minimal SVG Bar Chart - accepts data [{name, value}]
const BarSvgChart = ({ data = [], height = 160 }) => {
  if (!data.length) return <div className="text-sm text-gray-400">No data</div>;
  const w = 800; const h = height; const pad = 24;
  const barW = (w - pad * 2) / data.length;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ width: '100%', height }} className="rounded bg-white/3 p-2">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const x = pad + i * barW + 6;
          const barH = (d.value / max) * (h - pad * 2);
          const y = h - pad - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW - 12} height={barH} rx={4} fill="#f59e0b" />
              <text x={x + (barW - 12) / 2} y={h - pad + 14} fontSize={10} textAnchor="middle" fill="#cbd5e1">{d.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

import { ArrowLeft } from 'lucide-react';

const DriverDetails = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const d = await getDriver(id);
        if (!mounted) return;
        setDriver(d);
      } catch (e) {
        setDriver(null);
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!driver) return <div className="p-6">Driver not found</div>;

  const trend = (driver.trend || []).map(t => ({ ts: new Date(t.ts).toLocaleDateString(), score: Math.round(t.score) }));
  const bars = (driver.behavior7 || []).map((b, i) => ({ name: `Day ${i+1}`, value: b.value }));

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1 bg-bg-subtle border border-white/10 rounded hover:bg-white/5 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      <Section>
        <div className="flex gap-6 items-center">
          <img src={driver.photo} alt={driver.name} className="w-32 h-32 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">{driver.name}</h2>
            <div className="text-sm text-gray-400">ID: {driver.id} • Vehicle: {driver.vehicle}</div>
            <div className="mt-2 text-gray-300">License: {driver.license} • Contact: {driver.contact}</div>
            <div className="mt-2 flex items-center gap-4">
              <div className="text-sm">Engine: {driver.engineOn ? <span className="text-green-300">On</span> : <span className="text-red-300">Off</span>}</div>
              <div className="text-sm">Speed: <span className="font-mono">{driver.speed} km/h</span></div>
              <div className="text-sm">Face: {driver.faceAuth ? <span className="text-green-300">Authenticated</span> : <span className="text-yellow-300">Unknown</span>}</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Risk Trend">
        <div style={{ width: '100%', height: 220 }}>
          <LineSvgChart data={trend.map(t => ({ ts: t.ts, score: t.score }))} height={220} />
        </div>
      </Section>

      <Section title="Last 7 Days Behavior">
        <div style={{ width: '100%', height: 180 }}>
          <BarSvgChart data={bars} height={180} />
        </div>
      </Section>
      
      <Section title="Last Captured Photos">
        <div className="flex gap-3 items-start flex-wrap">
          {(driver.lastPhotos || []).slice(0,5).map((p, i) => (
            <img key={i} src={p} alt={`cap-${i}`} className="w-36 h-24 object-cover rounded border border-white/10" />
          ))}
        </div>
        <div className="mt-3">
          <button onClick={async () => {
            if (!user || !['admin','superadmin'].includes((user.role||'').toLowerCase())) {
              showToast('Only admins may capture photos', 'error');
              return;
            }
            if (!confirm('Capture last 5 photos for this driver?')) return;
            try {
              const res = await api.post(`/drivers/${encodeURIComponent(driver.id)}/capture`);
              // api.post will throw on non-2xx; response data is in res.data
              const j = res.data;
              // refresh local state
              setDriver(prev => ({ ...prev, lastPhotos: j.lastPhotos }));
              showToast('Captured photos', 'success');
            } catch (e) {
              console.error(e);
              const msg = e?.response?.data?.message || e.message || 'Capture failed';
              showToast(msg, 'error');
            }
          }} className="px-3 py-1 rounded bg-accent-yellow text-black">Capture Last 5 Photos</button>
        </div>
      </Section>
    </div>
  );
};

export default DriverDetails;
