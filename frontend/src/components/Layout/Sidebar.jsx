import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CreditCardIcon,
  TruckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  ReceiptPercentIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  ClipboardIcon,
  PrinterIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, hasRole, logout } = useAuth();
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [showOutputs, setShowOutputs] = useState(false);

  // Role-based permission mapping according to System Users
  const rolePermissions = {
    admin: {
      name: 'Administrator',
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-pink-500',
      gradient: 'purple',
      description: 'Full system access and control',
      capabilities: [
        '✓ Manage all system activities',
        '✓ Manage employees',
        '✓ Generate all reports',
        '✓ Full system configuration',
        '✓ User role management',
        '✓ Backup & restore'
      ]
    },
    sales_manager: {
      name: 'Sales Manager',
      icon: CreditCardIcon,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'blue',
      description: 'Sales and customer management',
      capabilities: [
        '✓ Record sales transactions',
        '✓ View stock levels',
        '✓ Generate invoices',
        '✓ Customer management',
        '✓ View sales reports'
      ]
    },
    store_keeper: {
      name: 'Store Keeper',
      icon: TruckIcon,
      color: 'from-green-500 to-emerald-500',
      gradient: 'green',
      description: 'Inventory and stock management',
      capabilities: [
        '✓ Update stock levels',
        '✓ Record purchases',
        '✓ Monitor inventory',
        '✓ Stock reports',
        '✓ Low stock alerts'
      ]
    }
  };

  const currentRole = user?.role || 'sales_manager';
  const roleInfo = rolePermissions[currentRole];

  // Menu items with proper role assignments based on System Users documentation
  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      roles: ['admin', 'sales_manager', 'store_keeper'],
      description: 'Overview & analytics'
    },
    { 
      path: '/products', 
      name: 'Products', 
      icon: ShoppingBagIcon, 
      roles: ['admin', 'sales_manager', 'store_keeper'],
      description: 'View and manage products'
    },
    { 
      path: '/stock', 
      name: 'Stock Management', 
      icon: ArchiveBoxIcon, 
      roles: ['admin', 'store_keeper'],
      description: 'Update stock & monitor inventory'
    },
    { 
      path: '/customers', 
      name: 'Customers', 
      icon: UsersIcon, 
      roles: ['admin', 'sales_manager'],
      description: 'Manage customer records'
    },
    { 
      path: '/sales/new', 
      name: 'Record Sale', 
      icon: CreditCardIcon, 
      roles: ['admin', 'sales_manager'],
      description: 'Record new sales transaction'
    },
    { 
      path: '/sales', 
      name: 'Sales History', 
      icon: DocumentTextIcon, 
      roles: ['admin', 'sales_manager'],
      description: 'View all sales records'
    },
    { 
      path: '/invoices', 
      name: 'Invoices', 
      icon: ReceiptPercentIcon, 
      roles: ['admin', 'sales_manager'],
      description: 'Generate and view invoices'
    },
    { 
      path: '/purchases/new', 
      name: 'Record Purchase', 
      icon: TruckIcon, 
      roles: ['admin', 'store_keeper'],
      description: 'Record new purchase order'
    },
    { 
      path: '/purchases', 
      name: 'Purchase History', 
      icon: ClipboardDocumentListIcon, 
      roles: ['admin', 'store_keeper'],
      description: 'View purchase records'
    },
    { 
      path: '/employees', 
      name: 'Employees', 
      icon: UserGroupIcon, 
      roles: ['admin'],
      description: 'Manage employee records'
    },
    { 
      path: '/reports', 
      name: 'Reports', 
      icon: ChartBarIcon, 
      roles: ['admin', 'sales_manager'],
      description: 'Generate business reports'
    }
  ];

  const filteredItems = menuItems.filter(item => hasRole(item.roles));

  // Expected system outputs for each role
  const expectedOutputs = {
    admin: [
      { icon: DocumentTextIcon, name: 'Sales Invoices', color: 'blue', description: 'All sales invoices' },
      { icon: UsersIcon, name: 'Customer Records', color: 'green', description: 'Customer database' },
      { icon: ArchiveBoxIcon, name: 'Product Stock Reports', color: 'yellow', description: 'Inventory levels' },
      { icon: UserGroupIcon, name: 'Employee Records', color: 'purple', description: 'Employee information' },
      { icon: CalendarDaysIcon, name: 'Daily Business Reports', color: 'indigo', description: 'Daily summary' },
      { icon: ChartBarIcon, name: 'Monthly Business Reports', color: 'pink', description: 'Monthly analysis' }
    ],
    sales_manager: [
      { icon: DocumentTextIcon, name: 'Sales Invoices', color: 'blue', description: 'Customer invoices' },
      { icon: UsersIcon, name: 'Customer Records', color: 'green', description: 'Customer information' },
      { icon: PrinterIcon, name: 'Invoice Printing', color: 'purple', description: 'Print invoices' },
      { icon: CalendarDaysIcon, name: 'Daily Reports', color: 'indigo', description: 'Daily sales' },
      { icon: ChartBarIcon, name: 'Monthly Reports', color: 'pink', description: 'Monthly revenue' }
    ],
    store_keeper: [
      { icon: ArchiveBoxIcon, name: 'Product Stock Reports', color: 'yellow', description: 'Current stock levels' },
      { icon: TruckIcon, name: 'Purchase Records', color: 'green', description: 'Supplier purchases' },
      { icon: ClipboardIcon, name: 'Stock Movement', color: 'blue', description: 'In/Out records' },
      { icon: FolderIcon, name: 'Inventory Reports', color: 'purple', description: 'Stock valuation' }
    ]
  };

  const currentOutputs = expectedOutputs[currentRole];

  // Role-specific quick actions
  const getQuickActions = () => {
    switch(currentRole) {
      case 'admin':
        return [
          { action: 'Add Employee', path: '/employees/add', icon: UserGroupIcon, color: 'purple' },
          { action: 'Generate Report', path: '/reports', icon: ChartBarIcon, color: 'blue' },
          { action: 'System Settings', path: '/settings', icon: CogIcon, color: 'gray' }
        ];
      case 'sales_manager':
        return [
          { action: 'New Sale', path: '/sales/new', icon: CreditCardIcon, color: 'blue' },
          { action: 'Add Customer', path: '/customers/add', icon: UsersIcon, color: 'green' },
          { action: 'View Invoices', path: '/invoices', icon: ReceiptPercentIcon, color: 'purple' }
        ];
      case 'store_keeper':
        return [
          { action: 'Update Stock', path: '/stock', icon: ArchiveBoxIcon, color: 'yellow' },
          { action: 'New Purchase', path: '/purchases/new', icon: TruckIcon, color: 'green' },
          { action: 'Stock Report', path: '/reports/stock', icon: ClipboardIcon, color: 'blue' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className={`h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-80' : 'w-20'} relative overflow-y-auto`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          <div className={`${!isOpen && 'hidden'} ml-3`}>
            <h1 className="text-lg font-bold">DAB Enterprise</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* User Role Badge */}
      <div className="mx-3 mt-4 mb-2">
        <div className={`bg-gradient-to-r ${roleInfo.color} rounded-xl p-3 shadow-lg ${!isOpen && 'text-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <span className="text-sm font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div className={`flex-1 ${!isOpen && 'hidden'}`}>
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <p className="text-xs text-white/80 capitalize">{user?.role?.replace('_', ' ')}</p>
              <p className="text-xs text-white/60 mt-0.5">{roleInfo.description}</p>
            </div>
            {isOpen && (
              <button
                onClick={() => setShowRoleInfo(!showRoleInfo)}
                className="text-white/70 hover:text-white transition-colors"
                title="View capabilities"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role Capabilities (Expandable) */}
      {showRoleInfo && isOpen && (
        <div className="mx-3 mb-3 bg-gray-800/80 rounded-xl p-4 border border-gray-700 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheckIcon className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Your Capabilities</span>
          </div>
          <div className="space-y-2">
            {roleInfo.capabilities.map((capability, idx) => (
              <p key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {capability}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      {isOpen && quickActions.length > 0 && (
        <div className="mx-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CogIcon className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, idx) => (
              <NavLink
                key={idx}
                to={action.path}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <action.icon className={`h-4 w-4 text-${action.color}-400`} />
                <span className="text-xs text-gray-300 group-hover:text-white">{action.action}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 mt-2 px-3 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${roleInfo.color} text-white shadow-lg`
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${!isOpen && 'justify-center space-x-0'}`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>{item.name}</span>
            <span className={`${!isOpen && 'hidden'} text-xs text-gray-400 ml-auto`}>{item.description}</span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-400 text-xs">{item.description}</p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Expected Outputs Section */}
      <div className={`p-4 border-t border-gray-700 ${!isOpen && 'px-2'}`}>
        {isOpen && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DocumentDuplicateIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Outputs</span>
              </div>
              <button
                onClick={() => setShowOutputs(!showOutputs)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showOutputs ? '−' : '+'}
              </button>
            </div>

            {showOutputs && (
              <div className="space-y-2 animate-fade-in">
                {currentOutputs.map((output, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className={`w-6 h-6 bg-${output.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <output.icon className={`h-3.5 w-3.5 text-${output.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-200">{output.name}</p>
                      <p className="text-xs text-gray-500">{output.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Collapsed view - icons only */}
        {!isOpen && (
          <div className="flex flex-col items-center space-y-3">
            <ShieldCheckIcon className="h-5 w-5 text-purple-400" title="Administrator" />
            <CreditCardIcon className="h-5 w-5 text-blue-400" title="Sales Manager" />
            <TruckIcon className="h-5 w-5 text-green-400" title="Store Keeper" />
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className={`mt-4 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-red-600/20 transition-all duration-200 ${!isOpen && 'justify-center'}`}
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
          <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;