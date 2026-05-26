import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  TrophyIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const ReportDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Safely set stats with fallback values
      const data = response.data?.data || {};
      setStats({
        totalSales: data.totalSales || 0,
        totalProducts: data.totalProducts || 0,
        totalCustomers: data.totalCustomers || 0,
        totalRevenue: data.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      title: 'Sales Report',
      description: 'View daily and monthly sales performance',
      icon: ShoppingBagIcon,
      path: '/reports/sales',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'blue',
      stat: `$${stats.totalSales.toLocaleString()}`,
      statLabel: "Today's Sales"
    },
    {
      title: 'Stock Report',
      description: 'Monitor inventory levels and stock alerts',
      icon: CubeIcon,
      path: '/reports/stock',
      color: 'from-green-500 to-green-600',
      bgColor: 'green',
      stat: stats.totalProducts,
      statLabel: 'Total Products'
    },
    {
      title: 'Customer Report',
      description: 'Analyze customer behavior and purchase history',
      icon: UsersIcon,
      path: '/reports/customers',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'purple',
      stat: stats.totalCustomers,
      statLabel: 'Active Customers'
    },
    {
      title: 'Financial Report',
      description: 'View revenue, costs, and profit analysis',
      icon: CurrencyDollarIcon,
      path: '/reports/financial',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'yellow',
      stat: `$${stats.totalRevenue.toLocaleString()}`,
      statLabel: 'Total Revenue'
    }
  ];

  const getStatColor = (bgColor) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600'
    };
    return colors[bgColor] || 'text-gray-600';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reports Dashboard
              </h1>
              <p className="text-gray-500 mt-2">Generate and analyze business insights</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Today's Sales</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">${stats.totalSales.toLocaleString()}</p>
              </div>
              <ShoppingBagIcon className="h-8 w-8 text-blue-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs sm:text-sm font-medium">Total Products</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.totalProducts}</p>
              </div>
              <CubeIcon className="h-8 w-8 text-green-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs sm:text-sm font-medium">Total Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats.totalCustomers}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-purple-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-xs sm:text-sm font-medium">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 opacity-75" />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Link
              key={report.path}
              to={report.path}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${report.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <report.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{report.description}</p>
                      <div className="mt-3">
                        <p className={`text-2xl font-bold ${getStatColor(report.bgColor)}`}>
                          {report.stat}
                        </p>
                        <p className="text-xs text-gray-400">{report.statLabel}</p>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1">
                  Generate Report
                  <ArrowTrendingUpIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrophyIcon className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-semibold">Performance</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Business Insights</h2>
                  <p className="text-indigo-100 text-sm">Track your key metrics and make data-driven decisions</p>
                </div>
                <ChartBarIcon className="h-16 w-16 text-white/20" />
              </div>
            </div>
          </div>

          {/* Custom Reports Banner */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RocketLaunchIcon className="h-5 w-5 text-cyan-200" />
                    <span className="text-cyan-200 text-sm font-semibold">Custom Reports</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Need Specific Data?</h2>
                  <p className="text-cyan-100 text-sm">Contact your administrator for custom report generation</p>
                </div>
                <DocumentTextIcon className="h-16 w-16 text-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Report Activity</h3>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Sales Report Generated', time: '2 hours ago', icon: ShoppingBagIcon, color: 'blue' },
              { action: 'Stock Report Exported', time: 'Yesterday', icon: CubeIcon, color: 'green' },
              { action: 'Customer Analysis Completed', time: '2 days ago', icon: UsersIcon, color: 'purple' },
              { action: 'Financial Summary Reviewed', time: '3 days ago', icon: CurrencyDollarIcon, color: 'yellow' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                  <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <DocumentTextIcon className="h-4 w-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;