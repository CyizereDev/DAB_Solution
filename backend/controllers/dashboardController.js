import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Sale from '../models/Sale.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalProducts, totalCustomers, todaySales, monthlySales, lowStock] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.find({ saleDate: { $gte: today } }),
      Sale.find({
        saleDate: {
          $gte: new Date(today.getFullYear(), today.getMonth(), 1),
          $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0)
        }
      }),
      Product.find({ quantity: { $lte: '$minStockLevel' } })
    ]);
    
    const todaySalesTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const monthlySalesTotal = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
    
    res.json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        todaySales: todaySalesTotal,
        monthlySales: monthlySalesTotal,
        lowStockCount: lowStock.length,
        todayTransactions: todaySales.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find()
      .populate('user', 'username')
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};