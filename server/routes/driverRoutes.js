import express from 'express';
import { listDrivers, getDriver, capturePhotos } from '../controllers/driverController.js';
import { requireAuth } from '../utils/authMiddleware.js';
import { getMyDriverStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', listDrivers);
router.get('/:id', getDriver);
// capture requires authentication; only admins allowed (controller will check role)
router.post('/:id/capture', requireAuth, capturePhotos);

// Authenticated driver stats for current user
router.get('/me/stats', requireAuth, getMyDriverStats);

export default router;
