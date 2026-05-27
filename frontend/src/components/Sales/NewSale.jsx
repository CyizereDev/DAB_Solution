import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:5000/api';

const NewSale = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid'); // Default to 'paid'
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }
      
      const [customersRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      setCustomers(customersRes.data?.data || []);
      setProducts(productsRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Error fetching data. Make sure backend is running.');
      }
      setCustomers([]);
      setProducts([]);
    }
  };

  const addToCart = (product) => {
    if (!product) return;
    
    if (product.quantity === 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    const existingItem = cart.find(item => item.product === product._id);
    if (existingItem) {
      if (existingItem.quantity + 1 > product.quantity) {
        toast.error(`Only ${product.quantity} units available`);
        return;
      }
      setCart(cart.map(item =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: 1,
        price: product.sellingPrice,
        total: product.sellingPrice
      }]);
    }
    toast.success(`Added ${product.name} to cart`);
  };

  const updateQuantity = (productId, quantity, availableStock) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} units available`);
      return;
    }
    setCart(cart.map(item =>
      item.product === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product !== productId));
    toast.success('Item removed from cart');
  };

  const createCustomer = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/customers`, newCustomer, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const newCustomerData = response.data.data;
      setCustomers([...customers, newCustomerData]);
      setSelectedCustomer(newCustomerData._id);
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      toast.success('Customer created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
  const total = subtotal + tax - discount;

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = getAuthToken();
  if (!token) {
    toast.error('Please login to continue');
    navigate('/login');
    return;
  }
  
  if (!selectedCustomer) {
    toast.error('Please select a customer');
    return;
  }
  
  if (cart.length === 0) {
    toast.error('Cart is empty');
    return;
  }

  setLoading(true);
  
  try {
    const saleData = {
      customerId: selectedCustomer,
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus, // THIS IS CRITICAL - must be included
      discount: Number(discount),
      tax: Number(tax)
    };
    
    console.log('Sending paymentStatus:', paymentStatus); // Debug log
    
    const response = await axios.post(`${API_BASE_URL}/sales`, saleData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    toast.success(`Sale recorded! Payment: ${paymentStatus.toUpperCase()}`);
    navigate('/sales');
  } catch (error) {
    console.error('Sale error:', error);
    toast.error(error.response?.data?.message || 'Error recording sale');
  } finally {
    setLoading(false);
  }
};

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            New Sale
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create a new sales transaction</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShoppingCartIcon className="h-5 w-5" />
          <span>{cart.length} items</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
              Products
            </h2>
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {searchTerm ? 'No products found matching your search' : 'No products available'}
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product._id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-all hover:border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        <p className="text-xs mt-1">
                          <span className={`font-medium ${product.quantity <= product.minStockLevel ? 'text-red-500' : 'text-green-600'}`}>
                            Stock: {product.quantity}
                          </span>
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-600">${product.sellingPrice}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.quantity === 0}
                      className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
              Shopping Cart
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <div className="flex gap-2">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCustomerForm(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs">Add products to get started</p>
                </div>
              ) : (
                cart.map(item => {
                  const product = products.find(p => p?._id === item.product);
                  return (
                    <div key={item.product} className="border-b border-gray-100 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-xs text-gray-500">${item.price} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity - 1, product?.quantity || 0)}
                            className="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity + 1, product?.quantity || 0)}
                            className="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-gray-800">${(item.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="font-bold text-lg text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                    <option value="mobile_money">📱 Mobile Money</option>
                  </select>
                </div>

                {/* Payment Status - FIXED VERSION */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Setting payment status to: paid');
                        setPaymentStatus('paid');
                      }}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                        paymentStatus === 'paid'
                          ? 'border-green-500 bg-green-500 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:border-green-300'
                      }`}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Paid</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Setting payment status to: partial');
                        setPaymentStatus('partial');
                      }}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                        paymentStatus === 'partial'
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Partial</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Setting payment status to: pending');
                        setPaymentStatus('pending');
                      }}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                        paymentStatus === 'pending'
                          ? 'border-yellow-500 bg-yellow-500 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-yellow-50 hover:border-yellow-300'
                      }`}
                    >
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Pending</span>
                    </button>
                  </div>
                  
                  {/* Status indicator text */}
                  <div className="mt-2 text-xs">
                    {paymentStatus === 'paid' && (
                      <p className="text-green-600 flex items-center gap-1">
                        <CheckCircleIcon className="h-3 w-3" /> ✓ Full payment received
                      </p>
                    )}
                    {paymentStatus === 'partial' && (
                      <p className="text-orange-600 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-3 w-3" /> ⚠ Partial payment - balance pending
                      </p>
                    )}
                    {paymentStatus === 'pending' && (
                      <p className="text-yellow-600 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" /> ⏳ Awaiting payment confirmation
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Complete Sale</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomerForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNewCustomerForm(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Add New Customer</h2>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={createCustomer} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Customer
                </button>
                <button onClick={() => setShowNewCustomerForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSale;