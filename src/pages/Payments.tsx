
// import React, { useState, useEffect } from 'react';
// import { Plus, DollarSign, Users, CreditCard, Calendar, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Payment, Loan, Customer } from '../types';
// import { paymentsAPI, loansAPI, customersAPI } from '../services/api';

// interface PaymentForm {
//   loan_id: string;
//   customer_id: string;
//   amount: number;
//   payment_date: string;
//   payment_method: string;
//   reference_number?: string;
//   notes?: string;
// }

// const Payments: React.FC = () => {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PaymentForm>();
//   const watchedCustomerId = watch('customer_id');
//   const watchedLoanId = watch('loan_id');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // When customer changes, filter loans and reset loan selection
//   useEffect(() => {
//     if (watchedCustomerId && !editingPayment) {
//       setValue('loan_id', '');
//     }
//   }, [watchedCustomerId, setValue, editingPayment]);

//   // When loan changes, auto-select the customer
//   useEffect(() => {
//     if (watchedLoanId && !editingPayment) {
//       const selectedLoan = loans.find(l => l.id === watchedLoanId);
//       if (selectedLoan && selectedLoan.customerId) {
//         setValue('customer_id', selectedLoan.customerId);
//       }
//     }
//   }, [watchedLoanId, loans, setValue, editingPayment]);

//   const fetchData = async () => {
//     try {
//       setError('');
//       const [paymentsData, loansData, customersData] = await Promise.all([
//         paymentsAPI.getAll(),
//         loansAPI.getAll(),
//         customersAPI.getAll()
//       ]);
//       setPayments(paymentsData);
//       setLoans(loansData);
//       setCustomers(customersData);
//     } catch (error: any) {
//       console.error('Failed to fetch data:', error);
//       setError('Failed to load data. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePayment = () => {
//     setEditingPayment(null);
//     reset({
//       customer_id: '',
//       loan_id: '',
//       amount: 0,
//       payment_date: new Date().toISOString().split('T')[0],
//       payment_method: '',
//       reference_number: '',
//       notes: ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditPayment = (payment: Payment) => {
//     setEditingPayment(payment);
//     reset({
//       loan_id: payment.loanId || payment.loan_id || '',
//       customer_id: payment.customerId || payment.customer_id || '',
//       amount: payment.amount,
//       payment_date: payment.date || payment.paymentDate || payment.payment_date || '',
//       payment_method: payment.method || payment.paymentMethod || payment.payment_method || '',
//       reference_number: payment.reference || payment.reference_number || '',
//       notes: payment.notes || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeletePayment = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this payment?')) return;

//     try {
//       await paymentsAPI.delete(id);
//       setPayments(payments.filter(p => p.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete payment:', error);
//       alert('Failed to delete payment: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: PaymentForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingPayment) {
//         const updated = await paymentsAPI.update(editingPayment.id, data);
//         setPayments(payments.map(p => p.id === editingPayment.id ? updated : p));
//       } else {
//         const created = await paymentsAPI.create(data);
//         setPayments([...payments, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save payment:', error);
//       alert('Failed to save payment: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Filter loans based on selected customer (only active loans)
//   const filteredLoans = watchedCustomerId 
//     ? loans.filter(l => {
//         const loanCustomerId = String(l.customerId || l.customer_id);
//         const selectedCustomerId = String(watchedCustomerId);
//         return loanCustomerId === selectedCustomerId && l.status === 'active';
//       })
//     : loans.filter(l => l.status === 'active');

//   // Filter customers based on selected loan
//   const filteredCustomers = watchedLoanId && !watchedCustomerId
//     ? customers.filter(c => {
//         const selectedLoan = loans.find(l => l.id === watchedLoanId);
//         return selectedLoan && String(c.id) === String(selectedLoan.customerId || selectedLoan.customer_id);
//       })
//     : customers;

//   const filteredPayments = selectedCustomer 
//     ? payments.filter(p => String(p.customerId || p.customer_id) === String(selectedCustomer))
//     : payments;

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
//           <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
//           <p className="text-gray-600">Track and manage loan payments</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreatePayment}>
//           Add Payment
//         </Button>
//       </div>

//       {/* Filter by Customer */}
//       <div className="flex space-x-4">
//         <select
//           value={selectedCustomer}
//           onChange={(e) => setSelectedCustomer(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Customers</option>
//           {customers.map((customer) => (
//             <option key={customer.id} value={customer.id}>
//               {customer.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredPayments.map((payment) => (
//           <Card key={payment.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
//                   <DollarSign className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</h3>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <Users className="h-3 w-3 mr-1" />
//                     {payment.customerName || 'Unknown Customer'}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditPayment(payment)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeletePayment(payment.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Payment Method:</span>
//                 <span className="text-sm font-medium capitalize">
//                   {(payment.method || payment.paymentMethod || payment.payment_method || '').replace('_', ' ')}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Date:</span>
//                 <span className="text-sm font-medium">
//                   {new Date(payment.date || payment.paymentDate || payment.payment_date || '').toLocaleDateString()}
//                 </span>
//               </div>
//               {(payment.reference || payment.reference_number) && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Reference:</span>
//                   <span className="text-sm font-medium">{payment.reference || payment.reference_number}</span>
//                 </div>
//               )}
//             </div>

