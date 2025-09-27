// import React, { useState, useEffect } from 'react';
// import { Plus, CreditCard, MapPin, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Loan, Customer, Village } from '../types';
// import { loansAPI, customersAPI, villagesAPI } from '../services/api';

// interface LoanForm {
//   customer_id: string;
//   village_id: string;
//   principal_amount: number;
//   interest_rate: number;
//   loan_period_months: number;
//   start_date: string;
// }

// const Loans: React.FC = () => {
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LoanForm>();
//   const watchedVillageId = watch('village_id');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Reset customer selection when village changes
//   useEffect(() => {
//     if (watchedVillageId) {
//       setValue('customer_id', '');
//     }
//   }, [watchedVillageId, setValue]);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [loansData, customersData, villagesData] = await Promise.all([
//         loansAPI.getAll(),
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setLoans(loansData);
//       setCustomers(customersData);
//       setVillages(villagesData);
      
//       // Debug logging
//       console.log('Customers data:', customersData);
//       console.log('Villages data:', villagesData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLoan = () => {
//     setEditingLoan(null);
//     reset({
//       village_id: '',
//       customer_id: '',
//       principal_amount: 0,
//       interest_rate: 0,
//       loan_period_months: 12,
//       start_date: new Date().toISOString().split('T')[0] // Set default to today
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditLoan = (loan: Loan) => {
//     setEditingLoan(loan);
//     reset({
//       customer_id: loan.customerId,
//       village_id: loan.villageId,
//       principal_amount: loan.amount,
//       interest_rate: loan.interestRate,
//       loan_period_months: 12, // Default value since we don't store this
//       start_date: loan.startDate
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteLoan = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this loan?')) return;

//     try {
//       await loansAPI.delete(id);
//       setLoans(loans.filter(l => l.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete loan:', error);
//       alert('Failed to delete loan: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: LoanForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingLoan) {
//         // For updates, create a properly typed update object
//         const updateData: any = {
//           interest_rate: data.interest_rate,
//           loan_period_months: data.loan_period_months
//         };
//         const updated = await loansAPI.update(editingLoan.id, updateData);
//         setLoans(loans.map(l => l.id === editingLoan.id ? updated : l));
//       } else {
//         const created = await loansAPI.create(data);
//         setLoans([...loans, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save loan:', error);
//       alert('Failed to save loan: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Filter customers based on selected village - Fixed filtering logic
//   const filteredCustomers = watchedVillageId 
//     ? customers.filter(c => {
//         // Convert both to strings and compare
//         const customerVillageId = String(c.villageId || c.village_id);
//         const selectedVillageId = String(watchedVillageId);
//         console.log('Filtering customer:', c.name, 'Village ID:', customerVillageId, 'Selected:', selectedVillageId);
//         return customerVillageId === selectedVillageId;
//       })
//     : [];

//   // Debug log for filtered customers
//   console.log('Watched Village ID:', watchedVillageId);
//   console.log('Filtered Customers:', filteredCustomers);

//   const filteredLoans = selectedVillage 
//     ? loans.filter(l => String(l.villageId) === String(selectedVillage))
//     : loans;

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
//           <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
//           <p className="text-gray-600">Manage customer loans and repayments</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//           Add Loan
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
//         {filteredLoans.map((loan) => (
//           <Card key={loan.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
//                   <CreditCard className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{loan.customerName || 'Unknown Customer'}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {loan.villageName || 'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditLoan(loan)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteLoan(loan.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Principal Amount:</span>
//                 <span className="text-sm font-medium">₹{(loan.amount || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Interest Rate:</span>
//                 <span className="text-sm font-medium">{loan.interestRate || 0}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Start Date:</span>
//                 <span className="text-sm font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Status:</span>
//                 <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
//                   loan.status === 'active' ? 'bg-green-100 text-green-800' :
//                   loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {loan.status}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(loan.totalAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(loan.paidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(loan.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredLoans.length === 0 && (
//         <div className="text-center py-12">
//           <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 'No loans found in the selected village.' : 'Get started by creating a new loan.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//               Add Loan
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingLoan ? 'Edit Loan' : 'Add New Loan'}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Village
//               </label>
//               <select
//                 {...register('village_id', { required: 'Village is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!!editingLoan}
//               >
//                 <option value="">Select Village</option>
//                 {villages.map((village) => (
//                   <option key={village.id} value={village.id}>
//                     {village.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.village_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Customer
//               </label>
//               <select
//                 {...register('customer_id', { required: 'Customer is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!watchedVillageId || !!editingLoan}
//               >
//                 <option value="">
//                   {!watchedVillageId ? 'Select Village First' : 
//                    filteredCustomers.length === 0 ? 'No customers in this village' : 
//                    'Select Customer'}
//                 </option>
//                 {filteredCustomers.map((customer) => (
//                   <option key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.customer_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
//               )}
//               {watchedVillageId && filteredCustomers.length === 0 && !editingLoan && (
//                 <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     No customers found in this village. Please add customers first.
//                   </p>
//                   <p className="text-xs text-yellow-600 mt-1">
//                     Debug: Village ID = {watchedVillageId}, Total customers = {customers.length}
//                   </p>
//                   <div className="text-xs text-yellow-600 mt-1">
//                     Customer village IDs: {customers.map(c => `${c.name}(${c.villageId || c.village_id})`).join(', ')}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Principal Amount (₹)
//               </label>
//               <input
//                 {...register('principal_amount', { 
//                   required: 'Principal amount is required',
//                   min: { value: 1, message: 'Amount must be greater than 0' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter principal amount"
//                 disabled={!!editingLoan}
//               />
//               {errors.principal_amount && (
//                 <p className="mt-1 text-sm text-red-600">{errors.principal_amount.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Interest Rate (%)
//               </label>
//               <input
//                 {...register('interest_rate', { 
//                   required: 'Interest rate is required',
//                   min: { value: 0, message: 'Interest rate must be 0 or greater' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter interest rate"
//               />
//               {errors.interest_rate && (
//                 <p className="mt-1 text-sm text-red-600">{errors.interest_rate.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Loan Period (Months)
//               </label>
//               <input
//                 {...register('loan_period_months', { 
//                   required: 'Loan period is required',
//                   min: { value: 1, message: 'Loan period must be at least 1 month' }
//                 })}
//                 type="number"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter loan period in months"
//               />
//               {errors.loan_period_months && (
//                 <p className="mt-1 text-sm text-red-600">{errors.loan_period_months.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 {...register('start_date', { required: 'Start date is required' })}
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!!editingLoan}
//               />
//               {errors.start_date && (
//                 <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
//               )}
//             </div>
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
//               {editingLoan ? 'Update' : 'Create'} Loan
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Loans;

