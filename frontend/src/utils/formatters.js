import { format } from 'date-fns';

// Currency formatter
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Date formatter
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A';
  return format(new Date(date), formatStr);
};

// DateTime formatter
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'PPP pp');
};

// Number formatter with commas
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

// Percentage formatter
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0%';
  return `${value.toFixed(1)}%`;
};

// Phone number formatter
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  return phone;
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Generate SKU
export const generateSKU = (productName, category) => {
  const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRD';
  const nameCode = productName.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${nameCode}-${random}`;
};

// Calculate profit margin
export const calculateProfitMargin = (sellingPrice, buyingPrice) => {
  if (!sellingPrice || !buyingPrice || buyingPrice === 0) return 0;
  return ((sellingPrice - buyingPrice) / sellingPrice) * 100;
};

// Format invoice number
export const formatInvoiceNumber = (number) => {
  if (!number) return '';
  return number.toUpperCase();
};

// Get stock status
export const getStockStatus = (quantity, minStockLevel) => {
  if (quantity === 0) return { text: 'Out of Stock', color: 'red', variant: 'danger' };
  if (quantity <= minStockLevel) return { text: 'Low Stock', color: 'yellow', variant: 'warning' };
  return { text: 'In Stock', color: 'green', variant: 'success' };
};

// Get payment status badge
export const getPaymentStatusBadge = (status) => {
  const badges = {
    paid: { text: 'Paid', className: 'bg-green-100 text-green-800' },
    pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    partial: { text: 'Partial', className: 'bg-blue-100 text-blue-800' },
  };
  return badges[status] || badges.pending;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Calculate total from array of objects
export const calculateTotal = (items, field) => {
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
};

// Download JSON as file
export const downloadJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Download CSV as file
export const downloadCSV = (data, headers, filename) => {
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};