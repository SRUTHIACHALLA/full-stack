import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

// Fetch all products
const products = await Product.find();

for (const product of products) {
  const vendorEmail = `${product.vendorId}@shopiverse.com`; 
  const vendor = await User.findOne({
    role: 'vendor',
    $or: [
      { email: `${product.vendorId}@shopiverse.com` },
      { name: product.vendorId } // Try matching vendor name too
    ]
  });

  if (vendor) {
    await Product.updateOne(
      { _id: product._id },
      { $set: { vendorId: vendor._id } }
    );
    console.log(`✅ Updated ${product.title} → Vendor: ${vendor.name}`);
  } else {
    console.log(`❌ Vendor not found for ${product.vendorId} in ${product.title}`);
  }
}

await mongoose.disconnect();
console.log('Vendor ID migration complete!');
