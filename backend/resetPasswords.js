// resetPasswords.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // adjust if your path is different

dotenv.config(); // to load MONGO_URI from .env

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    for (let user of users) {
      const prefix = user.email?.split('@')[0];
      if (!prefix) continue;

      const hashed = await bcrypt.hash(prefix, 10);
      user.password = hashed;
      await user.save();
      console.log(`🔐 Password reset for ${user.email} → ${prefix}`);
    }

    console.log("✅ All passwords updated!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error resetting passwords:", err);
    process.exit(1);
  }
}

resetPasswords();
