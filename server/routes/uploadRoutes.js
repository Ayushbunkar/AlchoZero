import express from 'express';
import upload from '../utils/uploadMiddleware.js';
import { uploadDriverPhoto, deleteDriverPhoto } from '../controllers/uploadController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

// Upload driver photo (authentication optional for now)
router.post('/driver-photo', upload.single('photo'), uploadDriverPhoto);

// Delete driver photo
router.delete('/driver-photo', authenticate, deleteDriverPhoto);

export default router;
