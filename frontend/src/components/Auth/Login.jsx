import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiShield, FiArrowRight } from 'react-icons/fi';
import { FaBuilding, FaChartLine, FaUsers } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@dab.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Left Side - Brand Section */}
          <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 p-8 xl:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Logo */}
              <div>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-blue-600">DAB</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">DAB Enterprise</h2>
                    <p className="text-blue-200 text-sm">Business Management System</p>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="mb-8">
                  <h1 className="text-3xl xl:text-4xl font-bold text-white mb-3">
                    Welcome Back!
                  </h1>
                  <p className="text-blue-100 text-base">
                    Sign in to access your dashboard and manage your business operations
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaChartLine className="text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Real-time Analytics</h3>
                      <p className="text-blue-200 text-sm">Track your business performance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Team Management</h3>
                      <p className="text-blue-200 text-sm">Manage employees and roles</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-xl text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Business Growth</h3>
                      <p className="text-blue-200 text-sm">Scale your operations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">10K+</p>
                    <p className="text-xs text-blue-200">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-xs text-blue-200">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">24/7</p>
                    <p className="text-xs text-blue-200">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Secure Access</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Access your DAB Enterprise dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                    <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        focusedField === 'email'
                          ? 'border-blue-500 ring-blue-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="admin@dab.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                    <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        focusedField === 'password'
                          ? 'border-blue-500 ring-blue-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <FiLogIn size={18} />
                      <span>Sign In</span>
                      <FiArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiShield size={14} />
                  <span>Use Demo Credentials</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to DAB?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200"
                >
                  Create an account
                  <FiArrowRight size={14} />
                </Link>
              </div>

              {/* Demo Credentials Note */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-semibold">Demo Credentials:</span><br />
                  Email: admin@dab.com<br />
                  Password: admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;