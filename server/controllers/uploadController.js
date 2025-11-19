import cloudinary from '../config/cloudinary.js';

// Upload driver photo to Cloudinary
export const uploadDriverPhoto = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalname: req.file.originalname
    });

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'drivers',
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    console.log('Upload successful:', uploadResponse.secure_url);

    res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
};

// Delete driver photo from Cloudinary
export const deleteDriverPhoto = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
