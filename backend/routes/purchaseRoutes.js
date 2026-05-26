const express = require('express');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

const router = express.Router();

// GET all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ purchaseDate: -1 });
    console.log(`Found ${purchases.length} purchases`);
    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single purchase
router.get('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    res.json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create purchase
router.post('/', async (req, res) => {
  try {
    const { supplier, items, poNumber, subtotal, total } = req.body;
    
    console.log('Creating purchase order:', { supplier, poNumber, itemsCount: items.length });
    
    // Validate required fields
    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Supplier and items are required' 
      });
    }
    
    // Update product stock levels
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
        console.log(`Updated stock for ${product.name}: +${item.quantity}`);
      }
    }
    
    // Create purchase order
    const purchase = new Purchase({
      poNumber,
      supplier,
      items,
      subtotal,
      total,
      purchaseDate: new Date()
    });
    
    await purchase.save();
    console.log('Purchase order created:', purchase.poNumber);
    
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update purchase
router.put('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    res.json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE purchase
router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    res.json({ success: true, message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;