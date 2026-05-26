const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const [
      totalProducts,
      totalCustomers,
      todaySales,
      monthlySales,
      lowStock,
      totalSales
    ] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.find({ saleDate: { $gte: today } }),
      Sale.find({ 
        saleDate: { 
          $gte: startOfMonth, 
          $lte: endOfMonth 
        } 
      }),
      Product.find({ 
        $expr: { $lte: ["$quantity", "$minStockLevel"] } 
      }),
      Sale.find()
    ]);
    
    const todaySalesTotal = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const monthlySalesTotal = monthlySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalRevenue = totalSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    
    // Calculate monthly growth (compare with previous month)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const lastMonthSales = await Sale.find({
      saleDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const lastMonthTotal = lastMonthSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    
    const monthlyGrowth = lastMonthTotal > 0 
      ? ((monthlySalesTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        todaySales: todaySalesTotal,
        monthlySales: monthlySalesTotal,
        lowStockCount: lowStock.length,
        todayTransactions: todaySales.length,
        totalRevenue,
        totalOrders: totalSales.length,
        monthlyGrowth: parseFloat(monthlyGrowth)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {
        totalProducts: 0,
        totalCustomers: 0,
        todaySales: 0,
        monthlySales: 0,
        lowStockCount: 0,
        todayTransactions: 0,
        totalRevenue: 0,
        totalOrders: 0,
        monthlyGrowth: 0
      }
    });
  }
});

// Get recent activities
router.get('/activities', protect, async (req, res) => {
  try {
    const recentSales = await Sale.find()
      .populate('soldBy', 'username')
      .populate('customer', 'name')
      .sort({ saleDate: -1 })
      .limit(10);
    
    const activities = recentSales.map(sale => ({
      _id: sale._id,
      action: 'Sale completed',
      details: `Invoice ${sale.invoiceNumber} - $${sale.total?.toFixed(2)}`,
      user: sale.soldBy || { username: 'System' },
      timestamp: sale.saleDate
    }));
    
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Activities error:', error);
    res.json({ success: true, data: [] });
  }
});

module.exports = router;