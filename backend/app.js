// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import orderRoutes from './routes/orders.js';

dotenv.config();
connectDB(); // ✅ connect DB only once

const app = express();

app.use(cors(({
  origin: '*', // Or restrict to your frontend Render domain
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.send('API Running...'));

export default app; // ✅ Export app for testing
