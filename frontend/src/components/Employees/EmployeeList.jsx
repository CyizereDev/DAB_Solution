import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5000/api';

const EmployeeList = () => {
  const navigate = useNavigate(); // This is correct - useNavigate hook
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { hasRole } = useAuth();

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const employeeData = response.data?.data || [];
      setEmployees(employeeData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to fetch employees');
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const token = getAuthToken();
        
        await axios.delete(`${API_BASE_URL}/employees/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to delete employee');
        }
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      on_leave: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get unique departments
  const departments = ['all', ...new Set(employees.map(e => e.department).filter(Boolean))];

  // Filter employees
  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
    const matchesSearch = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.position?.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  }) : [];

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveCount = employees.filter(e => e.status === 'on_leave').length;
  const totalSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Manage your team members and their information
          </p>
        </div>
        {hasRole(['admin']) && (
          <Link 
            to="/employees/add" 
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">Add Employee</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{totalEmployees}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">{activeEmployees}</p>
            </div>
            <UserIcon className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">On Leave</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-700">{onLeaveCount}</p>
            </div>
            <BriefcaseIcon className="h-8 w-8 text-yellow-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Monthly Payroll</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700">${totalSalary.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span>Filters</span>
              {showFilters ? <XMarkIcon className="h-4 w-4" /> : <ChartBarIcon className="h-4 w-4" />}
            </button>
            
            <button
              onClick={fetchEmployees}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Department:</span>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedDepartment === dept
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {employees.length === 0 ? (
          // Empty State - No Employees
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No employees yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first team member</p>
            {hasRole(['admin']) && (
              <Link 
                to="/employees/add" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Your First Employee</span>
              </Link>
            )}
          </div>
        ) : filteredEmployees.length === 0 ? (
          // Empty State - No Search Results
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching employees</h3>
            <p className="text-gray-500 mb-2">We couldn't find any employees matching "{search}"</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedDepartment('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        ) : (
          // Employees Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee, index) => (
                  <tr 
                    key={employee._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {employee.firstName?.charAt(0) || ''}{employee.lastName?.charAt(0) || ''}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.firstName || ''} {employee.lastName || ''}</p>
                          <p className="text-xs text-gray-500">ID: {employee._id?.slice(-6) || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <EnvelopeIcon className="h-3 w-3 text-gray-400" />
                          {employee.email || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3 text-gray-400" />
                          {employee.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{employee.position || 'N/A'}</span>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        <BuildingOfficeIcon className="h-3 w-3" />
                        {employee.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(employee.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {employee.status?.replace('_', ' ') || 'active'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/employees/edit/${employee._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </Link>
                        {hasRole(['admin']) && (
                          <button
                            onClick={() => handleDelete(employee._id, `${employee.firstName || ''} ${employee.lastName || ''}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Employee"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {employees.length > 0 && filteredEmployees.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>Showing {filteredEmployees.length} of {employees.length} employees</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>On Leave</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Inactive</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;