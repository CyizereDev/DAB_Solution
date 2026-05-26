import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiTrash2, 
  FiPlus, 
  FiTruck, 
  FiFileText, 
  FiShoppingBag, 
  FiDollarSign,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiTrendingUp,
  FiInfo
} from 'react-icons/fi';
import { MdAttachMoney, MdLocalShipping } from 'react-icons/md';
import { FaBoxes, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import { HiDocumentText, HiShoppingCart } from 'react-icons/hi2';

const API_BASE_URL = 'http://localhost:5000/api';

const NewPurchase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    supplier: '',
    items: [],
    poNumber: ''
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchData();
    generatePONumber();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching products...');
      const productsRes = await axios.get(`${API_BASE_URL}/products`);
      const productsData = productsRes.data?.data || [];
      setProducts(productsData);
      
      // Extract unique suppliers from products
      const uniqueSuppliers = [...new Set(productsData.map(p => p.supplier).filter(s => s))];
      setSuppliers(uniqueSuppliers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Make sure backend is running.');
      setProducts([]);
    }
  };

  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    const poNumber = `PO-${year}${month}${day}-${random}`;
    setFormData(prev => ({ ...prev, poNumber }));
  };

  const addItem = () => {
    if (!selectedProduct || !quantity || quantity <= 0) {
      toast.error('Please select a product and enter valid quantity');
      return;
    }

    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    const existingItem = formData.items.find(item => item.product === selectedProduct);
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product === selectedProduct
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.buyingPrice }
            : item
        )
      }));
      toast.success(`Updated quantity for ${product.name}`);
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          product: product._id,
          productName: product.name,
          quantity: quantity,
          buyingPrice: product.buyingPrice,
          total: quantity * product.buyingPrice
        }]
      }));
      toast.success(`Added ${product.name} to purchase order`);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product !== productId)
    }));
    toast.success('Item removed');
  };

  const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const total = subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.supplier) {
      toast.error('Please select a supplier');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    
    try {
      const purchaseData = {
        supplier: formData.supplier,
        items: formData.items,
        poNumber: formData.poNumber,
        subtotal,
        total
      };
      
      console.log('Submitting purchase:', purchaseData);
      await axios.post(`${API_BASE_URL}/purchases`, purchaseData);
      toast.success('Purchase recorded successfully!');
      navigate('/purchases');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.response?.data?.message || 'Error recording purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/purchases')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
          >
            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Purchases</span>
          </button>
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Form - Left Side */}
          <div className="flex-1 space-y-6">
            {/* Purchase Details Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                    <FiTruck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Purchase Details</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Create a new purchase order</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PO Number
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'poNumber' ? 'transform scale-[1.01]' : ''}`}>
                      <HiDocumentText className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-gray-400`} />
                      <input
                        type="text"
                        value={formData.poNumber}
                        onFocus={() => setFocusedField('poNumber')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'supplier' ? 'transform scale-[1.01]' : ''}`}>
                      <MdLocalShipping className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-xl ${focusedField === 'supplier' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <select
                        value={formData.supplier}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                        onFocus={() => setFocusedField('supplier')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier} value={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaBoxes className="h-5 w-5 text-blue-500" />
                      Add Products
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <select
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name} - ${product.buyingPrice}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={addItem}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
                        >
                          <FiPlus className="h-4 w-4" />
                          <span className="hidden sm:inline font-medium">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                    <FaShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Purchase Items</h2>
                    <p className="text-green-100 text-sm mt-0.5">{formData.items.length} items added</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {formData.items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No items added yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add products to your purchase order</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={item.product} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded-lg">#{index + 1}</span>
                            <div>
                              <p className="font-semibold text-gray-800">{item.productName}</p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {item.quantity} × ${item.buyingPrice} = 
                                <span className="font-semibold text-green-600 ml-1">${item.total.toFixed(2)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary - Right Side */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-4 hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                    <FiTrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                    <p className="text-purple-100 text-sm mt-0.5">Review your purchase</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || formData.items.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="h-5 w-5" />
                        <span>Create Purchase Order</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/purchases')}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiXCircle className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiInfo className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">Purchase Information</p>
                  <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                    Creating a purchase order will automatically update your inventory stock levels.
                    Make sure to verify all quantities before submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items to Purchase</p>
                    <p className="text-lg font-bold text-gray-800">{formData.items.length}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MdAttachMoney className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-purple-600">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchase;