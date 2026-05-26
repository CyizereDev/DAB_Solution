import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Product created',
      entity: 'product',
      entityId: product._id,
      details: `Product ${product.name} created`
    });
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Product updated',
      entity: 'product',
      entityId: product._id,
      details: `Product ${product.name} updated`
    });
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Product deleted',
      entity: 'product',
      entityId: product._id,
      details: `Product ${product.name} deleted`
    });
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStock = async (req, res) => {
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
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Stock updated',
      entity: 'product',
      entityId: product._id,
      details: `Stock ${type} for ${product.name}: ${quantity} units`
    });
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};