// import React, { useState, useEffect } from 'react';
// import { Plus, CreditCard, Users, MapPin, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Loan, Customer, Village } from '../types';
// import { loansAPI, customersAPI, villagesAPI } from '../services/api';

// interface LoanForm {
//   customer_id: string;
//   village_id: string;
//   principal_amount: number;
//   interest_rate: number;
//   loan_period_months: number;
//   start_date: string;
// }

// const Loans: React.FC = () => {
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<LoanForm>();
//   const watchedVillageId = watch('village_id');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [loansData, customersData, villagesData] = await Promise.all([
//         loansAPI.getAll(),
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setLoans(loansData);
//       setCustomers(customersData);
//       setVillages(villagesData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLoan = () => {
//     setEditingLoan(null);
//     reset({
//       start_date: new Date().toISOString().split('T')[0] // Set default to today
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditLoan = (loan: Loan) => {
//     setEditingLoan(loan);
//     reset({
//       customer_id: loan.customerId,
//       village_id: loan.villageId,
//       principal_amount: loan.amount,
//       interest_rate: loan.interestRate,
//       loan_period_months: 12, // Default value since we don't store this
//       start_date: loan.startDate
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteLoan = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this loan?')) return;

//     try {
//       await loansAPI.delete(id);
//       setLoans(loans.filter(l => l.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete loan:', error);
//       alert('Failed to delete loan: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: LoanForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingLoan) {
//         const updated = await loansAPI.update(editingLoan.id, data);
//         setLoans(loans.map(l => l.id === editingLoan.id ? updated : l));
//       } else {
//         const created = await loansAPI.create(data);
//         setLoans([...loans, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save loan:', error);
//       alert('Failed to save loan: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = watchedVillageId 
//     ? customers.filter(c => c.villageId === watchedVillageId)
//     : customers;

//   const filteredLoans = selectedVillage 
//     ? loans.filter(l => l.villageId === selectedVillage)
//     : loans;

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
//           <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
//           <p className="text-gray-600">Manage customer loans and repayments</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//           Add Loan
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
//         {filteredLoans.map((loan) => (
//           <Card key={loan.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
//                   <CreditCard className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{loan.customerName || 'Unknown Customer'}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {loan.villageName || 'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditLoan(loan)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteLoan(loan.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Principal Amount:</span>
//                 <span className="text-sm font-medium">₹{(loan.amount || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Interest Rate:</span>
//                 <span className="text-sm font-medium">{loan.interestRate || 0}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Start Date:</span>
//                 <span className="text-sm font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Status:</span>
//                 <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
//                   loan.status === 'active' ? 'bg-green-100 text-green-800' :
//                   loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {loan.status}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(loan.totalAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(loan.paidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(loan.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredLoans.length === 0 && (
//         <div className="text-center py-12">
//           <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 'No loans found in the selected village.' : 'Get started by creating a new loan.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//               Add Loan
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingLoan ? 'Edit Loan' : 'Add New Loan'}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Village
//               </label>
//               <select
//                 {...register('village_id', { required: 'Village is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Village</option>
//                 {villages.map((village) => (
//                   <option key={village.id} value={village.id}>
//                     {village.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.village_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Customer
//               </label>
//               <select
//                 {...register('customer_id', { required: 'Customer is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Customer</option>
//                 {filteredCustomers.map((customer) => (
//                   <option key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.customer_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Principal Amount (₹)
//               </label>
//               <input
//                 {...register('principal_amount', { 
//                   required: 'Principal amount is required',
//                   min: { value: 1, message: 'Amount must be greater than 0' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter principal amount"
//               />
//               {errors.principal_amount && (
//                 <p className="mt-1 text-sm text-red-600">{errors.principal_amount.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Interest Rate (%)
//               </label>
//               <input
//                 {...register('interest_rate', { 
//                   required: 'Interest rate is required',
//                   min: { value: 0, message: 'Interest rate must be 0 or greater' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter interest rate"
//               />
//               {errors.interest_rate && (
//                 <p className="mt-1 text-sm text-red-600">{errors.interest_rate.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Loan Period (Months)
//               </label>
//               <input
//                 {...register('loan_period_months', { 
//                   required: 'Loan period is required',
//                   min: { value: 1, message: 'Loan period must be at least 1 month' }
//                 })}
//                 type="number"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter loan period in months"
//               />
//               {errors.loan_period_months && (
//                 <p className="mt-1 text-sm text-red-600">{errors.loan_period_months.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 {...register('start_date', { required: 'Start date is required' })}
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.start_date && (
//                 <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
//               )}
//             </div>
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
//               {editingLoan ? 'Update' : 'Create'} Loan
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { Plus, CreditCard, MapPin, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Loan, Customer, Village } from '../types';
// import { loansAPI, customersAPI, villagesAPI } from '../services/api';

// interface LoanForm {
//   customer_id: string;
//   village_id: string;
//   principal_amount: number;
//   interest_rate: number;
//   loan_period_months: number;
//   start_date: string;
//   due_date: string;
// }

// const Loans: React.FC = () => {
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedVillage, setSelectedVillage] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LoanForm>();
//   const watchedVillageId = watch('village_id');
//   const watchedStartDate = watch('start_date');
//   const watchedLoanPeriod = watch('loan_period_months');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Reset customer selection when village changes
//   useEffect(() => {
//     if (watchedVillageId) {
//       setValue('customer_id', '');
//     }
//   }, [watchedVillageId, setValue]);

