import jwt from 'jsonwebtoken';

// Check if token is present and valid
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded token:", decoded);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Role-based verification middleware
export const verifyRole = (role) => {
  return (req, res, next) => {
    console.log("🧾 Role check:", req.user.role);

    if (!req.user || (req.user.role !== role && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };

};

export const verifyCustomer = (req, res, next) => {
  if (!req.user || (req.user.role !== 'customer' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
// Shortcut middlewares for vendor and customer
export const verifyVendor = verifyRole('vendor');
