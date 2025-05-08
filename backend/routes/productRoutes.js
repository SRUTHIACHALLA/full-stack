import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';
import { verifyVendor } from '../middlewares/authMiddleware.js'; // ✅ correct

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET /api/products/vendor - Get products for logged-in vendor
import { verifyVendor } from '../middlewares/authMiddleware.js';

router.get('/vendor', protect, verifyVendor, async (req, res) => {
  const vendorId = req.user._id;
  const products = await Product.find({ vendorId });
  res.json(products);
});
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Product not found" });
  }
});
// POST /api/products/create - Create new product
router.post('/create', protect, verifyVendor, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const vendorId = req.user._id;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      vendorId,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});


// PUT /api/products/:id - Edit existing product
router.put('/:id', protect, verifyVendor, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', verifyVendor, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;
