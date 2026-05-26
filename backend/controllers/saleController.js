import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000);
  return `INV-${year}${month}${day}-${random}`;
};

export const createSale = async (req, res) => {
  try {
    const { customerId, items, paymentMethod, discount, tax } = req.body;
    
    let subtotal = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      item.price = product.sellingPrice;
      item.total = item.quantity * product.sellingPrice;
      item.productName = product.name;
      item.sku = product.sku;
      subtotal += item.total;
      
      product.quantity -= item.quantity;
      await product.save();
    }
    
    const total = subtotal + (tax || 0) - (discount || 0);
    
    const sale = await Sale.create({
      invoiceNumber: generateInvoiceNumber(),
      customer: customerId,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      paymentMethod,
      soldBy: req.user._id
    });
    
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalPurchases: total, totalOrders: 1 },
      $set: { lastPurchaseDate: new Date() }
    });
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Sale created',
      entity: 'sale',
      entityId: sale._id,
      details: `Sale ${sale.invoiceNumber} created for $${total}`
    });
    
    const populatedSale = await Sale.findById(sale._id)
      .populate('customer', 'name email phone')
      .populate('soldBy', 'username');
    
    res.status(201).json({ success: true, data: populatedSale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name email phone')
      .populate('soldBy', 'username')
      .sort({ saleDate: -1 });
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSaleById = async (req, res) => {
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
    res.status(500).json({ success: false, message: error.message });
  }
};