//             {payment.notes && (
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <p className="text-sm text-gray-600">{payment.notes}</p>
//               </div>
//             )}
//           </Card>
//         ))}
//       </div>

//       {filteredPayments.length === 0 && (
//         <div className="text-center py-12">
//           <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No payments</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {selectedCustomer ? 'No payments found for the selected customer.' : 'Get started by recording a new payment.'}
//           </p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreatePayment}>
//               Add Payment
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
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

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Loan
//               </label>
//               <select
//                 {...register('loan_id', { required: 'Loan is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">
//                   {!watchedCustomerId && !watchedLoanId ? 'Select Customer or Loan' : 'Select Loan'}
//                 </option>
//                 {filteredLoans.map((loan) => (
//                   <option key={loan.id} value={loan.id}>
//                     ₹{(loan.amount || loan.principal_amount || 0).toLocaleString()} - {loan.customerName || 'Unknown Customer'}
//                   </option>
//                 ))}
//               </select>
//               {errors.loan_id && (
//                 <p className="mt-1 text-sm text-red-600">{errors.loan_id.message}</p>
//               )}
//               {watchedCustomerId && filteredLoans.length === 0 && (
//                 <p className="mt-1 text-sm text-yellow-600">
//                   No active loans found for this customer.
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Amount (₹)
//               </label>
//               <input
//                 {...register('amount', { 
//                   required: 'Payment amount is required',
//                   min: { value: 1, message: 'Amount must be greater than 0' }
//                 })}
//                 type="number"
//                 step="0.01"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter payment amount"
//               />
//               {errors.amount && (
//                 <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Date
//               </label>
//               <input
//                 {...register('payment_date', { required: 'Payment date is required' })}
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.payment_date && (
//                 <p className="mt-1 text-sm text-red-600">{errors.payment_date.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Method
//               </label>
//               <select
//                 {...register('payment_method', { required: 'Payment method is required' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Method</option>
//                 <option value="cash">Cash</option>
//                 <option value="bank_transfer">Bank Transfer</option>
//                 <option value="cheque">Cheque</option>
//                 <option value="digital">Digital Payment</option>
//               </select>
//               {errors.payment_method && (
//                 <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reference Number (Optional)
//               </label>
//               <input
//                 {...register('reference_number')}
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter reference number"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes (Optional)
//             </label>
//             <textarea
//               {...register('notes')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter any additional notes"
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
//               {editingPayment ? 'Update' : 'Create'} Payment
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Payments;

import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Users, Edit, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useForm } from 'react-hook-form';
import { Payment, Loan, Customer, Village } from '../types';
import { paymentsAPI, loansAPI, customersAPI, villagesAPI } from '../services/api';

interface PaymentForm {
  loan_id: string;
  customer_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PaymentForm>();
  const watchedCustomerId = watch('customer_id');
  const watchedLoanId = watch('loan_id');

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-select customer when loan is selected
  useEffect(() => {
    if (watchedLoanId && !editingPayment) {
      const selectedLoan = loans.find(l => l.id === watchedLoanId);
      if (selectedLoan) {
        const customerId = selectedLoan.customerId || selectedLoan.customer_id;
        console.log('Auto-selecting customer for loan:', watchedLoanId, 'Customer ID:', customerId);
        if (customerId && customerId !== watchedCustomerId) {
          setValue('customer_id', customerId);
        }
      }
    }
  }, [watchedLoanId, loans, setValue, watchedCustomerId, editingPayment]);

  // Auto-select loan when customer is selected (if only one active loan)
  useEffect(() => {
    if (watchedCustomerId && !editingPayment && !watchedLoanId) {
      const customerLoans = loans.filter(l => {
        const loanCustomerId = l.customerId || l.customer_id;
        return loanCustomerId === watchedCustomerId && l.status === 'active';
      });
      console.log('Customer loans for', watchedCustomerId, ':', customerLoans);
      if (customerLoans.length === 1) {
        setValue('loan_id', customerLoans[0].id);
      }
    }
  }, [watchedCustomerId, loans, setValue, editingPayment, watchedLoanId]);

