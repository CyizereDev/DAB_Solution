import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { MagnifyingGlassIcon, EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';
import InvoiceModal from './InvoiceModal';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('/api/sales');
      const salesData = response.data?.data || [];
      setSales(salesData);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = Array.isArray(sales) ? sales.filter(sale =>
    sale.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    sale.customer?.name?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const handleViewInvoice = (sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales History</h1>
          <p className="text-gray-600 mt-1">View and manage all sales transactions</p>
        </div>
        <Link to="/sales/new" className="btn-primary">
          New Sale
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by invoice number or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-primary-600">{sale.invoiceNumber || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{sale.customer?.name || 'Walk-in Customer'}</p>
                      <p className="text-sm text-gray-500">{sale.customer?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${(sale.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm">{sale.paymentMethod || 'N/A'}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.saleDate ? format(new Date(sale.saleDate), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Link
                      to={`/sales/${sale._id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <EyeIcon className="h-5 w-5 inline" />
                    </Link>
                    <button
                      onClick={() => handleViewInvoice(sale)}
                      className="text-green-600 hover:text-green-800 transition-colors ml-2"
                    >
                      <PrinterIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sales found</p>
          </div>
        )}
      </div>

      <InvoiceModal isOpen={showInvoice} onClose={() => setShowInvoice(false)} sale={selectedSale} />
    </div>
  );
};

export default SaleList;