import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendorId', 'name email');
    res.json(products);
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')       // populates customer name
      .populate('vendorId', 'name email')         // populates vendor name
      .populate('products.productId', 'title');   // populates product titles
    res.json(orders);
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};
