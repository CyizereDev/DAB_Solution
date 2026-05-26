import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiUserPlus, 
  FiEye, 
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';
import { FaChartLine, FaRocket } from 'react-icons/fa';
import { MdAdminPanelSettings, MdPointOfSale, MdInventory } from 'react-icons/md';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'sales_manager'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState('sales_manager');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Please accept the Terms of Service');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    setLoading(false);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/login');
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = ['Very Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthMessage = [
    'Add more characters for better security',
    'Consider adding numbers or symbols',
    'Good password! Almost there',
    'Excellent! Strong password'
  ];

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      icon: <MdAdminPanelSettings className="text-xl sm:text-2xl" />,
      color: 'from-indigo-600 to-purple-600',
      description: 'Full system access and control',
      permissions: ['Manage all', 'Full analytics', 'System settings']
    },
    {
      id: 'sales_manager',
      name: 'Sales Manager',
      icon: <MdPointOfSale className="text-xl sm:text-2xl" />,
      color: 'from-blue-600 to-indigo-600',
      description: 'Manage sales and customers',
      permissions: ['Create sales', 'Customer management', 'View reports']
    },
    {
      id: 'store_keeper',
      name: 'Store Keeper',
      icon: <MdInventory className="text-xl sm:text-2xl" />,
      color: 'from-green-500 to-emerald-600',
      description: 'Manage inventory and purchases',
      permissions: ['Stock management', 'Purchase orders', 'Inventory reports']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main Container - Centered */}
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Left Side - Brand Section (Hidden on mobile, shows on desktop) */}
          <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 p-8 xl:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Logo */}
              <div>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">DAB</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">DAB Enterprise</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">Business Management System</p>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-3">
                    Welcome to<br />
                    DAB Enterprise
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Join thousands of businesses managing their operations efficiently
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiTrendingUp className="text-base sm:text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Real-time Analytics</h3>
                      <p className="text-blue-200 text-xs sm:text-sm">Track your business performance instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaChartLine className="text-base sm:text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Smart Reporting</h3>
                      <p className="text-blue-200 text-xs sm:text-sm">Automated reports and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaRocket className="text-base sm:text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Scale Your Business</h3>
                      <p className="text-blue-200 text-xs sm:text-sm">Grow with our powerful tools</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-white">10K+</p>
                    <p className="text-xs text-blue-200">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-white">98%</p>
                    <p className="text-xs text-blue-200">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-white">24/7</p>
                    <p className="text-xs text-blue-200">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-3/5 bg-white p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto max-h-screen lg:max-h-none">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Join 10,000+ Businesses</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
                <p className="text-sm sm:text-base text-gray-600">Start your 14-day free trial. No credit card required.</p>
              </div>

              {/* Registration Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5 sm:p-6 lg:p-8">
                  {/* Role Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelect(role.id)}
                          className={`relative group transition-all duration-200 text-left w-full ${
                            selectedRole === role.id 
                              ? `bg-gradient-to-r ${role.color} shadow-md` 
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          } rounded-xl p-3 sm:p-4`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              selectedRole === role.id 
                                ? 'bg-white/20' 
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <div className={`text-xl sm:text-2xl ${
                                selectedRole === role.id ? 'text-white' : 'text-gray-600'
                              }`}>
                                {role.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-sm sm:text-base ${
                                selectedRole === role.id ? 'text-white' : 'text-gray-900'
                              }`}>
                                {role.name}
                              </h3>
                              <p className={`text-xs mt-0.5 sm:mt-1 ${
                                selectedRole === role.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {role.description}
                              </p>
                              {selectedRole === role.id && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                  {role.permissions.map((perm, idx) => (
                                    <span key={idx} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-white/20 rounded-full text-white">
                                      {perm}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {selectedRole === role.id && (
                              <div className="text-white flex-shrink-0">
                                <FiCheckCircle size={18} className="sm:w-5 sm:h-5" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                            focusedField === 'username'
                              ? 'border-blue-500 ring-blue-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="johndoe"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                            focusedField === 'email'
                              ? 'border-blue-500 ring-blue-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                            focusedField === 'password'
                              ? 'border-blue-500 ring-blue-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <FiEyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <FiEye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  level <= passwordStrength ? strengthColor[passwordStrength - 1] : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Password strength: <span className="font-medium text-gray-700">
                              {strengthText[passwordStrength - 1] || 'Very Weak'}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {strengthMessage[passwordStrength - 1] || 'Enter a password'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                            focusedField === 'confirmPassword'
                              ? 'border-blue-500 ring-blue-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <FiEyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <FiEye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <FiCheckCircle size={12} />
                          Passwords do not match
                        </p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                        <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                          <FiCheckCircle size={12} />
                          Passwords match
                        </p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">Creating Account...</span>
                        </div>
                      ) : (
                        <>
                          <FiUserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                          <span className="text-sm sm:text-base">Create Account</span>
                          <FiArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1"
                      >
                        Sign in
                        <FiArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Credentials Note */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-full">
                  <FiShield className="text-green-500" size={12} />
                  <p className="text-xs text-gray-500">
                    Demo: admin@dab.com / admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;