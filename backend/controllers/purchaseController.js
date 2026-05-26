import Purchase from '../models/Purchase.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

// Generate PO Number
const generatePONumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000);
  return `PO-${year}${month}${day}-${random}`;
};

// @desc    Create purchase order
// @route   POST /api/purchases
export const createPurchase = async (req, res) => {
  try {
    const { supplier, items, poNumber } = req.body;
    
    let subtotal = 0;
    const updatedItems = [];
    
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productName}` });
      }
      
      // Update product stock
      product.quantity += item.quantity;
      product.buyingPrice = item.buyingPrice; // Update buying price if changed
      await product.save();
      
      subtotal += item.total;
      updatedItems.push({
        product: item.product,
        productName: item.productName,
        quantity: item.quantity,
        buyingPrice: item.buyingPrice,
        total: item.total
      });
    }
    
    const purchase = await Purchase.create({
      poNumber: poNumber || generatePONumber(),
      supplier,
      items: updatedItems,
      subtotal,
      total: subtotal,
      purchasedBy: req.user._id
    });
    
    await ActivityLog.create({
      user: req.user._id,
      action: 'Purchase created',
      entity: 'purchase',
      entityId: purchase._id,
      details: `Purchase order ${purchase.poNumber} created for $${purchase.total} from ${supplier}`
    });
    
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('purchasedBy', 'username');
    
    res.status(201).json({ success: true, data: populatedPurchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all purchases
// @route   GET /api/purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('purchasedBy', 'username')
      .sort({ purchaseDate: -1 });
    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get purchase by ID
// @route   GET /api/purchases/:id
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('purchasedBy', 'username')
      .populate('items.product', 'name sku');
    
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    res.json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get purchases by date range
// @route   GET /api/purchases/range
export const getPurchasesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const purchases = await Purchase.find({
      purchaseDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('purchasedBy', 'username');
    
    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};