import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bolt, Wind, Edit2, Trash2 } from 'lucide-react';
import EditDriverForm from '../forms/EditDriverForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { db } from '../../config/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const riskColor = (score) => {
  if (score >= 70) return 'bg-red-400';
  if (score >= 40) return 'bg-yellow-400';
  return 'bg-green-400';
};

const DriverCard = ({ driver }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Safely access driver properties with defaults
  const photo = driver.photoURL || driver.photo || '/images/avatars/default-avatar.png';
  const name = driver.name || 'Unknown Driver';
  const driverId = driver.driver_id || driver.id || 'N/A';
  const vehicle = driver.vehicleName || driver.vehicle || 'No Vehicle';
  const vehicleNumber = driver.vehicleNumber || '';
  const status = driver.status || 'Active';
  const riskScore = driver.riskScore || 0;
  const experience = driver.experience || 'N/A';
  const engineOn = driver.engineOn || false;
  const speed = driver.speed || 0;
  const faceAuth = driver.faceAuth !== undefined ? driver.faceAuth : true;

  const handleEditSuccess = (updatedDriver) => {
    // Trigger page refresh
    window.dispatchEvent(new CustomEvent('driverUpdated', { detail: updatedDriver }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const driverRef = doc(db, 'drivers', driverId);
      await deleteDoc(driverRef);
      
      // Trigger page refresh
      window.dispatchEvent(new CustomEvent('driverDeleted', { detail: driver }));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <EditDriverForm
        open={showEdit}
        onClose={() => setShowEdit(false)}
        driver={driver}
        onSuccess={handleEditSuccess}
      />
      
      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Driver"
        message={`Are you sure you want to delete ${name}? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />

      <motion.div whileHover={{ y: -4 }} className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 relative">
        {/* Edit and Delete buttons */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <button
            onClick={() => setShowEdit(true)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Edit driver"
          >
            <Edit2 size={14} className="text-gray-300" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors"
            title="Delete driver"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      <div className="flex items-center gap-3 pr-16">
        <img src={photo} alt={name} className="w-16 h-16 rounded-full object-cover border border-white/6" onError={(e) => { e.target.src = '/images/avatars/default-avatar.png'; }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-200 truncate">{name}</div>
              <div className="text-xs text-gray-400 truncate">{driverId}</div>
              <div className="text-xs text-gray-400 truncate">{vehicleNumber || vehicle}</div>
            </div>
          </div>
          <div className="mt-2">
            <div className={`inline-block px-2 py-0.5 text-xs rounded ${status === 'Active' ? 'bg-green-600/10 text-green-300' : status === 'Warning' ? 'bg-yellow-700/10 text-yellow-300' : 'bg-red-700/10 text-red-300'}`}>{status}</div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                <div className={`${riskColor(riskScore)} h-2 rounded`} style={{ width: `${riskScore}%` }} />
              </div>
              <div className="text-xs font-mono text-gray-200 w-12 text-right shrink-0">{riskScore}%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <Link to={`/driver/${encodeURIComponent(driverId)}`} className="text-sm px-3 py-1 rounded-lg bg-accent-yellow text-black hover:opacity-90">View Details</Link>
        <div className="text-xs text-gray-400">Exp: {experience}</div>
      </div>
      <div className="mt-2 flex items-center gap-3 flex-wrap text-xs">
        <div className="inline-flex items-center gap-1 text-gray-300"><Bolt size={14} className={`${engineOn ? 'text-yellow-300' : 'text-gray-500'}`} /> {engineOn ? `${speed} km/h` : 'Engine Off'}</div>
        <div className="inline-flex items-center gap-1 text-gray-300"><Wind size={14} /> {faceAuth ? 'Face OK' : 'Face Unknown'}</div>
      </div>
      </motion.div>
    </>
  );
};

export default DriverCard;
