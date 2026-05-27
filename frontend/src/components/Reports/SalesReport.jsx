import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  ArrowDownTrayIcon, 
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const SalesReport = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [view, setView] = useState('daily');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    if (view === 'daily') {
      fetchDailyReport();
    } else {
      fetchMonthlyReport();
    }
  }, [view, selectedDate, selectedMonth]);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reports/daily-sales?date=${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDailyReport(response.data.data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
      toast.error('Failed to fetch daily report');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reports/monthly-income?year=${year}&month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMonthlyReport(response.data.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      toast.error('Failed to fetch monthly report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const data = view === 'daily' ? dailyReport?.sales : [];
    if (!data?.length) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Invoice Number', 'Customer', 'Total', 'Payment Method', 'Date'];
    const rows = data.map(sale => [
      sale.invoiceNumber,
      sale.customer?.name || 'Walk-in Customer',
      `$${sale.total?.toFixed(2) || '0.00'}`,
      sale.paymentMethod || 'N/A',
      sale.saleDate ? format(new Date(sale.saleDate), 'yyyy-MM-dd HH:mm') : 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${view}-sales-report-${view === 'daily' ? selectedDate : selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  if (loading) return <LoadingSpinner />;

  const chartData = view === 'daily' && dailyReport?.sales ? 
    dailyReport.sales.map(sale => ({
      time: sale.saleDate ? format(new Date(sale.saleDate), 'HH:mm') : 'N/A',
      amount: sale.total || 0
    })) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Sales Report
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Track and analyze your sales performance
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

        {/* View Selector Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setView('daily')}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  view === 'daily' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Daily Report
              </button>
              <button
                onClick={() => setView('monthly')}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  view === 'monthly' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly Report
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                {view === 'daily' ? (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                  />
                ) : (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {view === 'daily' && dailyReport && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Sales</p>
                    <p className="text-3xl font-bold text-blue-700">${dailyReport.totalSales?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                  <ArrowTrendingUpIcon className="h-3 w-3" />
                  <span>Total revenue for {format(new Date(selectedDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Transactions</p>
                    <p className="text-3xl font-bold text-green-700">{dailyReport.totalTransactions || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                    <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-600">
                  Sales transactions completed
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Average Transaction</p>
                    <p className="text-3xl font-bold text-purple-700">${dailyReport.averageTransaction?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-purple-600">
                  Average value per sale
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Sales Throughout the Day</h2>
                    <p className="text-sm text-gray-500 mt-1">Hourly sales breakdown</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Sales Amount</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`$${value?.toFixed(2) || '0.00'}`, 'Sales']}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Transaction Details Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Transaction Details</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">Complete list of all sales transactions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dailyReport.sales?.map((sale) => (
                      <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-blue-600">{sale.invoiceNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800">{sale.customer?.name || 'Walk-in Customer'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-green-600">${sale.total?.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-sm text-gray-600">{sale.paymentMethod}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {sale.saleDate ? format(new Date(sale.saleDate), 'hh:mm a') : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {dailyReport.sales?.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No sales found for this date</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'monthly' && monthlyReport && (
          <>
            {/* Monthly Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-700">${monthlyReport.totalRevenue?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-red-700">${monthlyReport.totalCost?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
                    <ShoppingBagIcon className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Net Income</p>
                    <p className="text-2xl font-bold text-blue-700">${monthlyReport.netIncome?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Profit Margin</p>
                    <p className="text-2xl font-bold text-purple-700">{monthlyReport.profitMargin?.toFixed(1) || '0'}%</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Daily Breakdown</h2>
                <p className="text-sm text-gray-500 mt-1">Revenue and transaction details by day</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(monthlyReport.dailyBreakdown || {}).map(([day, data]) => (
                      <tr key={day} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">Day {day}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-green-600">${data.revenue?.toFixed(2) || '0.00'}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {data.transactions || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Object.keys(monthlyReport.dailyBreakdown || {}).length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No data available for this month</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesReport;