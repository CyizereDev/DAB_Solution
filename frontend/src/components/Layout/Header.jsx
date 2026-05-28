import React, { useState, useEffect, useRef } from 'react';
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL = 'http://localhost:5000/api';

const Header = ({ onMenuClick, onMobileMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);
  const fetchIntervalRef = useRef(null);
  const lastNotificationIdRef = useRef(null);

  const getAuthToken = () => localStorage.getItem('token');

  // Load seen notifications from localStorage
  const getSeenNotifications = () => {
    const seen = localStorage.getItem('seenNotifications');
    return seen ? new Set(JSON.parse(seen)) : new Set();
  };

  const saveSeenNotifications = (seenSet) => {
    localStorage.setItem('seenNotifications', JSON.stringify([...seenSet]));
  };

  // Load read notifications from localStorage
  const getReadNotifications = () => {
    const read = localStorage.getItem('readNotifications');
    return read ? new Set(JSON.parse(read)) : new Set();
  };

  const saveReadNotifications = (readSet) => {
    localStorage.setItem('readNotifications', JSON.stringify([...readSet]));
  };

  const [seenNotifications, setSeenNotifications] = useState(getSeenNotifications);
  const [readNotifications, setReadNotifications] = useState(getReadNotifications);

  // Save to localStorage whenever sets change
  useEffect(() => {
    saveSeenNotifications(seenNotifications);
  }, [seenNotifications]);

  useEffect(() => {
    saveReadNotifications(readNotifications);
  }, [readNotifications]);

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/dashboard/activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const activities = response.data?.data || [];
      
      // Transform activities into notification format
      const newNotifications = activities.map(activity => ({
        id: activity._id,
        message: activity.details || `${activity.action} occurred`,
        time: activity.timestamp,
        timestamp: new Date(activity.timestamp).getTime(),
        type: getNotificationType(activity.action),
        icon: getNotificationIcon(activity.action)
      }));

      // Update notifications - only add truly new ones
      setNotifications(prevNotifications => {
        // Create a map of existing notifications by ID
        const existingMap = new Map(prevNotifications.map(n => [n.id, n]));
        
        // Add new notifications that don't exist yet
        newNotifications.forEach(notification => {
          if (!existingMap.has(notification.id)) {
            existingMap.set(notification.id, notification);
          }
        });
        
        // Convert back to array and sort by timestamp (newest first)
        const updated = Array.from(existingMap.values());
        return updated.sort((a, b) => b.timestamp - a.timestamp);
      });
      
      // Track the latest notification ID for future reference
      if (newNotifications.length > 0) {
        lastNotificationIdRef.current = newNotifications[0].id;
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getNotificationType = (action) => {
    if (action?.toLowerCase().includes('sale')) return 'sale';
    if (action?.toLowerCase().includes('product')) return 'product';
    if (action?.toLowerCase().includes('customer')) return 'customer';
    if (action?.toLowerCase().includes('purchase')) return 'purchase';
    if (action?.toLowerCase().includes('stock')) return 'stock';
    return 'general';
  };

  const getNotificationIcon = (action) => {
    if (action?.toLowerCase().includes('sale')) return ShoppingBagIcon;
    if (action?.toLowerCase().includes('product')) return CubeIcon;
    if (action?.toLowerCase().includes('customer')) return UsersIcon;
    if (action?.toLowerCase().includes('purchase')) return TruckIcon;
    if (action?.toLowerCase().includes('stock')) return ExclamationTriangleIcon;
    return CheckCircleIcon;
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'sale': return 'bg-green-100 text-green-600';
      case 'product': return 'bg-blue-100 text-blue-600';
      case 'customer': return 'bg-purple-100 text-purple-600';
      case 'purchase': return 'bg-orange-100 text-orange-600';
      case 'stock': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Initial fetch and set up real-time polling every 3 seconds
  useEffect(() => {
    fetchRecentActivities();
    
    // Set up interval to fetch every 3 seconds
    fetchIntervalRef.current = setInterval(fetchRecentActivities, 3000);
    
    // Close notification dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const markAsRead = (notificationId) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
    // Also mark as seen when marked as read
    setSeenNotifications(prev => new Set([...prev, notificationId]));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
    setSeenNotifications(new Set(allIds));
    toast.success('All notifications marked as read');
  };

  // Mark notification as seen when it appears in the list
  const markAsSeen = (notificationId) => {
    if (!seenNotifications.has(notificationId)) {
      setSeenNotifications(prev => new Set([...prev, notificationId]));
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    
    // Navigate based on notification type
    if (notification.type === 'sale') {
      navigate('/sales');
    } else if (notification.type === 'product') {
      navigate('/products');
    } else if (notification.type === 'customer') {
      navigate('/customers');
    } else if (notification.type === 'purchase') {
      navigate('/purchases');
    } else if (notification.type === 'stock') {
      navigate('/stock');
    }
  };

  // A notification is unread if it's not in readNotifications
  const isUnread = (notificationId) => {
    return !readNotifications.has(notificationId);
  };

  // A notification is new (unseen) if it's not in seenNotifications
  const isNew = (notificationId) => {
    return !seenNotifications.has(notificationId);
  };

  const unreadCount = notifications.filter(n => isUnread(n.id)).length;

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  // Mark notifications as seen when they are rendered
  useEffect(() => {
    notifications.forEach(notification => {
      markAsSeen(notification.id);
    });
  }, [notifications]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onMenuClick}
              className="hidden md:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Sidebar"
            >
              <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={onMobileMenuClick}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Mobile Menu"
            >
              <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Welcome Message */}
            <div className="hidden sm:block">
              <div className="flex items-baseline">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Welcome back,
                </h2>
                <span className="ml-1.5 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {user?.username}!
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">New activities will appear here</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const IconComponent = notif.icon;
                        const notificationColor = getNotificationColor(notif.type);
                        const unread = isUnread(notif.id);
                        const newNotification = isNew(notif.id);
                        
                        return (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${
                              unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                            } ${newNotification ? 'animate-slide-in-right' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notificationColor}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatTime(notif.time)}
                                </p>
                              </div>
                              {unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800/50">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/dashboard');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <UserCircleIcon className="h-4 w-4" />
                  Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Logout Button (Mobile) */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600"
              aria-label="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;