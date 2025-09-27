// import React, { useState } from 'react';
// import { 
//   User, 
//   Bell, 
//   Shield, 
//   Database, 
//   Download, 
//   Upload,
//   Settings as SettingsIcon,
//   Moon,
//   Sun,
//   Globe,
//   Mail,
//   Smartphone,
//   CreditCard,
//   FileText,
//   AlertCircle,
//   CheckCircle,
//   Save
// } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '../context/AuthContext';

// interface NotificationSettings {
//   emailNotifications: boolean;
//   smsNotifications: boolean;
//   pushNotifications: boolean;
//   loanReminders: boolean;
//   paymentAlerts: boolean;
//   systemUpdates: boolean;
// }

// interface SystemSettings {
//   theme: 'light' | 'dark' | 'auto';
//   language: string;
//   currency: string;
//   dateFormat: string;
//   timeZone: string;
// }

// interface SecuritySettings {
//   twoFactorAuth: boolean;
//   sessionTimeout: number;
//   passwordExpiry: number;
//   loginAlerts: boolean;
// }

// const Settings: React.FC = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('account');
//   const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const [notifications, setNotifications] = useState<NotificationSettings>({
//     emailNotifications: true,
//     smsNotifications: false,
//     pushNotifications: true,
//     loanReminders: true,
//     paymentAlerts: true,
//     systemUpdates: false
//   });

//   const [systemSettings, setSystemSettings] = useState<SystemSettings>({
//     theme: 'light',
//     language: 'en',
//     currency: 'INR',
//     dateFormat: 'DD/MM/YYYY',
//     timeZone: 'Asia/Kolkata'
//   });

//   const [security, setSecurity] = useState<SecuritySettings>({
//     twoFactorAuth: false,
//     sessionTimeout: 30,
//     passwordExpiry: 90,
//     loginAlerts: true
//   });

//   const { register: registerAccount, handleSubmit: handleAccountSubmit, formState: { errors: accountErrors } } = useForm();
//   const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch } = useForm();
//   const { register: registerExport, handleSubmit: handleExportSubmit } = useForm();

//   const password = watch('newPassword');

//   const tabs = [
//     { id: 'account', name: 'Account', icon: User },
//     { id: 'notifications', name: 'Notifications', icon: Bell },
//     { id: 'security', name: 'Security', icon: Shield },
//     { id: 'system', name: 'System', icon: SettingsIcon },
//     { id: 'data', name: 'Data Management', icon: Database }
//   ];

//   const showMessage = (type: 'success' | 'error', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   const handleAccountUpdate = async (data: any) => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       showMessage('success', 'Account information updated successfully');
//       setIsAccountModalOpen(false);
//     } catch (error) {
//       showMessage('error', 'Failed to update account information');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async (data: any) => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       showMessage('success', 'Password updated successfully');
//       setIsPasswordModalOpen(false);
//     } catch (error) {
//       showMessage('error', 'Failed to update password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotificationUpdate = async (key: keyof NotificationSettings, value: boolean) => {
//     setNotifications(prev => ({ ...prev, [key]: value }));
//     showMessage('success', 'Notification settings updated');
//   };

//   const handleSystemUpdate = async (key: keyof SystemSettings, value: string) => {
//     setSystemSettings(prev => ({ ...prev, [key]: value }));
//     showMessage('success', 'System settings updated');
//   };

//   const handleSecurityUpdate = async (key: keyof SecuritySettings, value: boolean | number) => {
//     setSecurity(prev => ({ ...prev, [key]: value }));
//     showMessage('success', 'Security settings updated');
//   };

//   const handleDataExport = async (data: any) => {
//     setLoading(true);
//     try {
//       // Simulate export process
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       showMessage('success', 'Data export completed successfully');
//       setIsExportModalOpen(false);
//     } catch (error) {
//       showMessage('error', 'Failed to export data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDataImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     try {
//       // Simulate import process
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       showMessage('success', 'Data imported successfully');
//     } catch (error) {
//       showMessage('error', 'Failed to import data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderAccountSettings = () => (
//     <div className="space-y-6">
//       <Card>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
//               {user?.name?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
//               <p className="text-gray-600">{user?.email}</p>
//               <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
//             </div>
//           </div>
//           <Button onClick={() => setIsAccountModalOpen(true)}>
//             Edit Profile
//           </Button>
//         </div>
//       </Card>

//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Shield className="h-5 w-5 text-blue-500" />
//               <div>
//                 <p className="font-medium text-gray-900">Change Password</p>
//                 <p className="text-sm text-gray-600">Update your account password</p>
//               </div>
//             </div>
//             <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
//               Change
//             </Button>
//           </div>

//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Mail className="h-5 w-5 text-green-500" />
//               <div>
//                 <p className="font-medium text-gray-900">Email Verification</p>
//                 <p className="text-sm text-gray-600">Verify your email address</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span className="text-sm text-green-600">Verified</span>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );

//   const renderNotificationSettings = () => (
//     <div className="space-y-6">
//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
//         <div className="space-y-4">
//           {Object.entries(notifications).map(([key, value]) => (
//             <div key={key} className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium text-gray-900">
//                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {getNotificationDescription(key as keyof NotificationSettings)}
//                 </p>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={value}
//                   onChange={(e) => handleNotificationUpdate(key as keyof NotificationSettings, e.target.checked)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//               </label>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );

//   const renderSecuritySettings = () => (
//     <div className="space-y-6">
//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="font-medium text-gray-900">Two-Factor Authentication</p>
//               <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={security.twoFactorAuth}
//                 onChange={(e) => handleSecurityUpdate('twoFactorAuth', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <p className="font-medium text-gray-900">Login Alerts</p>
//               <p className="text-sm text-gray-600">Get notified of new login attempts</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={security.loginAlerts}
//                 onChange={(e) => handleSecurityUpdate('loginAlerts', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Session Timeout (minutes)
//             </label>
//             <select
//               value={security.sessionTimeout}
//               onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={15}>15 minutes</option>
//               <option value={30}>30 minutes</option>
//               <option value={60}>1 hour</option>
//               <option value={120}>2 hours</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Password Expiry (days)
//             </label>
//             <select
//               value={security.passwordExpiry}
//               onChange={(e) => handleSecurityUpdate('passwordExpiry', parseInt(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={30}>30 days</option>
//               <option value={60}>60 days</option>
//               <option value={90}>90 days</option>
//               <option value={180}>180 days</option>
//               <option value={365}>1 year</option>
//             </select>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );

//   const renderSystemSettings = () => (
//     <div className="space-y-6">
//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Theme</label>
//             <select
//               value={systemSettings.theme}
//               onChange={(e) => handleSystemUpdate('theme', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="light">Light</option>
//               <option value="dark">Dark</option>
//               <option value="auto">Auto</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Language</label>
//             <select
//               value={systemSettings.language}
//               onChange={(e) => handleSystemUpdate('language', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="en">English</option>
//               <option value="hi">Hindi</option>
//               <option value="te">Telugu</option>
//               <option value="ta">Tamil</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Currency</label>
//             <select
//               value={systemSettings.currency}
//               onChange={(e) => handleSystemUpdate('currency', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="INR">Indian Rupee (₹)</option>
//               <option value="USD">US Dollar ($)</option>
//               <option value="EUR">Euro (€)</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Date Format</label>
//             <select
//               value={systemSettings.dateFormat}
//               onChange={(e) => handleSystemUpdate('dateFormat', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//               <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//               <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Time Zone</label>
//             <select
//               value={systemSettings.timeZone}
//               onChange={(e) => handleSystemUpdate('timeZone', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
//               <option value="UTC">UTC</option>
//               <option value="America/New_York">America/New_York (EST)</option>
//             </select>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );

//   const renderDataManagement = () => (
//     <div className="space-y-6">
//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
//         <div className="space-y-4">
//           <p className="text-gray-600">Export your data for backup or migration purposes.</p>
//           <Button 
//             icon={<Download className="h-4 w-4" />}
//             onClick={() => setIsExportModalOpen(true)}
//           >
//             Export Data
//           </Button>
//         </div>
//       </Card>

//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Import</h3>
//         <div className="space-y-4">
//           <p className="text-gray-600">Import data from a previously exported file.</p>
//           <div className="flex items-center space-x-4">
//             <input
//               type="file"
//               accept=".json,.csv"
//               onChange={handleDataImport}
//               className="hidden"
//               id="data-import"
//             />
//             <label htmlFor="data-import">
//               <Button 
//                 as="span"
//                 icon={<Upload className="h-4 w-4" />}
//                 variant="outline"
//                 className="cursor-pointer"
//               >
//                 Import Data
//               </Button>
//             </label>
//           </div>
//         </div>
//       </Card>

//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Maintenance</h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div>
//               <p className="font-medium text-gray-900">Optimize Database</p>
//               <p className="text-sm text-gray-600">Improve database performance</p>
//             </div>
//             <Button variant="outline">Optimize</Button>
//           </div>

//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div>
//               <p className="font-medium text-gray-900">Clear Cache</p>
//               <p className="text-sm text-gray-600">Clear application cache</p>
//             </div>
//             <Button variant="outline">Clear</Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );

//   const getNotificationDescription = (key: keyof NotificationSettings) => {
//     const descriptions = {
//       emailNotifications: 'Receive notifications via email',
//       smsNotifications: 'Receive notifications via SMS',
//       pushNotifications: 'Receive push notifications in browser',
//       loanReminders: 'Get reminders for loan due dates',
//       paymentAlerts: 'Get alerts for payment confirmations',
//       systemUpdates: 'Receive system update notifications'
//     };
//     return descriptions[key];
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//         <p className="text-gray-600">Manage your account and application preferences</p>
//       </div>

//       {message && (
//         <div className={`p-4 rounded-lg flex items-center space-x-2 ${
//           message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//         }`}>
//           {message.type === 'success' ? (
//             <CheckCircle className="h-5 w-5" />
//           ) : (
//             <AlertCircle className="h-5 w-5" />
//           )}
//           <span>{message.text}</span>
//         </div>
//       )}

//       <div className="flex space-x-6">
//         {/* Sidebar */}
//         <div className="w-64 space-y-2">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                   activeTab === tab.id
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span className="font-medium">{tab.name}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Content */}
//         <div className="flex-1">
//           {activeTab === 'account' && renderAccountSettings()}
//           {activeTab === 'notifications' && renderNotificationSettings()}
//           {activeTab === 'security' && renderSecuritySettings()}
//           {activeTab === 'system' && renderSystemSettings()}
//           {activeTab === 'data' && renderDataManagement()}
//         </div>
//       </div>

