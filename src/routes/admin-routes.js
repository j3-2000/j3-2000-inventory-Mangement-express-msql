import express from 'express';
import {auth} from '../middlewares/auth.js';
import { verifyTokenMiddleware} from '../middlewares/token.js';
import { updateRoles, deleteUser } from '../Controllers/admin-controller.js';

const router = express.Router();
router.use(express.json());

router.post('/update-permissions', verifyTokenMiddleware, auth, updateRoles);
router.delete('/delete-user', verifyTokenMiddleware, auth, deleteUser);

export default router;