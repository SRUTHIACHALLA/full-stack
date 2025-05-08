// routes/vendor.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

import { protect, verifyRole, verifyVendor } from '../middleware/authMiddleware.js';
import { getVendorProducts, uploadProduct } from '../controllers/vendorController.js';

import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();
const upload = multer({ storage });

// ✅ Upload new product (with Cloudinary)
router.post('/upload', protect, verifyRole('vendor'), upload.single('image'), uploadProduct);

// ✅ Get all products by this vendor
router.get('/products', protect, verifyVendor, async (req, res) => {
  const vendorId = req.user._id;
  const products = await Product.find({ vendorId });
  res.json(products);
});

// ✅ Get all orders placed for this vendor's products
router.get('/orders', protect, verifyVendor, async (req, res) => {
  const vendorId = req.user._id;
  const orders = await Order.find({ vendorId })
  .populate('customerId', 'name')
  .populate('products.productId', 'title image'); ;
  res.json(orders);
});



  router.put('/order/:id/status', protect, verifyVendor, async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order || order.vendorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied or invalid order' });
      }
  
      order.status = status;
      await order.save();
      res.json({ message: 'Order status updated' });
    } catch (err) {
      console.error('❌ Failed to update order status:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
