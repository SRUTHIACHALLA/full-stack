import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password, location, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed, location, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Email exists' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found");
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch");
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({_id: user._id, role: user.role }, process.env.JWT_SECRET);
  console.log("✅ Login success for:", email);
  res.json({
    token,
    user: {
      _id: user._id,        
      role: user.role,
      name: user.name,
      email: user.email
    }
  });
};


