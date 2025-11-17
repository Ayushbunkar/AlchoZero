import express from 'express';
import { register, login, forgot, refresh } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgot);
router.post('/refresh', refresh);

export default router;