//   // Auto-calculate due date when start date or loan period changes
//   useEffect(() => {
//     if (watchedStartDate && watchedLoanPeriod) {
//       const startDate = new Date(watchedStartDate);
//       const dueDate = new Date(startDate);
//       dueDate.setMonth(dueDate.getMonth() + parseInt(watchedLoanPeriod.toString()));
//       setValue('due_date', dueDate.toISOString().split('T')[0]);
//     }
//   }, [watchedStartDate, watchedLoanPeriod, setValue]);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [loansData, customersData, villagesData] = await Promise.all([
//         loansAPI.getAll(),
//         customersAPI.getAll(),
//         villagesAPI.getAll()
//       ]);
//       setLoans(loansData);
//       setCustomers(customersData);
//       setVillages(villagesData);
      
//       // Debug logging
//       console.log('Customers data:', customersData);
//       console.log('Villages data:', villagesData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLoan = () => {
//     setEditingLoan(null);
//     const today = new Date().toISOString().split('T')[0];
//     reset({
//       village_id: '',
//       customer_id: '',
//       principal_amount: 0,
//       interest_rate: 0,
//       loan_period_months: 12,
//       start_date: today,
//       due_date: ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditLoan = (loan: Loan) => {
//     setEditingLoan(loan);
//     const startDate = loan.startDate || loan.start_date || new Date().toISOString().split('T')[0];
//     const dueDate = loan.endDate || loan.end_date || '';
    
