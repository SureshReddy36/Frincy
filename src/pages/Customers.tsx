// import React, { useState, useEffect } from 'react';
// import { Plus, Users, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Customer, Village } from '../types';
// import { customersAPI, villagesAPI } from '../services/api';

// interface CustomerForm {
//   name: string;
//   village_id: string;
//   email?: string;
//   phone?: string;
//   address?: string;
// }

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [customersData, villagesData] = await Promise.all([
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setCustomers(customersData);
//       setVillages(villagesData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCustomer = () => {
//     setEditingCustomer(null);
//     reset();
//     setIsModalOpen(true);
//   };

//   const handleEditCustomer = (customer: Customer) => {
//     setEditingCustomer(customer);
//     reset({
//       name: customer.name,
//       village_id: customer.villageId,
//       email: customer.email || '',
//       phone: customer.phone || '',
//       address: customer.address || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this customer?')) return;

//     try {
//       await customersAPI.delete(id);
//       setCustomers(customers.filter(c => c.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete customer:', error);
//       alert('Failed to delete customer: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: CustomerForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingCustomer) {
//         const updated = await customersAPI.update(editingCustomer.id, data);
//         setCustomers(customers.map(c => c.id === editingCustomer.id ? updated : c));
//       } else {
//         const created = await customersAPI.create(data);
//         setCustomers([...customers, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save customer:', error);
//       alert('Failed to save customer: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = selectedVillage 
//     ? customers.filter(c => c.villageId === selectedVillage)
//     : customers;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold">Error Loading Data</p>
//           <p className="text-sm">{error}</p>
//         </div>
//         <Button onClick={fetchData}>Retry</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600">Manage customer accounts and information</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//           Add Customer
//         </Button>
//       </div>

//       {/* Filter by Village */}
//       <div className="flex space-x-4">
//         <select
//           value={selectedVillage}
//           onChange={(e) => setSelectedVillage(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Villages</option>
//           {villages.map((village) => (
//             <option key={village.id} value={village.id}>
//               {village.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <Card key={customer.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {customer.villageName || 'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditCustomer(customer)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteCustomer(customer.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               {customer.email && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Mail className="h-3 w-3 mr-2" />
//                   {customer.email}
//                 </p>
//               )}
//               {customer.phone && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Phone className="h-3 w-3 mr-2" />
//                   {customer.phone}
//                 </p>
//               )}
//               {customer.address && (
//                 <p className="text-sm text-gray-600">{customer.address}</p>
//               )}
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(customer.totalLoanAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total Loan</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(customer.totalPaidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(customer.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredCustomers.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 'No customers found in the selected village.' : 'Get started by creating a new customer.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//               Add Customer
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Customer Name
//             </label>
//             <input
//               {...register('name', { required: 'Customer name is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter customer name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Village
//             </label>
//             <select
//               {...register('village_id', { required: 'Village is required' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Village</option>
//               {villages.map((village) => (
//                 <option key={village.id} value={village.id}>
//                   {village.name}
//                 </option>
//               ))}
//             </select>
//             {errors.village_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email (Optional)
//             </label>
//             <input
//               {...register('email')}
//               type="email"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter email address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone (Optional)
//             </label>
//             <input
//               {...register('phone')}
//               type="tel"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address (Optional)
//             </label>
//             <textarea
//               {...register('address')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter address"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={isSubmitting}>
//               {editingCustomer ? 'Update' : 'Create'} Customer
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };
// export default Customers;

// import React, { useState, useEffect } from 'react';
// import { Plus, Users, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Customer, Village } from '../types';
// import { customersAPI, villagesAPI } from '../services/api';

// interface CustomerForm {
//   name: string;
//   village_id: string;
//   email?: string;
//   phone?: string;
//   address?: string;
// }

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [customersData, villagesData] = await Promise.all([
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setCustomers(customersData);
//       setVillages(villagesData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCustomer = () => {
//     setEditingCustomer(null);
//     reset();
//     setIsModalOpen(true);
//   };

//   const handleEditCustomer = (customer: Customer) => {
//     setEditingCustomer(customer);
//     reset({
//       name: customer.name,
//       village_id: customer.villageId,
//       email: customer.email || '',
//       phone: customer.phone || '',
//       address: customer.address || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this customer?')) return;

//     try {
//       await customersAPI.delete(id);
//       setCustomers(customers.filter(c => c.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete customer:', error);
//       alert('Failed to delete customer: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: CustomerForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingCustomer) {
//         const updated = await customersAPI.update(editingCustomer.id, data);
//         setCustomers(customers.map(c => c.id === editingCustomer.id ? updated : c));
//       } else {
//         const created = await customersAPI.create(data);
//         setCustomers([...customers, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save customer:', error);
//       alert('Failed to save customer: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = selectedVillage 
//     ? customers.filter(c => String(c.villageId) === String(selectedVillage))
//     : customers;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold">Error Loading Data</p>
//           <p className="text-sm">{error}</p>
//         </div>
//         <Button onClick={fetchData}>Retry</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600">Manage customer accounts and information</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//           Add Customer
//         </Button>
//       </div>

//       {/* Filter by Village */}
//       <div className="flex space-x-4">
//         <select
//           value={selectedVillage}
//           onChange={(e) => setSelectedVillage(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Villages</option>
//           {villages.map((village) => (
//             <option key={village.id} value={village.id}>
//               {village.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <Card key={customer.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {customer.villageName || 'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditCustomer(customer)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteCustomer(customer.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               {customer.email && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Mail className="h-3 w-3 mr-2" />
//                   {customer.email}
//                 </p>
//               )}
//               {customer.phone && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Phone className="h-3 w-3 mr-2" />
//                   {customer.phone}
//                 </p>
//               )}
//               {customer.address && (
//                 <p className="text-sm text-gray-600">{customer.address}</p>
//               )}
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(customer.totalLoanAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total Loan</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(customer.totalPaidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(customer.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredCustomers.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 'No customers found in the selected village.' : 'Get started by creating a new customer.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//               Add Customer
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Customer Name
//             </label>
//             <input
//               {...register('name', { required: 'Customer name is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter customer name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Village
//             </label>
//             <select
//               {...register('village_id', { required: 'Village is required' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Village</option>
//               {villages.map((village) => (
//                 <option key={village.id} value={village.id}>
//                   {village.name}
//                 </option>
//               ))}
//             </select>
//             {errors.village_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email (Optional)
//             </label>
//             <input
//               {...register('email')}
//               type="email"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter email address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone (Optional)
//             </label>
//             <input
//               {...register('phone')}
//               type="tel"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address (Optional)
//             </label>
//             <textarea
//               {...register('address')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter address"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={isSubmitting}>
//               {editingCustomer ? 'Update' : 'Create'} Customer
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Customers;

// import React, { useState, useEffect } from 'react';
// import { Plus, Users, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Customer, Village } from '../types';
// import { customersAPI, villagesAPI } from '../services/api';

// interface CustomerForm {
//   name: string;
//   village_id: string;
//   email?: string;
//   phone?: string;
//   address?: string;
// }

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [customersData, villagesData] = await Promise.all([
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setCustomers(customersData);
//       setVillages(villagesData);
      
//       // Debug logging
//       if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
//         console.log('Customers data:', customersData);
//         console.log('Villages data:', villagesData);
//         console.log('Customer village IDs:', customersData.map(c => ({ 
//           name: c.name, 
//           villageId: c.villageId, 
//           village_id: c.village_id 
//         })));
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCustomer = () => {
//     setEditingCustomer(null);
//     reset();
//     setIsModalOpen(true);
//   };

//   const handleEditCustomer = (customer: Customer) => {
//     setEditingCustomer(customer);
//     reset({
//       name: customer.name,
//       village_id: customer.villageId || customer.village_id || '',
//       email: customer.email || '',
//       phone: customer.phone || '',
//       address: customer.address || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this customer?')) return;

//     try {
//       await customersAPI.delete(id);
//       setCustomers(customers.filter(c => c.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete customer:', error);
//       alert('Failed to delete customer: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: CustomerForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingCustomer) {
//         const updated = await customersAPI.update(editingCustomer.id, data);
//         setCustomers(customers.map(c => c.id === editingCustomer.id ? updated : c));
//       } else {
//         const created = await customersAPI.create(data);
//         setCustomers([...customers, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save customer:', error);
//       alert('Failed to save customer: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Fixed filtering logic - handle both field name variations
//   const filteredCustomers = selectedVillage 
//     ? customers.filter(c => {
//         const customerVillageId = String(c.villageId || c.village_id || '');
//         const selectedVillageId = String(selectedVillage);
//         if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
//           console.log('Filtering customer:', c.name, 'Village ID:', customerVillageId, 'Selected:', selectedVillageId);
//         }
//         return customerVillageId === selectedVillageId;
//       })
//     : customers;

//   // Debug log for filtering
//   if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
//     console.log('Selected Village:', selectedVillage);
//     console.log('Total customers:', customers.length);
//     console.log('Filtered customers:', filteredCustomers.length);
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold">Error Loading Data</p>
//           <p className="text-sm">{error}</p>
//         </div>
//         <Button onClick={fetchData}>Retry</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600">Manage customer accounts and information</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//           Add Customer
//         </Button>
//       </div>

//       {/* Filter by Village */}
//       <div className="flex space-x-4">
//         <select
//           value={selectedVillage}
//           onChange={(e) => setSelectedVillage(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Villages ({customers.length} customers)</option>
//           {villages.map((village) => {
//             const villageCustomers = customers.filter(c => 
//               String(c.villageId || c.village_id || '') === String(village.id)
//             );
//             return (
//               <option key={village.id} value={village.id}>
//                 {village.name} ({villageCustomers.length} customers)
//               </option>
//             );
//           })}
//         </select>
        
//         {/* Debug info */}
//         {selectedVillage && (
//           <div className="text-sm text-gray-500 flex items-center">
//             Showing {filteredCustomers.length} of {customers.length} customers
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <Card key={customer.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {customer.villageName || 
//                      villages.find(v => v.id === (customer.villageId || customer.village_id))?.name || 
//                      'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditCustomer(customer)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteCustomer(customer.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               {customer.email && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Mail className="h-3 w-3 mr-2" />
//                   {customer.email}
//                 </p>
//               )}
//               {customer.phone && (
//                 <p className="text-sm text-gray-600 flex items-center">
//                   <Phone className="h-3 w-3 mr-2" />
//                   {customer.phone}
//                 </p>
//               )}
//               {customer.address && (
//                 <p className="text-sm text-gray-600">{customer.address}</p>
//               )}
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(customer.totalLoanAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total Loan</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(customer.totalPaidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(customer.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>

//             {/* Debug info for development */}
//             {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
//               <div className="mt-2 text-xs text-gray-400 border-t pt-2">
//                 ID: {customer.id} | Village ID: {customer.villageId || customer.village_id || 'None'}
//               </div>
//             )}
//           </Card>
//         ))}
//       </div>

//       {filteredCustomers.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 
//               `No customers found in the selected village. Total customers: ${customers.length}` : 
//               'Get started by creating a new customer.'
//             }
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
//               Add Customer
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Customer Name
//             </label>
//             <input
//               {...register('name', { required: 'Customer name is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter customer name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Village
//             </label>
//             <select
//               {...register('village_id', { required: 'Village is required' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Village</option>
//               {villages.map((village) => (
//                 <option key={village.id} value={village.id}>
//                   {village.name} {village.code && `(${village.code})`}
//                 </option>
//               ))}
//             </select>
//             {errors.village_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email (Optional)
//             </label>
//             <input
//               {...register('email')}
//               type="email"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter email address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone (Optional)
//             </label>
//             <input
//               {...register('phone')}
//               type="tel"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address (Optional)
//             </label>
//             <textarea
//               {...register('address')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter address"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={isSubmitting}>
//               {editingCustomer ? 'Update' : 'Create'} Customer
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Customers;

import React, { useState, useEffect } from 'react';
import { Plus, Users, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useForm } from 'react-hook-form';
import { Customer, Village } from '../types';
import { customersAPI, villagesAPI } from '../services/api';

interface CustomerForm {
  name: string;
  village_id: string;
  email?: string;
  phone?: string;
  address?: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const [customersData, villagesData] = await Promise.all([
        customersAPI.getAll(),
        villagesAPI.getAll()
      ]);
      setCustomers(customersData);
      setVillages(villagesData);
      
      // Debug logging
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('Customers data:', customersData);
        console.log('Villages data:', villagesData);
        console.log('Customer village IDs:', customersData.map(c => ({ 
          name: c.name, 
          villageId: c.villageId, 
          village_id: c.village_id 
        })));
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    reset({
      name: customer.name,
      village_id: customer.villageId || customer.village_id || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customersAPI.delete(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error: any) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer: ' + (error.response?.data?.message || error.message));
    }
  };

  const onSubmit = async (data: CustomerForm) => {
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        const updated = await customersAPI.update(editingCustomer.id, data);
        setCustomers(customers.map(c => c.id === editingCustomer.id ? updated : c));
      } else {
        const created = await customersAPI.create(data);
        setCustomers([...customers, created]);
      }
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      console.error('Failed to save customer:', error);
      alert('Failed to save customer: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fixed filtering logic - handle both field name variations
  const filteredCustomers = selectedVillage 
    ? customers.filter(c => {
        const customerVillageId = String(c.villageId || c.village_id || '');
        const selectedVillageId = String(selectedVillage);
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          console.log('Filtering customer:', c.name, 'Village ID:', customerVillageId, 'Selected:', selectedVillageId);
        }
        return customerVillageId === selectedVillageId;
      })
    : customers;

  // Debug log for filtering
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.log('Selected Village:', selectedVillage);
    console.log('Total customers:', customers.length);
    console.log('Filtered customers:', filteredCustomers.length);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error Loading Data</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer accounts and information</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
          Add Customer
        </Button>
      </div>

      {/* Filter by Village */}
      <div className="flex space-x-4">
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Villages ({customers.length} customers)</option>
          {villages.map((village) => {
            const villageCustomers = customers.filter(c => 
              String(c.villageId || c.village_id || '') === String(village.id)
            );
            return (
              <option key={village.id} value={village.id}>
                {village.name} ({villageCustomers.length} customers)
              </option>
            );
          })}
        </select>
        
        {/* Debug info */}
        {selectedVillage && (
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} hover className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{customer.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {customer.villageName || 
                     villages.find(v => v.id === (customer.villageId || customer.village_id))?.name || 
                     'Unknown Village'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCustomer(customer)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {customer.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  {customer.email}
                </p>
              )}
              {customer.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  {customer.phone}
                </p>
              )}
              {customer.address && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{customer.address}</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{(customer.totalLoanAmount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Loan</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">₹{(customer.totalPaidAmount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">₹{(customer.remainingAmount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
                </div>
              </div>
            </div>

            {/* Debug info for development */}
            {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 border-t pt-2">
                ID: {customer.id} | Village ID: {customer.villageId || customer.village_id || 'None'}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No customers</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedVillage ? 
              `No customers found in the selected village. Total customers: ${customers.length}` : 
              'Get started by creating a new customer.'
            }
          </p>
          <div className="mt-6">
            <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateCustomer}>
              Add Customer
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Name
            </label>
            <input
              {...register('name', { required: 'Customer name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Village
            </label>
            <select
              {...register('village_id', { required: 'Village is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Village</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name} {village.code && `(${village.code})`}
                </option>
              ))}
            </select>
            {errors.village_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.village_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (Optional)
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone (Optional)
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address (Optional)
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingCustomer ? 'Update' : 'Create'} Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;