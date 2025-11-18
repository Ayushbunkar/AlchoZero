import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bolt, Wind } from 'lucide-react';

const riskColor = (score) => {
  if (score >= 70) return 'bg-red-400';
  if (score >= 40) return 'bg-yellow-400';
  return 'bg-green-400';
};

const DriverCard = ({ driver }) => {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="flex items-center gap-3">
        <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-full object-cover border border-white/6" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-200">{driver.name}</div>
              <div className="text-xs text-gray-400">{driver.id} • {driver.vehicle}</div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-2 py-0.5 text-xs rounded ${driver.status === 'Active' ? 'bg-green-600/10 text-green-300' : driver.status === 'Warning' ? 'bg-yellow-700/10 text-yellow-300' : 'bg-red-700/10 text-red-300'}`}>{driver.status}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                <div className={`${riskColor(driver.riskScore)} h-2 rounded`} style={{ width: `${driver.riskScore}%` }} />
              </div>
              <div className="text-xs font-mono text-gray-200 w-12 text-right">{driver.riskScore}%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Link to={`/driver/${encodeURIComponent(driver.id)}`} className="text-sm px-3 py-1 rounded-lg bg-accent-yellow text-black hover:opacity-90">View Details</Link>
        <div className="text-xs text-gray-400">Exp: {driver.experience}</div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="text-xs inline-flex items-center gap-1 text-gray-300"><Bolt size={14} className={`${driver.engineOn ? 'text-yellow-300' : 'text-gray-500'}`} /> {driver.engineOn ? `${driver.speed} km/h` : 'Engine Off'}</div>
        <div className="text-xs inline-flex items-center gap-1 text-gray-300"><Wind size={14} /> {driver.faceAuth ? 'Face OK' : 'Face Unknown'}</div>
      </div>
    </motion.div>
  );
};

export default DriverCard;