//       {/* Account Edit Modal */}
//       <Modal
//         isOpen={isAccountModalOpen}
//         onClose={() => setIsAccountModalOpen(false)}
//         title="Edit Profile"
//       >
//         <form onSubmit={handleAccountSubmit(handleAccountUpdate)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               {...registerAccount('name', { required: 'Name is required' })}
//               type="text"
//               defaultValue={user?.name}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {accountErrors.name && (
//               <p className="mt-1 text-sm text-red-600">{accountErrors.name.message as string}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               {...registerAccount('email', { 
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: 'Invalid email address'
//                 }
//               })}
//               type="email"
//               defaultValue={user?.email}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {accountErrors.email && (
//               <p className="mt-1 text-sm text-red-600">{accountErrors.email.message as string}</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsAccountModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={loading}>
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Password Change Modal */}
//       <Modal
//         isOpen={isPasswordModalOpen}
//         onClose={() => setIsPasswordModalOpen(false)}
//         title="Change Password"
//       >
//         <form onSubmit={handlePasswordSubmit(handlePasswordUpdate)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Current Password
//             </label>
//             <input
//               {...registerPassword('currentPassword', { required: 'Current password is required' })}
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {passwordErrors.currentPassword && (
//               <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message as string}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>
//             <input
//               {...registerPassword('newPassword', { 
//                 required: 'New password is required',
//                 minLength: {
//                   value: 6,
//                   message: 'Password must be at least 6 characters'
//                 }
//               })}
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {passwordErrors.newPassword && (
//               <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message as string}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm New Password
//             </label>
//             <input
//               {...registerPassword('confirmPassword', { 
//                 required: 'Please confirm your password',
//                 validate: value => value === password || 'Passwords do not match'
//               })}
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {passwordErrors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message as string}</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsPasswordModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={loading}>
//               Update Password
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Export Modal */}
//       <Modal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//         title="Export Data"
//       >
//         <form onSubmit={handleExportSubmit(handleDataExport)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Export Format
//             </label>
//             <select
//               {...registerExport('format')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="json">JSON</option>
//               <option value="csv">CSV</option>
//               <option value="excel">Excel</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Data to Export
//             </label>
//             <div className="space-y-2">
//               {['villages', 'customers', 'loans', 'payments'].map((item) => (
//                 <label key={item} className="flex items-center">
//                   <input
//                     {...registerExport(item)}
//                     type="checkbox"
//                     defaultChecked
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700 capitalize">{item}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsExportModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={loading}>
//               Export Data
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Settings;
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Download, 
  Upload,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  loanReminders: boolean;
  paymentAlerts: boolean;
  systemUpdates: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAlerts: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    loanReminders: true,
    paymentAlerts: true,
    systemUpdates: false
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timeZone: 'Asia/Kolkata'
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true
  });

  const { register: registerAccount, handleSubmit: handleAccountSubmit, formState: { errors: accountErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch } = useForm();
  const { register: registerExport, handleSubmit: handleExportSubmit } = useForm();

  const password = watch('newPassword');

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: SettingsIcon },
    { id: 'data', name: 'Data Management', icon: Database }
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAccountUpdate = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Account information updated successfully');
      setIsAccountModalOpen(false);
    } catch (error) {
      showMessage('error', 'Failed to update account information');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Password updated successfully');
      setIsPasswordModalOpen(false);
    } catch (error) {
      showMessage('error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    showMessage('success', 'Notification settings updated');
  };

  const handleSystemUpdate = async (key: string, value: string) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    showMessage('success', 'System settings updated');
  };

  const handleSecurityUpdate = async (key: keyof SecuritySettings, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    showMessage('success', 'Security settings updated');
  };

  const handleDataExport = async (data: any) => {
    setLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      showMessage('success', 'Data export completed successfully');
      setIsExportModalOpen(false);
    } catch (error) {
      showMessage('error', 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDataImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      showMessage('success', 'Data imported successfully');
    } catch (error) {
      showMessage('error', 'Failed to import data');
    } finally {
      setLoading(false);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'auto':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">Role: {user?.role}</p>
            </div>
          </div>
          <Button onClick={() => setIsAccountModalOpen(true)}>
            Edit Profile
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Change Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Verification</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verify your email address</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Verified</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getNotificationDescription(key as keyof NotificationSettings)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationUpdate(key as keyof NotificationSettings, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={(e) => handleSecurityUpdate('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Login Alerts</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.loginAlerts}
                onChange={(e) => handleSecurityUpdate('loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Timeout (minutes)
            </label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Expiry (days)
            </label>
            <select
              value={security.passwordExpiry}
              onChange={(e) => handleSecurityUpdate('passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="flex space-x-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'auto', label: 'Auto', icon: Monitor }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    theme === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select
              value={systemSettings.language}
              onChange={(e) => handleSystemUpdate('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <select
              value={systemSettings.currency}
              onChange={(e) => handleSystemUpdate('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => handleSystemUpdate('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
            <select
              value={systemSettings.timeZone}
              onChange={(e) => handleSystemUpdate('timeZone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Export</h3>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Export your data for backup or migration purposes.</p>
          <Button 
            icon={<Download className="h-4 w-4" />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Data
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Import</h3>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Import data from a previously exported file.</p>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleDataImport}
              className="hidden"
              id="data-import"
            />
            <label htmlFor="data-import">
              <Button 
                as="span"
                icon={<Upload className="h-4 w-4" />}
                variant="outline"
                className="cursor-pointer"
              >
                Import Data
              </Button>
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Database Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Optimize Database</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Improve database performance</p>
            </div>
            <Button variant="outline">Optimize</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Clear Cache</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clear application cache</p>
            </div>
            <Button variant="outline">Clear</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const getNotificationDescription = (key: keyof NotificationSettings) => {
    const descriptions = {
      emailNotifications: 'Receive notifications via email',
      smsNotifications: 'Receive notifications via SMS',
      pushNotifications: 'Receive push notifications in browser',
      loanReminders: 'Get reminders for loan due dates',
      paymentAlerts: 'Get alerts for payment confirmations',
      systemUpdates: 'Receive system update notifications'
    };
    return descriptions[key];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'account' && renderAccountSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'data' && renderDataManagement()}
        </div>
      </div>

      {/* Account Edit Modal */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleAccountSubmit(handleAccountUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              {...registerAccount('name', { required: 'Name is required' })}
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {accountErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{accountErrors.name.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              {...registerAccount('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {accountErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{accountErrors.email.message as string}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAccountModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit(handlePasswordUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              {...registerPassword('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              {...registerPassword('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword.message as string}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
      >
        <form onSubmit={handleExportSubmit(handleDataExport)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Export Format
            </label>
            <select
              {...registerExport('format')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data to Export
            </label>
            <div className="space-y-2">
              {['villages', 'customers', 'loans', 'payments'].map((item) => (
                <label key={item} className="flex items-center">
                  <input
                    {...registerExport(item)}
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Export Data
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;