//     reset({
//       customer_id: loan.customerId,
//       village_id: loan.villageId,
//       principal_amount: loan.amount,
//       interest_rate: loan.interestRate,
//       loan_period_months: 12, // Default value since we don't store this
//       start_date: startDate,
//       due_date: dueDate
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteLoan = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this loan?')) return;

//     try {
//       await loansAPI.delete(id);
//       setLoans(loans.filter(l => l.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete loan:', error);
//       alert('Failed to delete loan: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: LoanForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingLoan) {
//         // For updates, create a properly typed update object
//         const updateData: any = {
//           interest_rate: data.interest_rate,
//           loan_period_months: data.loan_period_months
//         };
//         const updated = await loansAPI.update(editingLoan.id, updateData);
//         setLoans(loans.map(l => l.id === editingLoan.id ? updated : l));
//       } else {
//         const created = await loansAPI.create(data);
//         setLoans([...loans, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save loan:', error);
//       alert('Failed to save loan: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Filter customers based on selected village - Fixed filtering logic
//   const filteredCustomers = watchedVillageId 
//     ? customers.filter(c => {
//         // Convert both to strings and compare
//         const customerVillageId = String(c.villageId || c.village_id);
//         const selectedVillageId = String(watchedVillageId);
//         console.log('Filtering customer:', c.name, 'Village ID:', customerVillageId, 'Selected:', selectedVillageId);
//         return customerVillageId === selectedVillageId;
//       })
//     : [];

//   // Debug log for filtered customers
//   console.log('Watched Village ID:', watchedVillageId);
//   console.log('Filtered Customers:', filteredCustomers);

