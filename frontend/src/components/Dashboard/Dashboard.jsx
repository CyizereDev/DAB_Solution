import React, { useEffect, useState } from 'react';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiAlertTriangle,
  FiAward,
  FiCalendar,
  FiPackage,
  FiUserCheck,
  FiCreditCard,
  FiActivity
} from 'react-icons/fi';
import { 
  MdInventory, 
  MdAttachMoney, 
  MdAnalytics,
  MdWarning
} from 'react-icons/md';
import { HiOutlineChartBar, HiOutlineUserGroup } from 'react-icons/hi2';
import { FaBoxes, FaChartLine, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentSales();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/sales`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRecentSales(response.data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching recent sales:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      iconBg: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up',
      description: 'Products in inventory'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: FiUsers,
      iconBg: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up',
      description: 'Registered customers'
    },
    {
      title: "Today's Sales",
      value: `$${stats?.todaySales?.toFixed(2) || '0.00'}`,
      icon: FiCreditCard,
      iconBg: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
      change: stats?.todaySales > 0 ? '+5%' : '0%',
      trend: stats?.todaySales > 0 ? 'up' : 'down',
      description: 'Revenue today'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlySales?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      iconBg: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      change: '+15%',
      trend: 'up',
      description: 'This month'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200 text-sm font-medium">Dashboard Overview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <FiCalendar className="h-4 w-4" />
              <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className={`bg-gradient-to-r ${stat.gradient} px-4 py-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-white/20 rounded-xl`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{stat.title}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                    {stat.trend === 'up' ? <FiTrendingUp className="h-3 w-3" /> : <FiTrendingDown className="h-3 w-3" />}
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MdAnalytics className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800">Analytics Overview</h2>
                </div>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-gray-50">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 12 months</option>
                </select>
              </div>
              <div className="h-80">
                {/* Chart component would go here */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <HiOutlineChartBar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Chart visualization will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
            </div>
            <div className="space-y-3">
              {recentSales.length === 0 ? (
                <div className="text-center py-8">
                  <FiActivity className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No recent activities</p>
                </div>
              ) : (
                recentSales.map((sale, idx) => (
                  <div key={sale._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Sale Completed</p>
                      <p className="text-xs text-gray-500">Invoice: {sale.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">${sale.total?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{new Date(sale.saleDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Transactions */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiCreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Today's Transactions</h3>
              </div>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats?.todayTransactions || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Sales completed today</p>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MdWarning className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Low Stock Alert</h3>
              </div>
              <span className="text-xs text-gray-400">Inventory</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats?.lowStockCount || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Products below minimum level</p>
          </div>

          {/* Average Sale Value */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MdAttachMoney className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Average Sale Value</h3>
              </div>
              <span className="text-xs text-gray-400">Per Transaction</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${stats?.todayTransactions > 0 ? (stats.todaySales / stats.todayTransactions).toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">Average per transaction today</p>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiAward className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Performance Summary</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Great Month So Far!</h3>
              <p className="text-gray-300 text-sm">Your business is growing steadily. Keep up the good work!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">+{stats?.monthlyGrowth || 12}%</p>
                <p className="text-xs text-gray-400">Growth Rate</p>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-gray-400">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>✅ Sales target: 75% achieved</span>
              <span>📈 Customer satisfaction: 98%</span>
              <span>🚀 On track for record month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;