import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const SalesReport = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [view, setView] = useState('daily');

  useEffect(() => {
    if (view === 'daily') {
      fetchDailyReport();
    } else {
      fetchMonthlyReport();
    }
  }, [view, selectedDate, selectedMonth]);

  const fetchDailyReport = async () => {
    try {
      const response = await axios.get(`/api/reports/daily-sales?date=${selectedDate}`);
      setDailyReport(response.data.data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const response = await axios.get(`/api/reports/monthly-income?year=${year}&month=${month}`);
      setMonthlyReport(response.data.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const data = view === 'daily' ? dailyReport?.sales : [];
    if (!data?.length) return;
    
    const headers = ['Invoice Number', 'Customer', 'Total', 'Payment Method', 'Date'];
    const rows = data.map(sale => [
      sale.invoiceNumber,
      sale.customer?.name || 'N/A',
      `$${sale.total.toFixed(2)}`,
      sale.paymentMethod,
      format(new Date(sale.saleDate), 'yyyy-MM-dd HH:mm')
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${view}-sales-report-${view === 'daily' ? selectedDate : selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  const chartData = view === 'daily' && dailyReport?.sales ? 
    dailyReport.sales.map(sale => ({
      time: format(new Date(sale.saleDate), 'HH:mm'),
      amount: sale.total
    })) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
          <p className="text-gray-600 mt-1">Track and analyze sales performance</p>
        </div>
        <button onClick={exportToCSV} className="btn-primary flex items-center space-x-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('daily')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'daily' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Daily Report
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'monthly' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly Report
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            {view === 'daily' ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field w-auto"
              />
            ) : (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field w-auto"
              />
            )}
          </div>
        </div>
      </div>

      {view === 'daily' && dailyReport && (
        <>
          {/* Daily Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <p className="text-3xl font-bold text-green-600">${dailyReport.totalSales?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
              <p className="text-3xl font-bold text-blue-600">{dailyReport.totalTransactions || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Transaction</h3>
              <p className="text-3xl font-bold text-purple-600">${dailyReport.averageTransaction?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Sales Chart */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Throughout the Day</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Sales Amount" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sales List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailyReport.sales?.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-primary-600">{sale.invoiceNumber}</td>
                      <td className="px-4 py-3">{sale.customer?.name || 'Walk-in Customer'}</td>
                      <td className="px-4 py-3 text-right font-semibold">${sale.total?.toFixed(2)}</td>
                      <td className="px-4 py-3 capitalize">{sale.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(sale.saleDate), 'hh:mm a')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'monthly' && monthlyReport && (
        <>
          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${monthlyReport.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
              <p className="text-2xl font-bold text-red-600">${monthlyReport.totalCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Net Income</h3>
              <p className="text-2xl font-bold text-blue-600">${monthlyReport.netIncome?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
              <p className="text-2xl font-bold text-purple-600">{monthlyReport.profitMargin?.toFixed(1) || '0'}%</p>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Day</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Transactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(monthlyReport.dailyBreakdown || {}).map(([day, data]) => (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">Day {day}</td>
                      <td className="px-4 py-3 text-right text-green-600">${data.revenue?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-3 text-center">{data.transactions || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReport;