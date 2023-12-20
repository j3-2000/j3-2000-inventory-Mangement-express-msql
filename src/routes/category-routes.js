import express from 'express';
import {auth} from '../middlewares/auth.js';
import { verifyTokenMiddleware} from '../middlewares/token.js';
import { createCategory, deleteCategory } from '../Controllers/category-controller.js';

const router = express.Router();
router.use(express.json());

router.post('/create', verifyTokenMiddleware, auth,createCategory);
router.post('/remove',verifyTokenMiddleware, auth, deleteCategory);

export default router