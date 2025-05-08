import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// User model
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

const isHashed = (password) => {
  return password && password.startsWith('$2a$');
};

const hashAllPasswords = async () => {
  const users = await User.find();

  for (let user of users) {
    if (!isHashed(user.password)) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
      console.log(`✅ Password hashed for ${user.email}`);
    } else {
      console.log(`🔒 Already hashed: ${user.email}`);
    }
  }

  console.log('✅ All passwords checked and updated.');
  process.exit();
};

hashAllPasswords();
