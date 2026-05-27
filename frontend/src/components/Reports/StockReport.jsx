import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  ArrowDownTrayIcon, 
  ExclamationTriangleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const StockReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reports/stock`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching stock report:', error);
      toast.error('Failed to fetch stock report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report?.products?.length) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Product Name', 'SKU', 'Category', 'Quantity', 'Buying Price', 'Selling Price', 'Status'];
    const rows = filteredProducts.map(p => [
      p.name,
      p.sku,
      p.category,
      p.quantity,
      `$${(p.buyingPrice || 0).toFixed(2)}`,
      `$${(p.sellingPrice || 0).toFixed(2)}`,
      p.status === 'out_of_stock' ? 'Out of Stock' : p.status === 'low_stock' ? 'Low Stock' : 'In Stock'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const filteredProducts = report?.products?.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(report?.products?.map(p => p.category) || [])];

  if (loading) return <LoadingSpinner />;

  const getStockStatusColor = (quantity, minStockLevel) => {
    if (quantity === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (quantity <= minStockLevel) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStockStatusText = (quantity, minStockLevel) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minStockLevel) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Stock Report
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Inventory status and stock level analysis
            </p>
          </div>
          <button 
            onClick={exportToCSV} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span className="font-medium">Export Report</span>
          </button>
        </div>

        {/* Alert Banner */}
        {(report?.lowStockCount > 0 || report?.outOfStockCount > 0) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
              <p className="text-yellow-800 font-medium">
                Alert: {report?.lowStockCount} product{report?.lowStockCount !== 1 ? 's are' : ' is'} low on stock and {report?.outOfStockCount} product{report?.outOfStockCount !== 1 ? 's are' : ' is'} out of stock!
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-blue-700">{report?.totalProducts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <CubeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              Unique products in inventory
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Total Stock Value</p>
                <p className="text-3xl font-bold text-green-700">${(report?.totalValue || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600">
              Total inventory valuation
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-yellow-700">{report?.lowStockCount || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-yellow-600">
              Products below minimum level
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-700">{report?.outOfStockCount || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-red-600">
              Products with zero inventory
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
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <XMarkIcon className="h-4 w-4" /> : null}
              </button>
              <button
                onClick={fetchReport}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium mr-2">Category:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CubeIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Inventory Status</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Complete list of all products with stock levels</p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <CubeIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500">No products match your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Buying Price</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Selling Price</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{product.description?.substring(0, 50)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold text-lg ${
                          product.quantity === 0 ? 'text-red-600' :
                          product.quantity <= product.minStockLevel ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {product.quantity}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/ {product.minStockLevel}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-600">${(product.buyingPrice || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-800">${(product.sellingPrice || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStockStatusColor(product.quantity, product.minStockLevel)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            product.quantity === 0 ? 'bg-red-500' :
                            product.quantity <= product.minStockLevel ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></span>
                          {getStockStatusText(product.quantity, product.minStockLevel)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alert Section */}
        {report?.lowStockProducts?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-bold text-yellow-800">Low Stock Alert</h2>
              </div>
              <p className="text-sm text-yellow-700 mt-1">Products that need immediate attention</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Min Level</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Reorder Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.lowStockProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-red-600 text-lg">{product.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-600">{product.minStockLevel}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-orange-600">
                          {Math.max((product.minStockLevel || 0) * 2 - (product.quantity || 0), product.minStockLevel || 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {report?.products?.length || 0} products
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-600">In Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                <span className="text-xs text-gray-600">Low Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                <span className="text-xs text-gray-600">Out of Stock</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockReport;