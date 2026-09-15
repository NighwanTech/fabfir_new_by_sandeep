import { Router } from 'express';
import { login, logout, getMe } from './auth.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);

export default router;
