import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  price: Number,
  quantity: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [productSchema],
  totalAmount: Number,
  date: Date,
  location: {
    address: String,
    city: String,
    state: String,
    zip: String
  },
  status: { type: String, default: 'Placed' }
});

export default mongoose.model('Order', orderSchema);
