import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon,
  ArrowPathIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

// Use the full backend URL
const API_BASE_URL = 'http://localhost:5000/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products`);
      const response = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products response:', response.data);
      
      const productData = response.data?.data || [];
      setProducts(productData);
      
      if (productData.length === 0) {
        console.log('No products found in database');
      } else {
        console.log(`Loaded ${productData.length} products`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => (p.quantity || 0) <= (p.minStockLevel || 0)).length;
  const outOfStockCount = products.filter(p => (p.quantity || 0) === 0).length;
  const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.sellingPrice || 0)), 0);

  const getStockStatusIcon = (quantity, minStockLevel) => {
    if (quantity === 0) return '🔴';
    if (quantity <= minStockLevel) return '🟡';
    return '🟢';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Products Inventory
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        {hasRole(['admin', 'store_keeper']) && (
          <Link 
            to="/products/add" 
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">Add Product</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Products</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{totalProducts}</p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Value</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">${totalValue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Low Stock</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-700">{lowStockCount}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-yellow-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-700">{outOfStockCount}</p>
            </div>
            <TagIcon className="h-8 w-8 text-red-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span>Filters</span>
              {showFilters ? <XMarkIcon className="h-4 w-4" /> : <TagIcon className="h-4 w-4" />}
            </button>
            
            <button
              onClick={fetchProducts}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          // Empty State - No Products
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products in inventory</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first product</p>
            {hasRole(['admin', 'store_keeper']) && (
              <Link 
                to="/products/add" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Your First Product</span>
              </Link>
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty State - No Search Results
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching products</h3>
            <p className="text-gray-500 mb-2">We couldn't find any products matching "{search}"</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        ) : (
          // Products Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{getStockStatusIcon(product.quantity || 0, product.minStockLevel || 0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.description?.substring(0, 40) || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.sku || 'N/A'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div>
                        <p className="font-bold text-gray-900">${(product.sellingPrice || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-400 line-through">${(product.buyingPrice || 0).toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className={`font-bold text-base ${(product.quantity || 0) <= (product.minStockLevel || 0) ? 'text-red-600' : 'text-green-600'}`}>
                          {product.quantity || 0}
                        </span>
                        <span className="text-xs text-gray-400">/ {product.minStockLevel || 0}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        (product.quantity || 0) === 0 ? 'bg-red-100 text-red-800' :
                        (product.quantity || 0) <= (product.minStockLevel || 0) ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {(product.quantity || 0) === 0 ? 'Out of Stock' :
                         (product.quantity || 0) <= (product.minStockLevel || 0) ? 'Low Stock' :
                         'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        {hasRole(['admin']) && (
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats - Only show when products exist */}
      {products.length > 0 && filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>In Stock</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Low Stock</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Out of Stock</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;