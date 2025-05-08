// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stock: Number,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