//   const filteredLoans = selectedVillage 
//     ? loans.filter(l => String(l.villageId) === String(selectedVillage))
//     : loans;

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
//           <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
//           <p className="text-gray-600">Manage customer loans and repayments</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//           Add Loan
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
//         {filteredLoans.map((loan) => (
//           <Card key={loan.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
//                   <CreditCard className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{loan.customerName || 'Unknown Customer'}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     {loan.villageName || 'Unknown Village'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditLoan(loan)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteLoan(loan.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Principal Amount:</span>
//                 <span className="text-sm font-medium">₹{(loan.amount || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Interest Rate:</span>
//                 <span className="text-sm font-medium">{loan.interestRate || 0}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Start Date:</span>
//                 <span className="text-sm font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
//               </div>
//               {loan.endDate && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Due Date:</span>
//                   <span className="text-sm font-medium">{new Date(loan.endDate).toLocaleDateString()}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Status:</span>
//                 <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
//                   loan.status === 'active' ? 'bg-green-100 text-green-800' :
//                   loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {loan.status}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">₹{(loan.totalAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Total</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-green-600">₹{(loan.paidAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Paid</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">₹{(loan.remainingAmount || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">Remaining</p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredLoans.length === 0 && (
//         <div className="text-center py-12">
//           <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedVillage ? 'No loans found in the selected village.' : 'Get started by creating a new loan.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
//               Add Loan
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingLoan ? 'Edit Loan' : 'Add New Loan'}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Village
//               </label>
//               <select
//                 {...register('village_id', { required: 'Village is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!!editingLoan}
//               >
//                 <option value="">Select Village</option>
//                 {villages.map((village) => (
//                   <option key={village.id} value={village.id}>
//                     {village.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.village_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.village_id.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Customer
//               </label>
//               <select
//                 {...register('customer_id', { required: 'Customer is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!watchedVillageId || !!editingLoan}
//               >
//                 <option value="">
//                   {!watchedVillageId ? 'Select Village First' : 
//                    filteredCustomers.length === 0 ? 'No customers in this village' : 
//                    'Select Customer'}
//                 </option>
//                 {filteredCustomers.map((customer) => (
//                   <option key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.customer_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
//               )}
//               {watchedVillageId && filteredCustomers.length === 0 && !editingLoan && (
//                 <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     No customers found in this village. Please add customers first.
//                   </p>
//                   <p className="text-xs text-yellow-600 mt-1">
//                     Debug: Village ID = {watchedVillageId}, Total customers = {customers.length}
//                   </p>
//                   <div className="text-xs text-yellow-600 mt-1">
//                     Customer village IDs: {customers.map(c => `${c.name}(${c.villageId || c.village_id})`).join(', ')}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Principal Amount (₹)
//               </label>
//               <input
//                 {...register('principal_amount', { 
//                   required: 'Principal amount is required',
//                   min: { value: 1, message: 'Amount must be greater than 0' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter principal amount"
//                 disabled={!!editingLoan}
//               />
//               {errors.principal_amount && (
//                 <p className="mt-1 text-sm text-red-600">{errors.principal_amount.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Interest Rate (%)
//               </label>
//               <input
//                 {...register('interest_rate', { 
//                   required: 'Interest rate is required',
//                   min: { value: 0, message: 'Interest rate must be 0 or greater' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter interest rate"
//               />
//               {errors.interest_rate && (
//                 <p className="mt-1 text-sm text-red-600">{errors.interest_rate.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Loan Period (Months)
//               </label>
//               <input
//                 {...register('loan_period_months', { 
//                   required: 'Loan period is required',
//                   min: { value: 1, message: 'Loan period must be at least 1 month' }
//                 })}
//                 type="number"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter loan period in months"
//               />
//               {errors.loan_period_months && (
//                 <p className="mt-1 text-sm text-red-600">{errors.loan_period_months.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 {...register('start_date', { required: 'Start date is required' })}
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!!editingLoan}
//               />
//               {errors.start_date && (
//                 <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <input
//               {...register('due_date', { required: 'Due date is required' })}
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={!!editingLoan}
//             />
//             {errors.due_date && (
//               <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
//             )}
//             <p className="mt-1 text-xs text-gray-500">
//               Due date will be automatically calculated based on start date and loan period
//             </p>
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
//               {editingLoan ? 'Update' : 'Create'} Loan
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Loans;

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit, Trash2, CreditCard } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useForm } from 'react-hook-form';
import { Loan, Customer, Village } from '../types';
import { loansAPI, customersAPI, villagesAPI } from '../services/api';

