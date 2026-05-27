const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

const router = express.Router();

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000);
  return `INV-${year}${month}${day}-${random}`;
};

// Create sale
router.post('/', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const { customerId, items, paymentMethod, paymentStatus, discount, tax } = req.body;
    
    console.log('=== RECEIVED SALE DATA ===');
    console.log('Payment Method:', paymentMethod);
    console.log('Payment Status received:', paymentStatus);
    console.log('Discount:', discount);
    console.log('Tax:', tax);
    
    let subtotal = 0;
    const stockUpdates = []; // Track stock changes for response
    
    // Process each item and update stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      
      // Check if enough stock is available
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
        });
      }
      
      // Calculate item totals
      item.price = product.sellingPrice;
      item.total = item.quantity * product.sellingPrice;
      item.productName = product.name;
      item.sku = product.sku;
      subtotal += item.total;
      
      // UPDATE STOCK - Remove sold quantity
      const oldQuantity = product.quantity;
      product.quantity -= item.quantity;
      await product.save();
      
      // Track stock change
      stockUpdates.push({
        productName: product.name,
        sku: product.sku,
        oldQuantity,
        newQuantity: product.quantity,
        sold: item.quantity
      });
      
      console.log(`Stock updated for ${product.name}: ${oldQuantity} → ${product.quantity} (Sold: ${item.quantity})`);
    }
    
    const total = subtotal + (tax || 0) - (discount || 0);
    
    // Create sale record
    const sale = await Sale.create({
      invoiceNumber: generateInvoiceNumber(),
      customer: customerId,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      soldBy: req.user._id
    });
    
    console.log('Sale created with paymentStatus:', sale.paymentStatus);
    console.log('Stock updates:', stockUpdates);
    
    // Update customer purchase statistics
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalPurchases: total, totalOrders: 1 },
      $set: { lastPurchaseDate: new Date() }
    });
    
    const populatedSale = await Sale.findById(sale._id)
      .populate('customer', 'name email phone')
      .populate('soldBy', 'username');
    
    res.status(201).json({ 
      success: true, 
      data: populatedSale,
      stockUpdates // Include stock updates in response for debugging
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name email phone')
      .populate('soldBy', 'username')
      .sort({ saleDate: -1 });
    res.json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get sale by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer')
      .populate('items.product')
      .populate('soldBy', 'username');
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get sale by invoice number
router.get('/invoice/:number', protect, async (req, res) => {
  try {
    const sale = await Sale.findOne({ invoiceNumber: req.params.number })
      .populate('customer')
      .populate('items.product')
      .populate('soldBy', 'username');
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get sales by date range
router.get('/range', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sales = await Sale.find({
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('customer', 'name email');
    
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Debug route - check all sales (remove in production)
router.get('/debug/all', protect, roleCheck('admin'), async (req, res) => {
  try {
    const sales = await Sale.find().select('invoiceNumber paymentStatus paymentMethod');
    res.json({ 
      success: true, 
      data: sales,
      count: sales.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Debug route - check specific sale
router.get('/debug/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;