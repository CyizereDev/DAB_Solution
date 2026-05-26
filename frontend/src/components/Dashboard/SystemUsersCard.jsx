import React from 'react';
import { ShieldCheckIcon, CreditCardIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SystemUsersCard = () => {
  const roles = [
    {
      title: 'Administrator',
      icon: ShieldCheckIcon,
      color: 'purple',
      permissions: [
        'Manage all system activities',
        'Manage employees',
        'Generate reports'
      ]
    },
    {
      title: 'Sales Manager',
      icon: CreditCardIcon,
      color: 'blue',
      permissions: [
        'Record sales',
        'View stock',
        'Generate invoices'
      ]
    },
    {
      title: 'Store Keeper',
      icon: TruckIcon,
      color: 'green',
      permissions: [
        'Update stock',
        'Record purchases',
        'Monitor inventory'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserGroupIcon className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">System Users & Roles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role, idx) => (
          <div key={idx} className={`bg-${role.color}-50 rounded-xl p-4 border border-${role.color}-200`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 bg-${role.color}-100 rounded-lg`}>
                <role.icon className={`h-5 w-5 text-${role.color}-600`} />
              </div>
              <h3 className={`font-semibold text-${role.color}-800`}>{role.title}</h3>
            </div>
            <ul className="space-y-1">
              {role.permissions.map((perm, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className={`text-${role.color}-400`}>✓</span>
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemUsersCard;