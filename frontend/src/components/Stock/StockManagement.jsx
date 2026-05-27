import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  CubeIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const StockManagement = () => {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newQuantity, productName) => {
    if (!hasRole(['admin', 'store_keeper'])) {
      toast.error('You do not have permission to update stock');
      return;
    }
    
    setUpdating(productId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/products/${productId}`, 
        { quantity: newQuantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success(`Stock updated for ${productName}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setUpdating(null);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Dynamic filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    );

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply sorting
    switch(sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'stock-low':
        filtered.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
        break;
      case 'stock-high':
        filtered.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        break;
      case 'category':
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, search, selectedCategory, sortBy]);

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => (p.quantity || 0) <= (p.minStockLevel || 0)).length;
  const outOfStockCount = products.filter(p => (p.quantity || 0) === 0).length;
  const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.sellingPrice || 0)), 0);

  const getStockStatus = (quantity, minStockLevel) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'red', icon: XCircleIcon };
    if (quantity <= minStockLevel) return { text: 'Low Stock', color: 'yellow', icon: ExclamationTriangleIcon };
    return { text: 'In Stock', color: 'green', icon: CheckCircleIcon };
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Stock Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Update and monitor inventory levels in real-time
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-700">{totalProducts}</p>
              </div>
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                <CubeIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-700">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-700">{outOfStockCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by product name, SKU, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
                {showFilters && <XMarkIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Product Name</option>
                    <option value="stock-low">Stock: Low to High</option>
                    <option value="stock-high">Stock: High to Low</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <CubeIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const stockStatus = getStockStatus(product.quantity, product.minStockLevel);
              const StatusIcon = stockStatus.icon;
              const progressWidth = Math.min(((product.quantity || 0) / ((product.minStockLevel || 10) * 2)) * 100, 100);
              
              return (
                <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {product.sku}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stockStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                        stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{stockStatus.text}</span>
                      </div>
                    </div>
                    
                    {/* Stock Level Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <span className={`text-2xl font-bold ${
                          product.quantity === 0 ? 'text-red-600' :
                          product.quantity <= product.minStockLevel ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {product.quantity}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              product.quantity === 0 ? 'bg-red-500' :
                              product.quantity <= product.minStockLevel ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                        <div className="absolute top-0 left-0 h-3 flex items-center px-2 text-[10px] text-white font-medium" style={{ width: `${progressWidth}%` }}>
                          {progressWidth > 20 && `${Math.round(progressWidth)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-gray-400">Min: {product.minStockLevel}</p>
                        <p className="text-xs text-gray-400">Max: {(product.minStockLevel || 10) * 2}</p>
                      </div>
                    </div>
                    
                    {/* Price Info */}
                    <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Buying Price</p>
                        <p className="font-semibold text-gray-700">${(product.buyingPrice || 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Selling Price</p>
                        <p className="font-semibold text-green-600">${(product.sellingPrice || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {hasRole(['admin', 'store_keeper']) && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateStock(product._id, (product.quantity || 0) + 1, product.name)}
                          disabled={updating === product._id}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span>Add Stock</span>
                        </button>
                        <button
                          onClick={() => updateStock(product._id, Math.max(0, (product.quantity || 0) - 1), product.name)}
                          disabled={updating === product._id || product.quantity === 0}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                          <span>Remove Stock</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Updating Indicator */}
                    {updating === product._id && (
                      <div className="mt-3 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating stock...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
            <p className="text-sm text-gray-500">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">In Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Low Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Out of Stock</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;