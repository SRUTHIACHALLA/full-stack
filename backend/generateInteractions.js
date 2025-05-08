import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import fs from 'fs';
import { parse } from 'json2csv';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

// Fetch orders
const orders = await Order.find();
console.log(`Fetched ${orders.length} orders`);

// Initialize interactions
const interactions = [];

// Loop through orders
orders.forEach(order => {
  const customerId = order.customerId?.toString();
  if (!customerId) {
    console.log(`❌ Skipped order ${order._id} due to missing customerId`);
    return;
  }

  // Log order products
  console.log(`✅ Processing order ${order._id}`);
  console.log('Products:', order.products);

  // Process each product in the order
  order.products.forEach(p => {
    const productId = p?._id?.toString();
    if (productId) {
      interactions.push({
        userId: customerId,
        productId: productId,
        interaction: 1
      });
    } else {
      console.log(`❌ Missing productId in order ${order._id}`);
    }
  });
});

// Log interactions
console.log('Total Interactions:', interactions.length);
console.log('Sample Interactions:', interactions.slice(0, 5));

// Check if interactions exist before converting to CSV
if (interactions.length === 0) {
  console.log('❌ No interactions found! Please check data.');
  await mongoose.disconnect();
  process.exit(1);
}

// Convert interactions to CSV
const csv = parse(interactions);
fs.writeFileSync('interactions.csv', csv);
console.log('✅ interactions.csv generated!');

// Disconnect
await mongoose.disconnect();
