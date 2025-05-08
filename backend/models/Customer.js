import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  location: { type: Object, default: {} },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
