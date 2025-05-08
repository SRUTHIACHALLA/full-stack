import Product from '../models/Product.js';

// Get all products with vendor populated (admin view)
export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('vendorId', '_id name');
      res.json(products);
    } catch (err) {
      console.error('Product Fetch Error:', err.message);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  };
  

// Delete a product (admin action)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
