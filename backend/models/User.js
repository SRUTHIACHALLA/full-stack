import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' }
});

export default mongoose.model('User', userSchema);
