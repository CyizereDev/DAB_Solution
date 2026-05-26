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
  Cell
} from 'recharts';
import { format } from 'date-fns';
import LoadingSpinner from '../Common/LoadingSpinner';

const FinancialReport = () => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    fetchFinancialData();
  }, [year]);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('/api/reports/financial');
      setFinancialData(response.data.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentYearData = financialData;
  
  const totalRevenue = currentYearData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCost = currentYearData.reduce((sum, d) => sum + d.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const pieData = [
    { name: 'Revenue', value: totalRevenue },
    { name: 'Cost', value: totalCost },
    { name: 'Profit', value: totalProfit }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Financial Report</h1>
        <p className="text-gray-600 mt-1">Annual financial overview and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Cost</h3>
          <p className="text-3xl font-bold mt-2">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Net Profit</h3>
          <p className="text-3xl font-bold mt-2">${totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Profit Margin</h3>
          <p className="text-3xl font-bold mt-2">{avgProfitMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Financial Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            <Bar dataKey="cost" fill="#ef4444" name="Cost" />
            <Bar dataKey="profit" fill="#10b981" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Trend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profit Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
          <div className="overflow-y-auto max-h-80">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Month</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Revenue</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentYearData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">{getMonthName(data.month)}</td>
                    <td className="px-4 py-2 text-sm text-right text-green-600">${data.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-right text-red-600">${data.cost.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">${data.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const getMonthName = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
};

export default FinancialReport;