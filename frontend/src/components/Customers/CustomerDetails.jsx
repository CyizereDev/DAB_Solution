import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    } else {
      console.error('No customer ID provided');
      toast.error('Invalid customer ID');
      navigate('/customers');
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      console.log('Fetching customer with ID:', id);
      console.log('API URL:', `${API_BASE_URL}/customers/${id}`);
      
      const [customerRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/customers/${id}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      console.log('Customer response:', customerRes.data);
      console.log('History response:', historyRes.data);

      if (customerRes.data.success) {
        setCustomer(customerRes.data.data);
      } else {
        toast.error(customerRes.data.message || 'Customer not found');
        navigate('/customers');
      }

      setPurchases(historyRes.data.data || []);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      
      if (error.response?.status === 404) {
        toast.error('Customer not found');
        navigate('/customers');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch customer details');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!customer) {
    return (
      <div className="text-center py-12">
        <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Customer not found</h2>
        <p className="text-gray-500 mb-4">The customer you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Customers
        </button>
      </div>
    );
  }

  const totalSpent = customer.totalPurchases || 0;
  const totalOrders = customer.totalOrders || 0;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Customers</span>
        </button>
        <Link
          to={`/customers/edit/${customer._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          <span>Edit Customer</span>
        </Link>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">
                {customer.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
              <p className="text-blue-100 text-sm">
                Customer since {customer.createdAt ? format(new Date(customer.createdAt), 'MMMM yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <span>{customer.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span>{customer.phone || 'N/A'}</span>
                </div>
                {customer.address && (
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>
                      {customer.address}
                      {customer.city ? `, ${customer.city}` : ''}
                    </span>
                  </div>
                )}
                {customer.company && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                Purchase Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-green-700">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-700">{totalOrders}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">Average Order</p>
                  <p className="text-2xl font-bold text-purple-700">${avgOrder.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-sm text-orange-600 font-medium">Last Purchase</p>
                  <p className="text-sm font-bold text-orange-700">
                    {customer.lastPurchaseDate ? format(new Date(customer.lastPurchaseDate), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
            Purchase History
          </h3>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No purchase history found</p>
            <Link
              to="/sales/new"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
            >
              Create First Sale
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {purchase.invoiceNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {purchase.saleDate ? format(new Date(purchase.saleDate), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-green-600">${(purchase.total || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        purchase.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        purchase.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {purchase.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/sales/${purchase._id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;