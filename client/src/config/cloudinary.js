// Cloudinary configuration for client-side
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'drivers_preset',
};

// Helper to get optimized image URL
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const {
    width = 500,
    height = 500,
    quality = 'auto',
    format = 'auto',
  } = options;

  // If it's a Cloudinary URL, we can optimize it
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformation = `w_${width},h_${height},c_fill,q_${quality},f_${format}`;
      return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    }
  }

  return url;
};

export default CLOUDINARY_CONFIG;
