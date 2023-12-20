import express from 'express';
import {auth} from '../middlewares/auth.js';
import { verifyTokenMiddleware} from '../middlewares/token.js';
import { addProduct, deleteProduct } from '../Controllers/product-controller.js';

const router = express.Router();
router.use(express.json());

router.post('/create', verifyTokenMiddleware, auth, addProduct);
router.post('/remove', verifyTokenMiddleware,auth, deleteProduct);

export default router