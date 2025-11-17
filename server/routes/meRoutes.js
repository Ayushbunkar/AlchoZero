import express from 'express';
import { getMe, updateMe } from '../controllers/meController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getMe);
router.put('/', requireAuth, updateMe);

export default router;
