import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const fixStringVendorIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Use native MongoDB driver to get raw documents
    const rawProducts = await mongoose.connection.db.collection('products').find({}).toArray();

    for (const rawProduct of rawProducts) {
      const stringVendorId = rawProduct.vendorId;

      // Skip if already ObjectId
      if (mongoose.Types.ObjectId.isValid(stringVendorId)) continue;

      // Skip if not a string
      if (typeof stringVendorId !== 'string') {
        console.warn(`⚠️ Skipping product ${rawProduct._id} - invalid vendorId`);
        continue;
      }

      const email = `${stringVendorId}@shopiverse.com`;
      const vendor = await User.findOne({ email, role: 'vendor' });

      if (!vendor) {
        console.warn(`⚠️ No vendor found for ${email}`);
        continue;
      }

      // Update vendorId to correct ObjectId
      await Product.updateOne(
        { _id: rawProduct._id },
        { $set: { vendorId: vendor._id } }
      );

      console.log(`✅ Updated vendorId for product ${rawProduct._id}`);
    }

    console.log('🎉 All done.');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

fixStringVendorIds();
