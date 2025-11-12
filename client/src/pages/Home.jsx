import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { Car, ShieldAlert, Activity } from 'lucide-react';

const Feature = ({ title, desc, icon }) => {
  const Icon = icon;
  return (
    <div className="p-4 rounded-xl bg-bg-subtle border border-white/10 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} className="text-accent-yellow" />
        <h3 className="text-accent-yellow font-medium text-sm">{title}</h3>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Safer Roads with <span className="text-accent-red">AlchoZero</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-sm md:text-base">
          Real-time monitoring prototype that simulates detection of impaired or drowsy driving using camera and sensor feeds.
          Helping drivers make safer decisions before risk escalates.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" as={Link} to="/dashboard" onClick={() => {}}>Go to Dashboard</Button>
          <Link to="/about" className="px-4 py-2 rounded-lg text-sm border border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10">Learn More</Link>
        </div>
        <div className="mt-4 text-xs text-gray-500">{user ? `Logged in as ${user.name}` : 'You are browsing as Guest.'}</div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Feature title="Live Camera" icon={Car} desc="Preview your webcam stream as if it were an in-vehicle camera feed." />
        <Feature title="Risk Meter" icon={Activity} desc="Animated confidence bar changing color with escalating detection risk." />
        <Feature title="Event Log" icon={ShieldAlert} desc="Mock historical data and CSV export for analysis and reporting." />
      </section>
      <section className="mt-10 text-center">
        <p className="text-xs text-gray-500">Prototype only – no real impairment analysis performed.</p>
      </section>
    </div>
  );
};

export default Home;
