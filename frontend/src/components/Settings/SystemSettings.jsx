import React, { useState } from 'react';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  KeyIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  ServerIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'DAB Enterprise Ltd',
    companyEmail: 'info@dab.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business Street, City, Country',
    taxRate: 10,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    invoicePrefix: 'INV',
    lowStockAlert: true,
    emailNotifications: true,
    darkMode: false,
    autoBackup: true
  });

  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2024-01-15 10:30 AM', size: '2.4 MB', type: 'Full Backup' },
    { id: 2, date: '2024-01-14 10:30 AM', size: '2.3 MB', type: 'Full Backup' },
    { id: 3, date: '2024-01-13 10:30 AM', size: '2.3 MB', type: 'Full Backup' }
  ]);

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon, description: 'Basic system preferences' },
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon, description: 'Business information' },
    { id: 'invoice', name: 'Invoice', icon: DocumentTextIcon, description: 'Billing preferences' },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, description: 'Alert settings' },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon, description: 'Access & protection' },
    { id: 'backup', name: 'Backup', icon: ServerIcon, description: 'Data protection' },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon, description: 'Theme & style' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Backup created successfully!');
      const newBackup = {
        id: backupHistory.length + 1,
        date: new Date().toLocaleString(),
        size: '2.4 MB',
        type: 'Manual Backup'
      };
      setBackupHistory([newBackup, ...backupHistory]);
    } catch (error) {
      toast.error('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to restore this backup? Current data will be overwritten.')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Backup restored successfully!');
      } catch (error) {
        toast.error('Failed to restore backup');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!hasRole(['admin'])) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to access system settings.</p>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">System Settings</h1>
          </div>
          <p className="text-gray-500 ml-4">Configure your system preferences and manage application settings</p>
        </div>

        {/* Modern Tabs Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto px-4 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white -mb-px'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 transition-all duration-200 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium">{tab.name}</p>
                    <p className="text-xs text-gray-400 hidden sm:block">{tab.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 lg:p-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CogIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Currency</label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          value={settings.currency}
                          onChange={(e) => handleSettingChange('currency', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Date Format</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Time Zone</label>
                      <div className="relative">
                        <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleSettingChange('timezone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Settings */}
            {activeTab === 'company' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                      <div className="relative">
                        <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={settings.companyName}
                          onChange={(e) => handleSettingChange('companyName', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Company Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          value={settings.companyEmail}
                          onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Company Phone</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          value={settings.companyPhone}
                          onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Company Address</label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <textarea
                          value={settings.companyAddress}
                          onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
                          rows="2"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {activeTab === 'invoice' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Invoice Preferences</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Invoice Prefix</label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={settings.invoicePrefix}
                          onChange={(e) => handleSettingChange('invoicePrefix', e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                          placeholder="INV"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Example: {settings.invoicePrefix}-2024001</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Default Tax Rate</label>
                      <div className="relative">
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          value={settings.taxRate}
                          onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BellIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'lowStockAlert', title: 'Low Stock Alerts', description: 'Receive alerts when products are low on stock', icon: '⚠️' },
                      { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive system updates via email', icon: '📧' },
                      { key: 'autoBackup', title: 'Auto Backup', description: 'Automatically backup system data daily', icon: '💾' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange(item.key, !settings[item.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                              settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <KeyIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-800">Password Policy</p>
                          <p className="text-sm text-yellow-700">Minimum 8 characters, including numbers and symbols</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg">
                      <KeyIcon className="h-5 w-5" />
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg">
                      <ShieldCheckIcon className="h-5 w-5" />
                      Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ServerIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Backup Management</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-10">Manage your system backups</p>
                  </div>
                  <button
                    onClick={createBackup}
                    disabled={loading}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create Backup
                  </button>
                </div>

                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ServerIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{backup.type}</p>
                          <p className="text-sm text-gray-500">{backup.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">{backup.size}</span>
                        <button
                          onClick={() => restoreBackup(backup.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Restore Backup"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Delete Backup">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PaintBrushIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">🌙</div>
                        <div>
                          <p className="font-semibold text-gray-800">Dark Mode</p>
                          <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-3">Color Theme</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { name: 'Blue', color: 'bg-blue-500', borderColor: 'border-blue-500' },
                          { name: 'Green', color: 'bg-green-500', borderColor: 'border-green-500' },
                          { name: 'Purple', color: 'bg-purple-500', borderColor: 'border-purple-500' },
                          { name: 'Orange', color: 'bg-orange-500', borderColor: 'border-orange-500' }
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              theme.name === 'Blue' ? `${theme.borderColor} bg-blue-50` : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-full h-10 rounded-lg ${theme.color} mb-2 shadow-md`}></div>
                            <p className="text-sm font-medium text-gray-700">{theme.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;