  const fetchData = async () => {
    try {
      setError('');
      const [paymentsData, loansData, customersData, villagesData] = await Promise.all([
        paymentsAPI.getAll(),
        loansAPI.getAll(),
        customersAPI.getAll(),
        villagesAPI.getAll()
      ]);
      setPayments(paymentsData);
      setLoans(loansData);
      setCustomers(customersData);
      setVillages(villagesData);
      
      console.log('Fetched data:', {
        payments: paymentsData.length,
        loans: loansData.length,
        customers: customersData.length,
        villages: villagesData.length
      });
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = () => {
    setEditingPayment(null);
    reset({
      customer_id: '',
      loan_id: '',
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      reference_number: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    reset({
      loan_id: payment.loanId || payment.loan_id || '',
      customer_id: payment.customerId || payment.customer_id || '',
      amount: payment.amount,
      payment_date: payment.date || payment.payment_date || payment.paymentDate,
      payment_method: payment.method || payment.payment_method || payment.paymentMethod,
      reference_number: payment.reference || payment.reference_number || '',
      notes: payment.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      await paymentsAPI.delete(id);
      setPayments(payments.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Failed to delete payment:', error);
      alert('Failed to delete payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const checkAndUpdateLoanStatus = async (loanId: string, paymentAmount: number) => {
    try {
      // Find the loan
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      // Calculate new paid amount
      const currentPaidAmount = loan.paidAmount || loan.paid_amount || 0;
      const totalAmount = loan.totalAmount || loan.total_amount || loan.amount || 0;
      const newPaidAmount = currentPaidAmount + paymentAmount;

      console.log('Loan status check:', {
        loanId,
        currentPaidAmount,
        totalAmount,
        paymentAmount,
        newPaidAmount
      });

      // If payment equals or exceeds remaining amount, mark loan as completed
      if (newPaidAmount >= totalAmount) {
        console.log('Marking loan as completed');
        await loansAPI.update(loanId, { 
          status: 'completed'
        });

        // Update local state
        setLoans(prevLoans => 
          prevLoans.map(l => 
            l.id === loanId 
              ? { 
                  ...l, 
                  status: 'completed', 
                  paidAmount: totalAmount,
                  paid_amount: totalAmount,
                  remainingAmount: 0,
                  pending_amount: 0
                }
              : l
          )
        );

        // Show success message
        alert('🎉 Loan has been fully paid and marked as completed!');
      }
    } catch (error) {
      console.error('Failed to update loan status:', error);
      // Don't throw error here as payment was successful
    }
  };

  const onSubmit = async (data: PaymentForm) => {
    setIsSubmitting(true);
    try {
      // Validate payment amount doesn't exceed remaining loan amount
      if (!editingPayment) {
        const selectedLoan = loans.find(l => l.id === data.loan_id);
        if (selectedLoan) {
          const remainingAmount = selectedLoan.remainingAmount || selectedLoan.pending_amount || 0;
          if (data.amount > remainingAmount) {
            alert(`Payment amount (₹${data.amount.toLocaleString()}) cannot exceed remaining loan amount (₹${remainingAmount.toLocaleString()})`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (editingPayment) {
        const updated = await paymentsAPI.update(editingPayment.id, data);
        setPayments(payments.map(p => p.id === editingPayment.id ? updated : p));
      } else {
        const created = await paymentsAPI.create(data);
        setPayments([...payments, created]);
        
        // Check if loan should be marked as completed
        await checkAndUpdateLoanStatus(data.loan_id, data.amount);
      }

      setIsModalOpen(false);
      reset();
      
      // Refresh data to get updated loan status
      await fetchData();
    } catch (error: any) {
      console.error('Failed to save payment:', error);
      alert('Failed to save payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter loans based on selected customer (only active loans for new payments)
  const filteredLoans = watchedCustomerId 
    ? loans.filter(l => {
        const loanCustomerId = l.customerId || l.customer_id;
        const isCustomerMatch = loanCustomerId === watchedCustomerId;
        const isActive = editingPayment ? true : l.status === 'active'; // Allow all loans for editing
        console.log('Filtering loan:', l.id, 'Customer ID:', loanCustomerId, 'Match:', isCustomerMatch, 'Active:', isActive);
        return isCustomerMatch && isActive;
      })
    : loans.filter(l => editingPayment ? true : l.status === 'active');

  // Filter payments by customer and village
  let filteredPayments = payments;

  if (selectedCustomer) {
    filteredPayments = filteredPayments.filter(p => (p.customerId || p.customer_id) === selectedCustomer);
  }

  if (selectedVillage) {
    filteredPayments = filteredPayments.filter(p => {
      // Find the loan for this payment to get village info
      const paymentLoan = loans.find(l => l.id === (p.loanId || p.loan_id));
      if (paymentLoan) {
        const loanVillageId = String(paymentLoan.villageId || paymentLoan.village_id || '');
        return loanVillageId === String(selectedVillage);
      }
      return false;
    });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage loan payments</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreatePayment}>
          Add Payment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Villages ({payments.length} payments)</option>
          {villages.map((village) => {
            const villagePayments = payments.filter(p => {
              const paymentLoan = loans.find(l => l.id === (p.loanId || p.loan_id));
              if (paymentLoan) {
                const loanVillageId = String(paymentLoan.villageId || paymentLoan.village_id || '');
                return loanVillageId === String(village.id);
              }
              return false;
            });
            return (
              <option key={village.id} value={village.id}>
                {village.name} ({villagePayments.length} payments)
              </option>
            );
          })}
        </select>

        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Customers</option>
          {customers.map((customer) => {
            const customerPayments = payments.filter(p => (p.customerId || p.customer_id) === customer.id);
            return (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customerPayments.length} payments)
              </option>
            );
          })}
        </select>

        {/* Filter summary */}
        {(selectedVillage || selectedCustomer) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} hover className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">₹{payment.amount.toLocaleString()}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {payment.customerName || 
                     customers.find(c => c.id === (payment.customerId || payment.customer_id))?.name || 
                     'Unknown Customer'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPayment(payment)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePayment(payment.id)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {(payment.method || payment.payment_method || payment.paymentMethod || '').replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Date(payment.date || payment.payment_date || payment.paymentDate).toLocaleDateString()}
                </span>
              </div>
              {(payment.reference || payment.reference_number) && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reference:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.reference || payment.reference_number}</span>
                </div>
              )}
              {/* Show village info */}
              {(() => {
                const paymentLoan = loans.find(l => l.id === (payment.loanId || payment.loan_id));
                const villageName = paymentLoan?.villageName || 
                                  villages.find(v => v.id === (paymentLoan?.villageId || paymentLoan?.village_id))?.name;
                return villageName ? (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Village:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{villageName}</span>
                  </div>
                ) : null;
              })()}
            </div>

            {payment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">{payment.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No payments</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedCustomer || selectedVillage ? 
              'No payments found for the selected filters.' : 
              'Get started by recording a new payment.'
            }
          </p>
          <div className="mt-6">
            <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreatePayment}>
              Add Payment
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan
              </label>
              <select
                {...register('loan_id', { required: 'Loan is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Loan</option>
                {loans.filter(l => editingPayment ? true : l.status === 'active').map((loan) => {
                  const amount = loan.amount || loan.principal_amount || 0;
                  const customerName = loan.customerName || customers.find(c => c.id === (loan.customerId || loan.customer_id))?.name || 'Unknown Customer';
                  const remainingAmount = loan.remainingAmount || loan.pending_amount || 0;
                  const status = loan.status || 'unknown';
                  
                  return (
                    <option key={loan.id} value={loan.id}>
                      ₹{amount.toLocaleString()} - {customerName} 
                      {!editingPayment && ` (Remaining: ₹${remainingAmount.toLocaleString()})`}
                      {status !== 'active' && ` [${status.toUpperCase()}]`}
                    </option>
                  );
                })}
              </select>
              {errors.loan_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.loan_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer
              </label>
              <select
                {...register('customer_id', { required: 'Customer is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!watchedLoanId} // Disable when loan is selected
              >
                <option value="">
                  {watchedLoanId ? 'Auto-selected from loan' : 'Select Customer'}
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_id.message}</p>
              )}
              {watchedLoanId && (
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Customer is automatically selected based on the chosen loan
                </p>
              )}
            </div>
          </div>

          {/* Show loan details when loan is selected */}
          {watchedLoanId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              {(() => {
                const selectedLoan = loans.find(l => l.id === watchedLoanId);
                if (!selectedLoan) return null;
                
                const totalAmount = selectedLoan.totalAmount || selectedLoan.total_amount || selectedLoan.amount || 0;
                const paidAmount = selectedLoan.paidAmount || selectedLoan.paid_amount || 0;
                const remainingAmount = selectedLoan.remainingAmount || selectedLoan.pending_amount || (totalAmount - paidAmount);
                
                return (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">₹{totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Total Amount</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">₹{paidAmount.toLocaleString()}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Paid Amount</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-400">₹{remainingAmount.toLocaleString()}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">Remaining Amount</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Amount (₹)
              </label>
              <input
                {...register('amount', { 
                  required: 'Payment amount is required',
                  min: { value: 1, message: 'Amount must be greater than 0' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payment amount"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Date
              </label>
              <input
                {...register('payment_date', { required: 'Payment date is required' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.payment_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                {...register('payment_method', { required: 'Payment method is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="digital">Digital Payment</option>
              </select>
              {errors.payment_method && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_method.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reference Number (Optional)
              </label>
              <input
                {...register('reference_number')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reference number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes"
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
              {editingPayment ? 'Update' : 'Create'} Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;