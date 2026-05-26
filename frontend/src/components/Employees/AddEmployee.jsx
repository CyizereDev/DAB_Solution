import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase, 
  FiDollarSign,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiUserPlus,
  FiAward
} from 'react-icons/fi';
import { MdWork, MdAttachMoney } from 'react-icons/md';
import { HiBuildingOffice, HiUserGroup } from 'react-icons/hi2';
import { FaUserTie, FaChartLine, FaStore, FaUserGraduate } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: 'Sales',
    salary: '',
    status: 'active'
  });

  const departments = [
    { name: 'Management', icon: FaUserTie, color: 'purple' },
    { name: 'Sales', icon: FaChartLine, color: 'blue' },
    { name: 'Warehouse', icon: FaStore, color: 'orange' },
    { name: 'Accounting', icon: MdAttachMoney, color: 'green' },
    { name: 'IT', icon: FaUserGraduate, color: 'cyan' }
  ];

  const positions = ['Manager', 'Sales Associate', 'Store Keeper', 'Accountant', 'Developer', 'Admin'];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getDepartmentIcon = (deptName) => {
    const dept = departments.find(d => d.name === deptName);
    return dept?.icon || HiBuildingOffice;
  };

  const DepartmentIcon = getDepartmentIcon(formData.department);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('You are not logged in. Please login again.');
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${API_BASE_URL}/employees`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Employee added successfully!');
        navigate('/employees');
      } else {
        toast.error(response.data.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add employee. Please try again.');
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
            onClick={() => navigate('/employees')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Employees</span>
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
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Employee</h1>
                <p className="text-blue-100 mt-1 text-sm">Add a new team member to your organization</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Personal Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'firstName' ? 'transform scale-[1.01]' : ''}`}>
                      <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'firstName' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'lastName' ? 'transform scale-[1.01]' : ''}`}>
                      <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'lastName' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Doe"
                        required
                      />
                    </div>
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
                      placeholder="john.doe@company.com"
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
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
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
                      placeholder="123 Main Street, City, State, ZIP"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Employment Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiBriefcase className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Employment Information</h3>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'department' ? 'transform scale-[1.01]' : ''}`}>
                    <DepartmentIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-xl ${focusedField === 'department' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('department')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      {departments.map(dept => (
                        <option key={dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'position' ? 'transform scale-[1.01]' : ''}`}>
                    <MdWork className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 text-xl ${focusedField === 'position' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('position')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Salary & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'salary' ? 'transform scale-[1.01]' : ''}`}>
                      <FiDollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'salary' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('salary')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="50000"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'status' ? 'transform scale-[1.01]' : ''}`}>
                      <FiAward className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'status' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('status')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <HiUserGroup className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Employee Benefits</p>
                      <p className="text-xs text-blue-600 mt-1">
                        All employees receive health insurance, paid time off, and retirement benefits.
                        Additional perks include professional development opportunities.
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
                    <span>Adding Employee...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="h-5 w-5" />
                    <span>Add Employee</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/employees')}
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

export default AddEmployee;