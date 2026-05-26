import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, ArrowPathIcon, CubeIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

const StockManagement = () => {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newQuantity) => {
    if (!hasRole(['admin', 'store_keeper'])) {
      alert('You do not have permission to update stock');
      return;
    }
    
    setUpdating(productId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/products/${productId}`, 
        { quantity: newQuantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Update and monitor inventory levels</p>
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.quantity === 0 ? 'bg-red-100 text-red-700' :
                  product.quantity <= product.minStockLevel ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {product.quantity === 0 ? 'Out of Stock' :
                   product.quantity <= product.minStockLevel ? 'Low Stock' :
                   'In Stock'}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="text-xl font-bold text-gray-800">{product.quantity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      product.quantity === 0 ? 'bg-red-500' :
                      product.quantity <= product.minStockLevel ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((product.quantity / (product.minStockLevel * 2)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Min level: {product.minStockLevel}</p>
              </div>
              
              {hasRole(['admin', 'store_keeper']) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStock(product._id, product.quantity + 1)}
                    disabled={updating === product._id}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    + Add Stock
                  </button>
                  <button
                    onClick={() => updateStock(product._id, Math.max(0, product.quantity - 1))}
                    disabled={updating === product._id || product.quantity === 0}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    - Remove Stock
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <CubeIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default StockManagement;