import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PrinterIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInvoices(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(invoice =>
    invoice.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    invoice.customer?.name?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            View and manage all sales invoices
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg px-4 py-2">
          <p className="text-sm text-blue-600">Total Amount: <span className="font-bold">${totalAmount.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by invoice number or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchInvoices}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No invoices yet</h3>
            <p className="text-gray-500">Sales invoices will appear here</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No invoices found matching "{search}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Invoice #</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-gray-900">{invoice.customer?.name || 'Walk-in Customer'}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className="font-bold text-green-600">${(invoice.total || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(invoice.saleDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <Link
                        to={`/sales/${invoice._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="View Invoice"
                      >
                        <EyeIcon className="h-5 w-5" />
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

export default InvoiceList;