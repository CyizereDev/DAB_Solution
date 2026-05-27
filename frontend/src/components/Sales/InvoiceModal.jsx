import React, { useRef } from 'react';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const InvoiceModal = ({ isOpen, onClose, sale }) => {
  const printRef = useRef();
  const modalRef = useRef();

  console.log('InvoiceModal received props:', { isOpen, sale: sale?.invoiceNumber });

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  // Handle click outside to close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      console.log('Clicked outside, closing modal');
      onClose();
    }
  };

  if (!isOpen) {
    console.log('Modal is closed');
    return null;
  }

  if (!sale) {
    console.error('No sale data provided to InvoiceModal');
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={handleOutsideClick}
      >
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', maxWidth: '500px' }}>
          <h2 style={{ color: 'red', marginBottom: '10px' }}>Error</h2>
          <p>No invoice data available</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering invoice modal for sale:', sale.invoiceNumber);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        overflowY: 'auto'
      }}
      onClick={handleOutsideClick}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '1rem'
        }}
      >
        <div
          ref={modalRef}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button at top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Close button clicked');
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '8px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            title="Close"
          >
            <XMarkIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>

          {/* Invoice Content */}
          <div ref={printRef} style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>DAB Enterprise Ltd</h1>
              <p style={{ color: '#4b5563', margin: '4px 0' }}>Business Management System</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>123 Business Street, City, Country</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>Tel: +123 456 7890 | Email: info@dab.com</p>
            </div>

            {/* Invoice Title */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>TAX INVOICE</h2>
            </div>

            {/* Invoice Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Invoice No:</strong> {sale.invoiceNumber}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Date:</strong> {sale.saleDate ? format(new Date(sale.saleDate), 'PPP') : 'N/A'}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Time:</strong> {sale.saleDate ? format(new Date(sale.saleDate), 'hh:mm a') : 'N/A'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Bill To:</strong>
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>{sale.customer?.name || 'Walk-in Customer'}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>{sale.customer?.email}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>{sale.customer?.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>Unit Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items && sale.items.length > 0 ? (
                    sale.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>
                          {item.productName}
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>SKU: {item.sku}</div>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>{item.quantity}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>${item.price?.toFixed(2)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb', fontWeight: 'bold' }}>${item.total?.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>No items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '256px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Subtotal:</span>
                  <span>${sale.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                {sale.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>Discount:</span>
                    <span style={{ color: '#dc2626' }}>-${sale.discount.toFixed(2)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>Tax:</span>
                    <span>+${sale.tax.toFixed(2)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderTop: '1px solid #e5e7eb',
                    marginTop: '4px'
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: '#2563eb' }}>${sale.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Payment Method:</strong> {sale.paymentMethod?.toUpperCase() || 'N/A'}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Payment Status:</strong>
                <span
                  style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    borderRadius: '9999px',
                    backgroundColor:
                      sale.paymentStatus === 'paid'
                        ? '#d1fae5'
                        : sale.paymentStatus === 'partial'
                        ? '#fef3c7'
                        : '#fee2e2',
                    color:
                      sale.paymentStatus === 'paid'
                        ? '#065f46'
                        : sale.paymentStatus === 'partial'
                        ? '#92400e'
                        : '#991b1b'
                  }}
                >
                  {sale.paymentStatus?.toUpperCase() || 'PENDING'}
                </span>
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>Thank you for your business!</p>
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#9ca3af',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}
            >
              <p>This is a computer generated invoice. No signature required.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid #e5e7eb'
            }}
          >
            <button
              onClick={handlePrint}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <PrinterIcon style={{ width: '16px', height: '16px' }} />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Close button clicked in footer');
                onClose();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <XMarkIcon style={{ width: '16px', height: '16px' }} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;