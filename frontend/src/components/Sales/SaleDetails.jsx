import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  PrinterIcon, 
  ArrowLeftIcon, 
  UserIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import InvoiceModal from './InvoiceModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    if (id) {
      fetchSaleDetails();
    } else {
      setError('No sale ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        setError('Please login to continue');
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }
      
      console.log('Fetching sale with ID:', id);
      
      const response = await axios.get(`${API_BASE_URL}/sales/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        params: {
          _t: Date.now()
        }
      });

      console.log('Sale response status:', response.status);
      console.log('Sale response data:', response.data);

      if (response.data.success && response.data.data) {
        setSale(response.data.data);
        console.log('Sale data loaded:', response.data.data);
      } else {
        setError(response.data.message || 'Sale not found');
        toast.error(response.data.message || 'Sale not found');
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
      
      if (error.response?.status === 404) {
        setError('Sale not found');
        toast.error('Sale not found');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running on port 5000');
        toast.error('Cannot connect to server');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch sale details');
        toast.error(error.response?.data?.message || 'Failed to fetch sale details');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sale Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The sale you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/sales')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Sales
          </button>
        </div>
      </div>
    );
  }

  // Debug: Log sale data before rendering
  console.log('Rendering sale details, sale data:', sale);
  console.log('showInvoice state:', showInvoice);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/sales')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Sales</span>
          </button>
          
          {/* View Invoice Button with Debug */}
          <button
            onClick={() => {
              console.log('=== VIEW INVOICE BUTTON CLICKED ===');
              console.log('Sale data when opening modal:', sale);
              console.log('Sale invoice number:', sale?.invoiceNumber);
              console.log('Sale items count:', sale?.items?.length);
              setShowInvoice(true);
              console.log('showInvoice set to true');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>View Invoice</span>
          </button>
        </div>

        {/* Sale Details Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Sale Details</h1>
                <p className="text-blue-100 text-sm mt-1">Invoice #{sale.invoiceNumber}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                sale.paymentStatus === 'paid' ? 'bg-green-500 text-white' :
                sale.paymentStatus === 'partial' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {sale.paymentStatus?.toUpperCase() || 'PENDING'}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Invoice Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                  Invoice Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invoice Number:</span>
                    <span className="font-mono font-medium">{sale.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{sale.saleDate ? format(new Date(sale.saleDate), 'PPP') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span>{sale.saleDate ? format(new Date(sale.saleDate), 'hh:mm a') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sold By:</span>
                    <span>{sale.soldBy?.username || 'System'}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-green-500" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{sale.customer?.name || 'Walk-in Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>{sale.customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span>{sale.customer?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5 text-purple-500" />
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="capitalize">{sale.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Status:</span>
                    <span className={`font-semibold ${
                      sale.paymentStatus === 'paid' ? 'text-green-600' :
                      sale.paymentStatus === 'partial' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {sale.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
              Items Purchased
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sale.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">${item.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold">${item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${sale.subtotal?.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-red-600">-${sale.discount.toFixed(2)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax:</span>
                    <span>+${sale.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">${sale.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal - Pass sale data */}
        <InvoiceModal 
          isOpen={showInvoice} 
          onClose={() => {
            console.log('Closing invoice modal');
            setShowInvoice(false);
          }} 
          sale={sale}
        />
      </div>
    </div>
  );
};

export default SaleDetails;