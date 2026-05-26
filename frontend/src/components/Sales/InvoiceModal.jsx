import React, { useRef } from 'react';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const InvoiceModal = ({ isOpen, onClose, sale }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Invoice Content */}
          <div ref={printRef} className="bg-white p-8">
            {/* Header */}
            <div className="text-center border-b pb-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800">DAB Enterprise Ltd</h1>
              <p className="text-gray-600">Business Management System</p>
              <p className="text-sm text-gray-500">123 Business Street, City, Country</p>
              <p className="text-sm text-gray-500">Tel: +123 456 7890 | Email: info@dab.com</p>
            </div>

            {/* Invoice Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-600">TAX INVOICE</h2>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between mb-6">
              <div>
                <p><strong>Invoice No:</strong> {sale.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(sale.saleDate), 'PPP')}</p>
                <p><strong>Time:</strong> {format(new Date(sale.saleDate), 'hh:mm a')}</p>
              </div>
              <div className="text-right">
                <p><strong>Bill To:</strong></p>
                <p>{sale.customer?.name}</p>
                <p>{sale.customer?.email}</p>
                <p>{sale.customer?.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items?.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">${item.price?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">${item.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>${sale.subtotal?.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between py-1">
                    <span>Discount:</span>
                    <span>-${sale.discount.toFixed(2)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div className="flex justify-between py-1">
                    <span>Tax:</span>
                    <span>+${sale.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-bold text-lg border-t">
                  <span>Total:</span>
                  <span>${sale.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <p><strong>Payment Method:</strong> {sale.paymentMethod?.toUpperCase()}</p>
              <p><strong>Payment Status:</strong> {sale.paymentStatus?.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-2">Thank you for your business!</p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t">
              <p>This is a computer generated invoice. No signature required.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center space-x-2"
            >
              <PrinterIcon className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;