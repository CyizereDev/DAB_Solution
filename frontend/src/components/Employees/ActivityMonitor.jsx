import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

const ActivityMonitor = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesRes, employeesRes] = await Promise.all([
        axios.get('/api/dashboard/activities'),
        axios.get('/api/employees')
      ]);
      setActivities(activitiesRes.data.data);
      setEmployees(employeesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    if (action.includes('login')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action?.toLowerCase().includes(search.toLowerCase()) ||
                          activity.details?.toLowerCase().includes(search.toLowerCase());
    const matchesEmployee = selectedEmployee === 'all' || activity.user?._id === selectedEmployee;
    const matchesFilter = filter === 'all' || 
                         (filter === 'recent' && new Date(activity.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
    return matchesSearch && matchesEmployee && matchesFilter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Activity Monitor</h1>
        <div className="text-sm text-gray-500">
          Total Activities: {filteredActivities.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="input-field"
          >
            <option value="all">All Employees</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Time</option>
            <option value="recent">Last 24 Hours</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {activity.user?.username?.charAt(0).toUpperCase() || 'S'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {activity.user?.username || 'System'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getActionBadgeColor(activity.action)}`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {activity.details || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                </td>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityMonitor;