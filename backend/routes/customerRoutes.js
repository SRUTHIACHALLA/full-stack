import express from 'express';
import { protect, verifyRole } from '../middleware/authMiddleware.js';
import { getAllProducts, placeOrder, getCustomerOrders } from '../controllers/customerController.js';


const router = express.Router();

router.get('/products', getAllProducts);
router.post('/place-order', protect, verifyRole('customer'), placeOrder);
router.get('/orders', protect, verifyRole('customer'), getCustomerOrders);


export default router;
