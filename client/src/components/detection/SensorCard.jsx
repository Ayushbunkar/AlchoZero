import Tilt3D from '../common/Tilt3D';

const SensorCard = ({ label, value, unit, accent = 'yellow' }) => {
  const colorClass = accent === 'red' ? 'text-accent-red' : accent === 'green' ? 'text-accent-green' : 'text-accent-yellow';
  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${colorClass}`}>{value}{unit ? <span className="text-gray-400 text-base ml-1">{unit}</span> : null}</div>
    </div>
    </Tilt3D>
  );
};

export default SensorCard;
