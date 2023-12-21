import express from 'express';
import  {validate}  from '../middlewares/validators.js';
import { signup, login, 
    updateProfile, forgotPassword, 
    resetPassword, displayProducts, 
    displayCategoryProducts, orderProducts } from '../Controllers/user-controller.js';

import  { signToken, verifyTokenMiddleware} from '../middlewares/token.js';

const router = express.Router();
router.use(express.json());

router.post('/sign-up', validate.userLogin, signup);

router.post('/login', login);

router.put('/update-profile', verifyTokenMiddleware,validate.updateUserValidator, updateProfile);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password', validate.resetUserPassword, verifyTokenMiddleware, resetPassword,);

router.get('/allProducts' , displayProducts);

router.post('/allCategoryProducts' , displayCategoryProducts);

router.post('/order' ,verifyTokenMiddleware, orderProducts);

export default router