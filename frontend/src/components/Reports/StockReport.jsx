import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowDownTrayIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

const StockReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get('/api/reports/stock');
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report?.products) return;
    
    const headers = ['Product Name', 'SKU', 'Category', 'Quantity', 'Buying Price', 'Selling Price', 'Status'];
    const rows = filteredProducts.map(p => [
      p.name,
      p.sku,
      p.category,
      p.quantity,
      `$${p.buyingPrice.toFixed(2)}`,
      `$${p.sellingPrice.toFixed(2)}`,
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
  };

  const filteredProducts = report?.products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(report?.products?.map(p => p.category) || [])];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Stock Report</h1>
          <p className="text-gray-600 mt-1">Inventory status and stock level analysis</p>
        </div>
        <button onClick={exportToCSV} className="btn-primary flex items-center space-x-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Alert Cards */}
      {(report?.lowStockCount > 0 || report?.outOfStockCount > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">
              Alert: {report?.lowStockCount} products are low on stock and {report?.outOfStockCount} products are out of stock!
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{report?.totalProducts || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Stock Value</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">${report?.totalValue?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{report?.lowStockCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{report?.outOfStockCount || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Buying Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Selling Price</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.description?.substring(0, 50)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${
                      product.quantity === 0 ? 'text-red-600' :
                      product.quantity <= product.minStockLevel ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">${product.buyingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-semibold">${product.sellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.quantity === 0 ? 'bg-red-100 text-red-800' :
                      product.quantity <= product.minStockLevel ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.quantity === 0 ? 'Out of Stock' :
                       product.quantity <= product.minStockLevel ? 'Low Stock' :
                       'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Low Stock Section */}
      {report?.lowStockProducts?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Low Stock Alert
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-yellow-800">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-yellow-800">Current Stock</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-yellow-800">Min Level</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-yellow-800">Reorder Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.lowStockProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-right text-red-600">{product.quantity}</td>
                    <td className="px-4 py-3 text-right">{product.minStockLevel}</td>
                    <td className="px-4 py-3 text-right">
                      {Math.max(product.minStockLevel * 2 - product.quantity, product.minStockLevel)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReport;