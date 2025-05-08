import Product from '../models/Product.js';

export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching vendor products:", err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const uploadProduct = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;
    const image = req.file?.path; // Uploaded image path from Cloudinary

    const product = await Product.create({
      vendorId: req.user._id,
      title,
      price,
      category,
      image,
      description
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product upload failed:", err);
    res.status(500).json({ message: 'Product upload failed' });
  }
};
