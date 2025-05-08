import express from 'express';
import { protect, verifyRole } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    getAllOrders,
    deleteUser
  } from '../controllers/adminController.js'; 

import Product from '../models/Product.js';
import { getAllProducts, deleteProduct } from '../controllers/productController.js';
  
const router = express.Router();

router.get('/products', protect, verifyRole('admin'), getAllProducts);

router.get('/users', protect, verifyRole('admin'), getAllUsers);
router.get('/orders', protect, verifyRole('admin'), getAllOrders);

router.delete('/user/:id', protect, verifyRole('admin'), deleteUser);
router.delete('/product/:id', protect, verifyRole('admin'), deleteProduct);

router.put('/product/:id', protect, verifyRole('admin'), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// backend/routes/admin.js
router.get('/vendor/:vendorId/products', protect, verifyRole('admin'), async (req, res) => {
  const products = await Product.find({ vendorId: req.params.vendorId });
  res.json(products);
});



router.put('/order/:id/status', protect, verifyRole('admin'), async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: 'Order status updated' });
});



export default router;
