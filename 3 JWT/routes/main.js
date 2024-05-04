import { Router } from 'express';
import { login, dashboard } from '../controllers/main.js';

import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.route('/dashboard').get(authMiddleware, dashboard);
router.route('/login').post(login);

export { router };
