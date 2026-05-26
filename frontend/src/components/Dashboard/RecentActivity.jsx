import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  CreditCardIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/dashboard/activities');
      const activityData = response.data?.data || [];
      setActivities(activityData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    if (!action) return <ShoppingBagIcon className="h-4 w-4 text-gray-500" />;
    const actionLower = action.toLowerCase();
    if (actionLower.includes('sale')) return <CreditCardIcon className="h-4 w-4 text-green-500" />;
    if (actionLower.includes('product')) return <CubeIcon className="h-4 w-4 text-blue-500" />;
    if (actionLower.includes('customer')) return <UsersIcon className="h-4 w-4 text-purple-500" />;
    if (actionLower.includes('employee')) return <UserGroupIcon className="h-4 w-4 text-orange-500" />;
    return <ShoppingBagIcon className="h-4 w-4 text-gray-500" />;
  };

  const getActivityColor = (action) => {
    if (!action) return 'text-gray-600';
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created')) return 'text-green-600';
    if (actionLower.includes('updated')) return 'text-blue-600';
    if (actionLower.includes('deleted')) return 'text-red-600';
    if (actionLower.includes('login')) return 'text-purple-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activities</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div key={activity._id || index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getActivityColor(activity.action)}`}>
                  {activity.action || 'Unknown action'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.details || 'No details available'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
              {activity.user && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {activity.user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;