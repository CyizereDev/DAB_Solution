import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  TruckIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const PurchaseList = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      console.log('Fetching purchases...');
      const response = await axios.get(`${API_BASE_URL}/purchases`);
      const purchaseData = response.data?.data || [];
      console.log(`Found ${purchaseData.length} purchases`);
      setPurchases(purchaseData);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering - ensure purchases is an array
  const filteredPurchases = Array.isArray(purchases) ? purchases.filter(purchase =>
    purchase.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
    purchase.supplier?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Calculate statistics
  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const uniqueSuppliers = [...new Set(purchases.map(p => p.supplier).filter(Boolean))];

  const viewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetails(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Purchase Orders
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Track and manage all your purchase orders
          </p>
        </div>
        <button
          onClick={() => navigate('/purchases/new')}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <TruckIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold">New Purchase</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{totalPurchases}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Spent</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">${totalSpent.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Suppliers</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700">{uniqueSuppliers.length}</p>
            </div>
            <TruckIcon className="h-8 w-8 text-purple-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by PO number or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={fetchPurchases}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {purchases.length === 0 ? (
          // Empty State - No Purchases
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <TruckIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No purchase orders yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first purchase order</p>
            <button
              onClick={() => navigate('/purchases/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <TruckIcon className="h-5 w-5" />
              <span>Create Purchase Order</span>
            </button>
          </div>
        ) : filteredPurchases.length === 0 ? (
          // Empty State - No Search Results
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching purchase orders</h3>
            <p className="text-gray-500 mb-2">We couldn't find any purchase orders matching "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear search
            </button>
          </div>
        ) : (
          // Purchases Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PO Number</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPurchases.map((purchase, index) => (
                  <tr 
                    key={purchase._id} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => viewDetails(purchase)}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {purchase.poNumber || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{purchase.supplier || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full min-w-[40px]">
                        {purchase.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className="font-bold text-green-600">${(purchase.total || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {purchase.purchaseDate ? format(new Date(purchase.purchaseDate), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewDetails(purchase);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {purchases.length > 0 && filteredPurchases.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>Showing {filteredPurchases.length} of {purchases.length} purchase orders</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Details Modal */}
      {showDetails && selectedPurchase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetails(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Purchase Order Details</h2>
                      <p className="text-blue-100 text-sm">{selectedPurchase.poNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-semibold text-gray-800">{selectedPurchase.supplier}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="font-semibold text-gray-800">
                      {selectedPurchase.purchaseDate ? format(new Date(selectedPurchase.purchaseDate), 'PPP') : 'N/A'}
                    </p>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-blue-500" />
                  Items Ordered
                </h3>
                
                <div className="space-y-2 mb-6">
                  {selectedPurchase.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.buyingPrice}
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">${item.total?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${(selectedPurchase.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;