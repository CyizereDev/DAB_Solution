import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from '../../contexts/AuthContext';

const MobileNav = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();

 const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
  { path: '/products', name: 'Products', icon: ShoppingBagIcon },
  { path: '/customers', name: 'Customers', icon: UsersIcon },
  { path: '/sales/new', name: 'New Sale', icon: CreditCardIcon },
  { path: '/sales', name: 'Sales', icon: DocumentTextIcon },
  { path: '/reports', name: 'Reports', icon: DocumentTextIcon },
];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 z-50 transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">DAB Enterprise</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-700">
            <XMarkIcon className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;