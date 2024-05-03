import { Router } from 'express';
import { login, dashboard } from '../controllers/main.js';

const router = Router();

router.route('/dashboard').get(dashboard);
router.route('/login').post(login);

export { router };
