import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { PrinterIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InvoiceModal from '../Sales/InvoiceModal';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/sales/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSale(response.data.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!sale) return <div className="text-center py-12">Invoice not found</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Invoices</span>
        </button>
        <button
          onClick={() => setShowInvoice(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PrinterIcon className="h-5 w-5" />
          <span>View/Print Invoice</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Invoice Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Invoice Number:</span> {sale.invoiceNumber}</p>
              <p><span className="text-gray-500">Date:</span> {format(new Date(sale.saleDate), 'PPP')}</p>
              <p><span className="text-gray-500">Time:</span> {format(new Date(sale.saleDate), 'hh:mm a')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Name:</span> {sale.customer?.name}</p>
              <p><span className="text-gray-500">Email:</span> {sale.customer?.email}</p>
              <p><span className="text-gray-500">Phone:</span> {sale.customer?.phone}</p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sale.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">${item.price?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-semibold">${item.total?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${sale.subtotal?.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-red-600">-${sale.discount.toFixed(2)}</span>
              </div>
            )}
            {sale.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>+${sale.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-primary-600">${sale.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal isOpen={showInvoice} onClose={() => setShowInvoice(false)} sale={sale} />
    </div>
  );
};

export default InvoiceDetails;