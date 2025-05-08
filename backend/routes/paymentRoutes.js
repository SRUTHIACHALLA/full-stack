import express from 'express';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  console.log('💰 Creating Razorpay order for ₹', amount);

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });
    res.json(order);
  } catch (error) {
    console.error('🔥 Razorpay error:', error);
    res.status(500).json({ error: 'Payment order creation failed' });
  }
});



export default router;
