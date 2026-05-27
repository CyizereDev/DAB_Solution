const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

const router = express.Router();

// Get daily sales report
router.get('/daily-sales', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const sales = await Sale.find({
      saleDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('customer', 'name email phone');
    
    const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalTransactions = sales.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    res.json({
      success: true,
      data: {
        date: targetDate,
        totalSales,
        totalTransactions,
        averageTransaction,
        sales
      }
    });
  } catch (error) {
    console.error('Error fetching daily sales report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {
        totalSales: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        sales: []
      }
    });
  }
});

// Get monthly income report
router.get('/monthly-income', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const sales = await Sale.find({
      saleDate: { $gte: startDate, $lte: endDate }
    });
    
    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate, $lte: endDate }
    });
    
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalCost = purchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
    const netIncome = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
    
    // Calculate daily breakdown
    const dailyBreakdown = {};
    sales.forEach(sale => {
      const day = sale.saleDate.getDate();
      if (!dailyBreakdown[day]) {
        dailyBreakdown[day] = { revenue: 0, transactions: 0 };
      }
      dailyBreakdown[day].revenue += sale.total || 0;
      dailyBreakdown[day].transactions += 1;
    });
    
    res.json({
      success: true,
      data: {
        year,
        month,
        totalRevenue,
        totalCost,
        netIncome,
        profitMargin,
        totalTransactions: sales.length,
        dailyBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching monthly income report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {
        totalRevenue: 0,
        totalCost: 0,
        netIncome: 0,
        profitMargin: 0,
        totalTransactions: 0,
        dailyBreakdown: {}
      }
    });
  }
});

// Get stock report
router.get('/stock', protect, roleCheck('admin', 'sales_manager', 'store_keeper'), async (req, res) => {
  try {
    const products = await Product.find().sort({ quantity: 1 });
    
    const lowStock = products.filter(p => p.quantity <= p.minStockLevel);
    const outOfStock = products.filter(p => p.quantity === 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.buyingPrice || 0)), 0);
    
    const productsWithStatus = products.map(p => ({
      ...p.toObject(),
      status: p.quantity === 0 ? 'out_of_stock' : 
              p.quantity <= p.minStockLevel ? 'low_stock' : 'in_stock'
    }));
    
    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        products: productsWithStatus,
        lowStockProducts: lowStock
      }
    });
  } catch (error) {
    console.error('Error fetching stock report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        products: [],
        lowStockProducts: []
      }
    });
  }
});

// Get customer report
router.get('/customers', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalPurchases: -1 });
    
    const topCustomers = customers.slice(0, 10);
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0);
    const averagePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        totalRevenue,
        averagePerCustomer,
        topCustomers,
        allCustomers: customers
      }
    });
  } catch (error) {
    console.error('Error fetching customer report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {
        totalCustomers: 0,
        totalRevenue: 0,
        averagePerCustomer: 0,
        topCustomers: [],
        allCustomers: []
      }
    });
  }
});

// Get financial report (monthly data for charts)
router.get('/financial', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59);
      
      const sales = await Sale.find({
        saleDate: { $gte: startDate, $lte: endDate }
      });
      
      const purchases = await Purchase.find({
        purchaseDate: { $gte: startDate, $lte: endDate }
      });
      
      const revenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const cost = purchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
      
      monthlyData.push({
        month,
        revenue,
        cost,
        profit: revenue - cost
      });
    }
    
    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error fetching financial report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: []
    });
  }
});

// Get low stock alert report (for dashboard)
router.get('/low-stock', protect, roleCheck('admin', 'sales_manager', 'store_keeper'), async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    }).sort({ quantity: 1 });
    
    res.json({
      success: true,
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts
      }
    });
  } catch (error) {
    console.error('Error fetching low stock report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: { count: 0, products: [] }
    });
  }
});

// Get sales summary (for dashboard charts)
router.get('/sales-summary', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlySales = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59);
      
      const sales = await Sale.find({
        saleDate: { $gte: startDate, $lte: endDate }
      });
      
      const total = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const count = sales.length;
      
      monthlySales.push({
        month,
        total,
        count,
        average: count > 0 ? total / count : 0
      });
    }
    
    res.json({
      success: true,
      data: monthlySales
    });
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: []
    });
  }
});

// Get top products report
router.get('/top-products', protect, roleCheck('admin', 'sales_manager'), async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Aggregate sales to get top products
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: {
        _id: "$items.product",
        productName: { $first: "$items.productName" },
        sku: { $first: "$items.sku" },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.total" }
      }},
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Error fetching top products report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: []
    });
  }
});

module.exports = router;