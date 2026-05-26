import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  EyeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      const customerData = response.data?.data || [];
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/customers/${id}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0);
  const averagePurchase = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);

  // Filter and sort customers
  const filteredCustomers = Array.isArray(customers) ? customers
    .filter(customer =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search) ||
      customer.company?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'purchases') return (b.totalPurchases || 0) - (a.totalPurchases || 0);
      if (sortBy === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0);
      return 0;
    }) : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Manage your customer relationships and track purchase history
          </p>
        </div>
        {hasRole(['admin', 'sales_manager']) && (
          <Link 
            to="/customers/add" 
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">Add Customer</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Customers</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{totalCustomers}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">${totalRevenue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Avg. Purchase</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700">${averagePurchase.toFixed(2)}</p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-purple-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-700">{totalOrders}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-orange-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span>Sort</span>
              {showFilters ? <XMarkIcon className="h-4 w-4" /> : <ArrowPathIcon className="h-4 w-4" />}
            </button>
            
            <button
              onClick={fetchCustomers}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Sort Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  sortBy === 'name'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('purchases')}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  sortBy === 'purchases'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Highest Spenders
              </button>
              <button
                onClick={() => setSortBy('orders')}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  sortBy === 'orders'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Orders
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {customers.length === 0 ? (
          // Empty State - No Customers
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No customers yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first customer</p>
            {hasRole(['admin', 'sales_manager']) && (
              <Link 
                to="/customers/add" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Your First Customer</span>
              </Link>
            )}
          </div>
        ) : filteredCustomers.length === 0 ? (
          // Empty State - No Search Results
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching customers</h3>
            <p className="text-gray-500 mb-2">We couldn't find any customers matching "{search}"</p>
            <button
              onClick={() => {
                setSearch('');
                setSortBy('name');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        ) : (
          // Customers Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact Info</th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer, index) => (
                  <tr 
                    key={customer._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {customer.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Since {new Date(customer.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="text-gray-400">✉️</span> {customer.email || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <span className="text-gray-400">📞</span> {customer.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                      {customer.company ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {customer.company}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <p className="font-bold text-green-600">${(customer.totalPurchases || 0).toFixed(2)}</p>
                     </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full min-w-[40px]">
                        {customer.totalOrders || 0}
                      </span>
                     </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/customers/${customer._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/customers/edit/${customer._id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        {hasRole(['admin']) && (
                          <button
                            onClick={() => handleDelete(customer._id, customer.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Customer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
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
      {customers.length > 0 && filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>Showing {filteredCustomers.length} of {customers.length} customers</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Regular</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>VIP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;