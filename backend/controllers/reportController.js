import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Purchase from '../models/Purchase.js';

export const getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const sales = await Sale.find({
      saleDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('customer', 'name');
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyIncomeReport = async (req, res) => {
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
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCost = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const netIncome = totalRevenue - totalCost;
    
    res.json({
      success: true,
      data: {
        year,
        month,
        totalRevenue,
        totalCost,
        netIncome,
        profitMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0,
        totalTransactions: sales.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStockReport = async (req, res) => {
  try {
    const products = await Product.find().sort({ quantity: 1 });
    
    const lowStock = products.filter(p => p.quantity <= p.minStockLevel);
    const outOfStock = products.filter(p => p.quantity === 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.buyingPrice), 0);
    
    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        products,
        lowStockProducts: lowStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalPurchases: -1 });
    
    const topCustomers = customers.slice(0, 10);
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFinancialReport = async (req, res) => {
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
      
      const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      const cost = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
      
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
    res.status(500).json({ success: false, message: error.message });
  }
};