import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PrinterIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import InvoiceModal from './InvoiceModal';

const API_BASE_URL = 'http://localhost:5000/api';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.error('No auth token found');
        setSales([]);
        setLoading(false);
        return;
      }
      
      console.log('Fetching sales from:', `${API_BASE_URL}/sales`);
      const response = await axios.get(`${API_BASE_URL}/sales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Sales response:', response.data);
      const salesData = response.data?.data || [];
      setSales(salesData);
      console.log(`Loaded ${salesData.length} sales records`);
    } catch (error) {
      console.error('Error fetching sales:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized - please login again');
      }
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalTransactions = sales.length;
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const filteredSales = Array.isArray(sales) ? sales.filter(sale =>
    sale.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    sale.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    sale.paymentMethod?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const handleViewInvoice = (sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Sales History
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            View and manage all sales transactions
          </p>
        </div>
        <Link 
          to="/sales/new" 
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ShoppingBagIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">New Sale</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Sales</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">${totalSales.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Transactions</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">{totalTransactions}</p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Average Sale</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700">${averageSale.toFixed(2)}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by invoice number, customer name, or payment method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={fetchSales}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {sales.length === 0 ? (
          // Empty State - No Sales
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No sales yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first sale</p>
            <Link 
              to="/sales/new" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span>Create New Sale</span>
            </Link>
          </div>
        ) : filteredSales.length === 0 ? (
          // Empty State - No Search Results
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching sales</h3>
            <p className="text-gray-500 mb-2">We couldn't find any sales matching "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear search
            </button>
          </div>
        ) : (
          // Sales Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale, index) => (
                  <tr 
                    key={sale._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-blue-600">
                          {sale.invoiceNumber || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{sale.customer?.name || 'Walk-in Customer'}</p>
                        {sale.customer?.email && (
                          <p className="text-xs text-gray-500">{sale.customer.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className="font-bold text-green-600">${(sale.total || 0).toFixed(2)}</span>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-sm text-gray-700">{sale.paymentMethod || 'N/A'}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                          sale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sale.paymentStatus || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {sale.saleDate ? format(new Date(sale.saleDate), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/sales/${sale._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleViewInvoice(sale)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Print Invoice"
                        >
                          <PrinterIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {sales.length > 0 && filteredSales.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>Showing {filteredSales.length} of {sales.length} sales</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal isOpen={showInvoice} onClose={() => setShowInvoice(false)} sale={selectedSale} />
    </div>
  );
};

export default SaleList;