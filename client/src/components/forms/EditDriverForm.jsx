import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { api } from '../../services/api';

const EditDriverForm = ({ open, onClose, driver, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    age: '',
    license: '',
    vehicleName: '',
    vehicleNumber: '',
    status: 'Active',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driver && open) {
      setFormData({
        name: driver.name || '',
        contact: driver.contact || '',
        age: driver.age || '',
        license: driver.license || '',
        vehicleName: driver.vehicleName || '',
        vehicleNumber: driver.vehicleNumber || '',
        status: driver.status || 'Active',
      });
      setPhotoPreview(driver.photoURL || driver.photo || null);
    }
  }, [driver, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/upload/driver-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.contact.trim()) {
      setError('Contact is required');
      return;
    }
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      setError('Valid age is required (18-100)');
      return;
    }
    if (!formData.license.trim()) {
      setError('License number is required');
      return;
    }

    setLoading(true);

    try {
      const driverId = driver.driver_id || driver.id;

      // Upload new photo if provided
      let photoURL = driver.photoURL || driver.photo;
      if (photo) {
        try {
          photoURL = await uploadPhoto(photo);
        } catch (uploadError) {
          console.warn('Photo upload failed, keeping existing photo:', uploadError);
        }
      }

      // Prepare updated driver data
      const updatedData = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        age: parseInt(formData.age),
        license: formData.license.trim(),
        vehicleName: formData.vehicleName.trim() || null,
        vehicleNumber: formData.vehicleNumber.trim() || null,
        status: formData.status,
        photoURL: photoURL,
        updatedAt: new Date().toISOString(),
      };

      // Update in Firestore
      const driverRef = doc(db, 'drivers', driverId);
      await updateDoc(driverRef, updatedData);

      // Success callback
      if (onSuccess) {
        onSuccess({ ...driver, ...updatedData });
      }

      onClose();
    } catch (err) {
      console.error('Error updating driver:', err);
      setError(err.message || 'Failed to update driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPhoto(null);
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Driver"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Photo
          </label>
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No photo</span>
              </div>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={loading}
              />
              <div className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
                Change Photo
              </div>
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">
            Contact <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
            Age <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            min="18"
            max="100"
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* License */}
        <div>
          <label htmlFor="license" className="block text-sm font-medium text-gray-300 mb-1">
            License Number <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="license"
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* Vehicle Name */}
        <div>
          <label htmlFor="vehicleName" className="block text-sm font-medium text-gray-300 mb-1">
            Vehicle Name
          </label>
          <input
            type="text"
            id="vehicleName"
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* Vehicle Number */}
        <div>
          <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-white disabled:opacity-50"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-accent-yellow hover:bg-accent-yellow/90 text-bg-primary font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Driver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDriverForm;
