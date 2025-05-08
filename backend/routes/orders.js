import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import {protect, verifyVendor, verifyCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get vendor-specific orders
router.get('/vendor', protect, verifyVendor, async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ vendorId })
      .populate('products.productId', 'title image')
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendor orders' });
  }
});


// ✅ Get customer-specific orders
// routes/orders.js
router.get('/customer', protect, verifyCustomer, async (req, res) => {
  try {
    console.log("🔑 Authenticated customerId:", req.user._id);

    const orders = await Order.find({ customerId: req.user._id })
      .populate('products.productId', 'title image')
      .sort({ date: -1 });

    console.log("📦 Orders found:", orders.length);
    if (orders.length === 0) {
      console.log("❗ No orders found for this customer");
    }
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});



router.post('/create', protect, verifyCustomer, async (req, res) => {
  try {
    console.log("🔒 Authenticated user:", req.user);
    console.log("📥 Incoming order data:", req.body);

    const customerId = req.user._id;
    const { vendorId, products, totalAmount, location } = req.body;

    if (!vendorId || !products?.length || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    const formattedProducts = products.map(p => ({
      productId: new mongoose.Types.ObjectId(p.productId),
      title: p.title,           // optional: store title in order
      price: p.price,
      quantity: p.quantity
    }));

    const newOrder = new Order({
      customerId: new mongoose.Types.ObjectId(customerId),
      vendorId: new mongoose.Types.ObjectId(vendorId),
      products: formattedProducts,
      totalAmount,
      location,
      status: 'Placed',
      date: new Date()
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

export default router;
