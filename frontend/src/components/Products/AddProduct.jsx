import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  HiCube, 
  HiTag, 
  HiFolder, 
  HiDocumentText, 
  HiTruck,
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiHome,
  HiShoppingBag,
  HiPlusCircle,
  HiChartBar
} from 'react-icons/hi2';
import { 
  FaLaptop, 
  FaChair, 
  FaBox, 
  FaClipboardList
} from 'react-icons/fa';
import { MdInventory, MdAttachMoney } from 'react-icons/md';
import { BiDollar, BiCategory } from 'react-icons/bi';

// Use the same API_BASE_URL as AuthContext
const API_BASE_URL = 'http://localhost:5000/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    minStockLevel: '10',
    supplier: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Sending product to:', `${API_BASE_URL}/products`);
      console.log('Product data:', formData);
      
      const response = await axios.post(`${API_BASE_URL}/products`, formData);
      
      console.log('Response:', response.data);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Electronics', icon: FaLaptop, color: 'blue' },
    { name: 'Office Supplies', icon: FaClipboardList, color: 'purple' },
    { name: 'Home Equipment', icon: HiHome, color: 'green' },
    { name: 'Furniture', icon: FaChair, color: 'orange' },
    { name: 'Other', icon: FaBox, color: 'gray' }
  ];

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return HiShoppingBag;
    return category.icon;
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 'gray';
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[category.color];
  };

  const calculateProfit = () => {
    const buying = parseFloat(formData.buyingPrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    const profit = selling - buying;
    const margin = selling > 0 ? (profit / selling) * 100 : 0;
    return { profit, margin };
  };

  const { profit, margin } = calculateProfit();

  const CategoryIcon = formData.category ? getCategoryIcon(formData.category) : HiFolder;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </button>
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <HiPlusCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Product</h1>
                <p className="text-blue-100 mt-1 text-sm">Create a new product in your inventory</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                    <HiCube className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'sku' ? 'transform scale-[1.01]' : ''}`}>
                    <HiTag className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'sku' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('sku')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-mono"
                      placeholder="PRD-001"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'category' ? 'transform scale-[1.01]' : ''}`}>
                    <BiCategory className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'category' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('category')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(formData.category)}`}>
                        <CategoryIcon className="h-3 w-3" />
                        {formData.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'description' ? 'transform scale-[1.01]' : ''}`}>
                    <HiDocumentText className={`absolute left-3 top-3 transition-colors duration-200 ${focusedField === 'description' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      rows="4"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      placeholder="Enter product description..."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buying Price <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'buyingPrice' ? 'transform scale-[1.01]' : ''}`}>
                      <BiDollar className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'buyingPrice' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        name="buyingPrice"
                        value={formData.buyingPrice}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('buyingPrice')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'sellingPrice' ? 'transform scale-[1.01]' : ''}`}>
                      <MdAttachMoney className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'sellingPrice' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('sellingPrice')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Profit Preview */}
                {(formData.buyingPrice || formData.sellingPrice) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiChartBar className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-800">Profit Preview</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profit per unit:</span>
                      <span className="font-bold text-green-600">${profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">Margin:</span>
                      <span className="font-semibold text-green-600">{margin.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(margin, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Stock Levels */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Stock <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'quantity' ? 'transform scale-[1.01]' : ''}`}>
                      <MdInventory className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'quantity' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('quantity')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Stock Level
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'minStockLevel' ? 'transform scale-[1.01]' : ''}`}>
                      <HiChartBar className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'minStockLevel' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        name="minStockLevel"
                        value={formData.minStockLevel}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('minStockLevel')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Alert */}
                {formData.quantity && formData.minStockLevel && parseInt(formData.quantity) <= parseInt(formData.minStockLevel) && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Initial stock is at or below minimum stock level. Consider increasing initial stock.
                    </p>
                  </div>
                )}

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supplier
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'supplier' ? 'transform scale-[1.01]' : ''}`}>
                    <HiTruck className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'supplier' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('supplier')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="h-5 w-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <HiXCircle className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;