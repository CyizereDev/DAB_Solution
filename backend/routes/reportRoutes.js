const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Daily sales report
router.get('/daily-sales', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const sales = await Sale.find({
      saleDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('customer', 'name');
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    res.json({
      success: true,
      data: {
        totalSales,
        totalTransactions: sales.length,
        averageTransaction: sales.length > 0 ? totalSales / sales.length : 0,
        sales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stock report
router.get('/stock', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ quantity: 1 });
    const lowStock = products.filter(p => p.quantity <= p.minStockLevel);
    const outOfStock = products.filter(p => p.quantity === 0);
    
    res.json({
      success: true,
      data: {
        products,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.quantity * p.buyingPrice), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Customer report
router.get('/customers', protect, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalPurchases: -1 });
    
    res.json({
      success: true,
      data: {
        customers,
        topCustomers: customers.slice(0, 10),
        totalCustomers: customers.length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalPurchases, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Financial report
router.get('/financial', protect, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59);
      
      const sales = await Sale.find({
        saleDate: { $gte: startDate, $lte: endDate }
      });
      
      const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      
      monthlyData.push({
        month,
        revenue,
        profit: revenue * 0.4 // Example calculation
      });
    }
    
    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;