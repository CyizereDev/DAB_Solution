import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  ArrowDownTrayIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const CustomerReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reports/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch customer report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report?.allCustomers?.length) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Name', 'Email', 'Phone', 'Total Purchases', 'Total Orders', 'Last Purchase Date'];
    const rows = report.allCustomers.map(c => [
      c.name || 'N/A',
      c.email || 'N/A',
      c.phone || 'N/A',
      `$${(c.totalPurchases || 0).toFixed(2)}`,
      c.totalOrders || 0,
      c.lastPurchaseDate ? format(new Date(c.lastPurchaseDate), 'yyyy-MM-dd') : 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const filteredCustomers = report?.allCustomers?.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
                Customer Report
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Customer analytics and purchase history
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-blue-700">{report?.totalCustomers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              Registered customers in system
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-700">${(report?.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600">
              Total revenue from all customers
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Average per Customer</p>
                <p className="text-3xl font-bold text-purple-700">${(report?.averagePerCustomer || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-600">
              Average spending per customer
            </div>
          </div>
        </div>

        {/* Top Customers Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-800">Top 10 Customers</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Highest spending customers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Purchases</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report?.topCustomers?.map((customer, index) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {customer.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-green-600">${(customer.totalPurchases || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full min-w-[40px]">
                        {customer.totalOrders || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Customers Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">All Customers</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">Complete customer list with purchase history</p>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <UsersIcon className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">No customers found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {customer.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            {customer.company && (
                              <p className="text-xs text-gray-500">{customer.company}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-600">${(customer.totalPurchases || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full min-w-[40px]">
                          {customer.totalOrders || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {customer.lastPurchaseDate ? (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                            <span>{format(new Date(customer.lastPurchaseDate), 'MMM dd, yyyy')}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Never</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        {filteredCustomers.length > 0 && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <UsersIcon className="h-4 w-4 text-blue-500" />
              <span>Showing {filteredCustomers.length} of {report?.allCustomers?.length || 0} customers</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReport;