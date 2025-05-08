import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getCustomerOrders = async (req, res) => {
  const orders = await Order.find({ customerId: req.user.id }).populate('products.productId');
  res.json(orders);
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const placeOrder = async (req, res) => {
  const { vendorId, products, totalAmount } = req.body;

  if (!vendorId || !products?.length || !totalAmount) {
    return res.status(400).json({ message: "Missing order fields" });
  }

  const newOrder = new Order({
    customerId: req.user.id,
    vendorId,
    products,
    totalAmount,
    deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: "Placed",
    date: new Date()
  });

  try {
    await newOrder.save();
    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error('🔥 Error saving order:', error);
    res.status(500).json({ error: "Order creation failed" });
  }
};
