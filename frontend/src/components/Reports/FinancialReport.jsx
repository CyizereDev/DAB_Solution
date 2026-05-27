import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area
} from 'recharts';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const FinancialReport = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reports/financial`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFinancialData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  const currentYearData = financialData;
  
  const totalRevenue = currentYearData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalCost = currentYearData.reduce((sum, d) => sum + (d.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const pieData = [
    { name: 'Revenue', value: totalRevenue, color: '#3b82f6' },
    { name: 'Cost', value: totalCost, color: '#ef4444' },
    { name: 'Profit', value: totalProfit > 0 ? totalProfit : 0, color: '#10b981' }
  ].filter(item => item.value > 0);

  if (loading) return <LoadingSpinner />;

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || 'Jan';
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
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
                Financial Report
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Annual financial overview and analytics
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm">
            <CalendarIcon className="h-4 w-4 text-blue-500" />
            <span>Year {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-700">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              Total income for the year
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-red-700">${totalCost.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-red-600">
              Total expenses for the year
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Net Profit</p>
                <p className="text-3xl font-bold text-green-700">${totalProfit.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600">
              Net earnings after costs
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Profit Margin</p>
                <p className="text-3xl font-bold text-purple-700">{avgProfitMargin.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-600">
              Profitability ratio
            </div>
          </div>
        </div>

        {/* Monthly Financial Performance Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Monthly Financial Performance</h2>
              <p className="text-sm text-gray-500 mt-1">Revenue, cost and profit breakdown by month</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Cost</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Profit</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentYearData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tickFormatter={getMonthName} stroke="#9ca3af" />
              <YAxis tickFormatter={formatYAxis} stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => [`$${value?.toLocaleString() || 0}`, '']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="url(#profitGradient)" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Profit Trend</h2>
              <p className="text-sm text-gray-500 mt-1">Monthly profit progression</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={currentYearData}>
              <defs>
                <linearGradient id="profitLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tickFormatter={getMonthName} stroke="#9ca3af" />
              <YAxis tickFormatter={formatYAxis} stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => [`$${value?.toLocaleString() || 0}`, 'Profit']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fill="url(#profitLineGradient)" dot={{ fill: '#10b981', r: 5 }} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Distribution & Monthly Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pieData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Financial Distribution</h2>
                <p className="text-sm text-gray-500 mt-1">Revenue, cost and profit distribution</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => `${name}: $${(value / 1000).toFixed(0)}K (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value?.toLocaleString() || 0}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Monthly Breakdown</h2>
              <p className="text-sm text-gray-500 mt-1">Detailed financial data by month</p>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentYearData.map((data, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{getMonthName(data.month)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-600 font-semibold">${(data.revenue || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-red-600">${(data.cost || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${(data.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(data.profit || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {currentYearData.length === 0 && (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No financial data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold">Financial Summary</h3>
              <p className="text-gray-300 text-sm mt-1">Year-to-date performance overview</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Revenue</p>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">${totalCost.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Cost</p>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${totalProfit.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Net Profit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;