import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFileText,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiUserPlus,
  FiInfo
} from 'react-icons/fi';
import { MdLocationCity } from 'react-icons/md';
import { HiBuildingOffice } from 'react-icons/hi2';

const API_BASE_URL = 'http://localhost:5000/api';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    company: '',
    notes: ''
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = getAuthToken();
    
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/customers`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Customer added successfully!');
        navigate('/customers');
      } else {
        toast.error(response.data.message || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000');
      } else {
        toast.error('Failed to add customer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/customers')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Customers</span>
          </button>
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <FiUserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Customer</h1>
                <p className="text-blue-100 mt-1 text-sm">Create a new customer profile</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                    <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Enter customer's full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                    <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'phone' ? 'transform scale-[1.01]' : ''}`}>
                    <FiPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Include country code for international numbers</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'address' ? 'transform scale-[1.01]' : ''}`}>
                    <FiMapPin className={`absolute left-3 top-3 transition-colors duration-200 ${focusedField === 'address' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('address')}
                      onBlur={() => setFocusedField(null)}
                      rows="2"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      placeholder="Street address, P.O. Box, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'city' ? 'transform scale-[1.01]' : ''}`}>
                    <MdLocationCity className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-xl ${focusedField === 'city' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('city')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="City"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company / Organization
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'company' ? 'transform scale-[1.01]' : ''}`}>
                    <HiBuildingOffice className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-xl ${focusedField === 'company' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'notes' ? 'transform scale-[1.01]' : ''}`}>
                    <FiFileText className={`absolute left-3 top-3 transition-colors duration-200 ${focusedField === 'notes' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('notes')}
                      onBlur={() => setFocusedField(null)}
                      rows="4"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      placeholder="Any additional information about the customer (preferences, special requirements, etc.)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.notes.length}/500 characters
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiInfo className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Customer Information</p>
                      <p className="text-xs text-blue-600 mt-1">
                        All customer information is securely stored and encrypted. 
                        You can manage customer purchases and view order history after creation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Customer...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="h-5 w-5" />
                    <span>Add Customer</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/customers')}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiXCircle className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;