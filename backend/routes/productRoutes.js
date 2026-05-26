const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    
    const { name, sku, category, description, buyingPrice, sellingPrice, quantity, minStockLevel, supplier } = req.body;
    
    // Validate required fields
    if (!name || !sku || !category || !buyingPrice || !sellingPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, sku, category, buyingPrice, sellingPrice' 
      });
    }
    
    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product with this SKU already exists' 
      });
    }
    
    // Create new product
    const product = new Product({
      name,
      sku,
      category,
      description: description || '',
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity) || 0,
      minStockLevel: Number(minStockLevel) || 10,
      supplier: supplier || ''
    });
    
    await product.save();
    
    console.log('Product created successfully:', product);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { quantity, type } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (type === 'in') {
      product.quantity += quantity;
    } else if (type === 'out') {
      if (product.quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      product.quantity -= quantity;
    }
    
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;