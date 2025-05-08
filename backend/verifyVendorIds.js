import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce';

async function verify() {
  await mongoose.connect(MONGO_URI);
  console.log("🔍 Verifying vendorId fields...");

  const products = await Product.find();

  products.forEach(p => {
    console.log(`📦 ${p.title} → vendorId:`, typeof p.vendorId, p.vendorId);
  });

  await mongoose.disconnect();
}

verify();
