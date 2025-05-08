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
const app = express();
const allowedOrigins = [
  'https://multivendor-frontend-t8sz.onrender.com', 
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running...'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
app.use('/api/vendor', vendorRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/orders', orderRoutes);




