import { Router } from 'express';
import { createUser, listUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(authMiddleware, roleGuard('ADMIN', 'PRINCIPAL'));

router.get('/', listUsers);
router.post('/', createUser);

export default router;
