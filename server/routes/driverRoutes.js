import express from 'express';
import { listDrivers, getDriver, capturePhotos } from '../controllers/driverController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', listDrivers);
router.get('/:id', getDriver);
// capture requires authentication; only admins allowed (controller will check role)
router.post('/:id/capture', requireAuth, capturePhotos);

export default router;