interface LoanForm {
  customer_id: string;
  village_id: string;
  principal_amount: number;
  interest_rate: number;
  loan_period_months: number;
  start_date: string;
  due_date: string;
}

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LoanForm>();
  const watchedVillageId = watch('village_id');
  const watchedStartDate = watch('start_date');
  const watchedLoanPeriod = watch('loan_period_months');

  useEffect(() => {
    fetchData();
  }, []);

  // Reset customer selection when village changes
  useEffect(() => {
    if (watchedVillageId) {
      setValue('customer_id', '');
    }
  }, [watchedVillageId, setValue]);

  // Auto-calculate due date when start date or loan period changes
  useEffect(() => {
    if (watchedStartDate && watchedLoanPeriod) {
      const startDate = new Date(watchedStartDate);
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + Number(watchedLoanPeriod));
      setValue('due_date', dueDate.toISOString().split('T')[0]);
    }
  }, [watchedStartDate, watchedLoanPeriod, setValue]);

  const fetchData = async () => {
    try {
      setError('');
      const [loansData, customersData, villagesData] = await Promise.all([
        loansAPI.getAll(),
        customersAPI.getAll(),
        villagesAPI.getAll()
      ]);
      setLoans(loansData);
      setCustomers(customersData);
      setVillages(villagesData);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = () => {
    setEditingLoan(null);
    const today = new Date().toISOString().split('T')[0];
    reset({
      village_id: '',
      customer_id: '',
      principal_amount: 0,
      interest_rate: 0,
      loan_period_months: 12,
      start_date: today,
      due_date: ''
    });
    setIsModalOpen(true);
  };

  const handleEditLoan = (loan: Loan) => {
    setEditingLoan(loan);
    const startDate = loan.startDate || loan.start_date || new Date().toISOString().split('T')[0];
    const dueDate = loan.dueDate || loan.due_date || loan.endDate || loan.end_date || '';
    
    reset({
      customer_id: loan.customerId || loan.customer_id || '',
      village_id: loan.villageId || loan.village_id || '',
      principal_amount: loan.amount || loan.principal_amount || 0,
      interest_rate: loan.interestRate || loan.interest_rate || 0,
      loan_period_months: 12, // Default value since we don't store this
      start_date: startDate,
      due_date: dueDate
    });
    setIsModalOpen(true);
  };

  const handleDeleteLoan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;

    try {
      await loansAPI.delete(id);
      setLoans(loans.filter(l => l.id !== id));
    } catch (error: any) {
      console.error('Failed to delete loan:', error);
      alert('Failed to delete loan: ' + (error.response?.data?.message || error.message));
    }
  };

  const onSubmit = async (data: LoanForm) => {
    setIsSubmitting(true);
    try {
      if (editingLoan) {
        // For updates, create a properly typed update object
        const updateData: any = {
          interest_rate: data.interest_rate,
          loan_period_months: data.loan_period_months
        };
        const updated = await loansAPI.update(editingLoan.id, updateData);
        setLoans(loans.map(l => l.id === editingLoan.id ? updated : l));
      } else {
        const created = await loansAPI.create(data);
        setLoans([...loans, created]);
      }
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      console.error('Failed to save loan:', error);
      alert('Failed to save loan: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter customers based on selected village - Fixed filtering logic
  const filteredCustomers = watchedVillageId 
    ? customers.filter(c => {
        const customerVillageId = String(c.villageId || c.village_id || '');
        const selectedVillageId = String(watchedVillageId);
        return customerVillageId === selectedVillageId;
      })
    : [];

  // Fixed filtering for loans by village - handle both field name variations
  const filteredLoans = selectedVillage 
    ? loans.filter(l => {
        const loanVillageId = String(l.villageId || l.village_id || '');
        const selectedVillageId = String(selectedVillage);
        return loanVillageId === selectedVillageId;
      })
    : loans;

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
        <div className="text-red-600 dark:text-red-400 text-center">
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loans</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer loans and repayments</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
          Add Loan
        </Button>
      </div>

      {/* Filter by Village */}
      <div className="flex space-x-4 items-center">
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Villages ({loans.length} loans)</option>
          {villages.map((village) => {
            const villageLoans = loans.filter(l => 
              String(l.villageId || l.village_id || '') === String(village.id)
            );
            return (
              <option key={village.id} value={village.id}>
                {village.name} ({villageLoans.length} loans)
              </option>
            );
          })}
        </select>
        
        {/* Filter summary */}
        {selectedVillage && (
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Showing {filteredLoans.length} of {loans.length} loans
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.map((loan) => (
          <Card key={loan.id} hover className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {loan.customerName || 
                     customers.find(c => c.id === (loan.customerId || loan.customer_id))?.name || 
                     'Unknown Customer'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {loan.villageName || 
                     villages.find(v => v.id === (loan.villageId || loan.village_id))?.name || 
                     'Unknown Village'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditLoan(loan)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteLoan(loan.id)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Principal Amount:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{((loan.amount || loan.principal_amount) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{(loan.interestRate || loan.interest_rate) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Start Date:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {(loan.startDate || loan.start_date) ? 
                    new Date(loan.startDate || loan.start_date || '').toLocaleDateString() : 
                    'Invalid Date'}
                </span>
              </div>
              {(loan.dueDate || loan.due_date || loan.endDate || loan.end_date) && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Due Date:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(loan.dueDate || loan.due_date || loan.endDate || loan.end_date || '').toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                  loan.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                  loan.status === 'paid' || loan.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {loan.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{((loan.totalAmount || loan.total_amount) || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">₹{((loan.paidAmount || loan.paid_amount) || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">₹{((loan.remainingAmount || loan.pending_amount) || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No loans</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedVillage ? 
              `No loans found in the selected village. Total loans: ${loans.length}` : 
              'Get started by creating a new loan.'
            }
          </p>
          <div className="mt-6">
            <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateLoan}>
              Add Loan
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLoan ? 'Edit Loan' : 'Add New Loan'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Village
              </label>
              <select
                {...register('village_id', { required: 'Village is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!editingLoan}
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
                Customer
              </label>
              <select
                {...register('customer_id', { required: 'Customer is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!watchedVillageId || !!editingLoan}
              >
                <option value="">
                  {!watchedVillageId ? 'Select Village First' : 
                   filteredCustomers.length === 0 ? 'No customers in this village' : 
                   'Select Customer'}
                </option>
                {filteredCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_id.message}</p>
              )}
              {watchedVillageId && filteredCustomers.length === 0 && !editingLoan && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    No customers found in this village. Please add customers first.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Principal Amount (₹)
              </label>
              <input
                {...register('principal_amount', { 
                  required: 'Principal amount is required',
                  min: { value: 1, message: 'Amount must be greater than 0' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter principal amount"
                disabled={!!editingLoan}
              />
              {errors.principal_amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.principal_amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (%)
              </label>
              <input
                {...register('interest_rate', { 
                  required: 'Interest rate is required',
                  min: { value: 0, message: 'Interest rate must be 0 or greater' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter interest rate"
              />
              {errors.interest_rate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.interest_rate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Period (Months)
              </label>
              <input
                {...register('loan_period_months', { 
                  required: 'Loan period is required',
                  min: { value: 1, message: 'Loan period must be at least 1 month' }
                })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter loan period in months"
              />
              {errors.loan_period_months && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.loan_period_months.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                {...register('start_date', { required: 'Start date is required' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!editingLoan}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              {...register('due_date', { required: 'Due date is required' })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!editingLoan}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Due date will be automatically calculated based on start date and loan period
            </p>
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
              {editingLoan ? 'Update' : 'Create'} Loan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Loans;