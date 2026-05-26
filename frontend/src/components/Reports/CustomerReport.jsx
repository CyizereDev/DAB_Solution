import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

const CustomerReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get('/api/reports/customers');
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;
    
    const headers = ['Name', 'Email', 'Phone', 'Total Purchases', 'Total Orders', 'Last Purchase Date'];
    const rows = report.allCustomers?.map(c => [
      c.name,
      c.email,
      c.phone,
      `$${c.totalPurchases?.toFixed(2) || '0.00'}`,
      c.totalOrders || 0,
      c.lastPurchaseDate ? format(new Date(c.lastPurchaseDate), 'yyyy-MM-dd') : 'N/A'
    ]) || [];
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCustomers = report?.allCustomers?.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Report</h1>
          <p className="text-gray-600 mt-1">Customer analytics and purchase history</p>
        </div>
        <button onClick={exportToCSV} className="btn-primary flex items-center space-x-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{report?.totalCustomers || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue from Customers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">${report?.totalRevenue?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Average per Customer</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">${report?.averagePerCustomer?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top 10 Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total Purchases</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.topCustomers?.map((customer, index) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    ${customer.totalPurchases?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{customer.totalOrders || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Customers */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Customers</h2>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-64"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total Spent</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>{customer.email}</div>
                    <div className="text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">${customer.totalPurchases?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-center">{customer.totalOrders || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {customer.lastPurchaseDate ? format(new Date(customer.lastPurchaseDate), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;