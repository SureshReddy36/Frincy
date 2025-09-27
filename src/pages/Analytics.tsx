// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   PieChart, 
//   Pie, 
//   Cell, 
//   LineChart, 
//   Line,
//   AreaChart,
//   Area
// } from 'recharts';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   DollarSign, 
//   Users, 
//   CreditCard, 
//   MapPin,
//   Calendar,
//   Target,
//   AlertTriangle,
//   CheckCircle
// } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import { dashboardAPI, villagesAPI, customersAPI, loansAPI, paymentsAPI } from '../services/api';

// interface AnalyticsData {
//   totalVillages: number;
//   totalCustomers: number;
//   totalLoans: number;
//   totalAmount: number;
//   totalPaid: number;
//   totalPending: number;
//   monthlyData: Array<{
//     month: string;
//     loans: number;
//     payments: number;
//     amount: number;
//   }>;
//   villageData: Array<{
//     name: string;
//     customers: number;
//     loans: number;
//     amount: number;
//   }>;
//   loanStatusData: Array<{
//     name: string;
//     value: number;
//     color: string;
//   }>;
//   paymentMethodData: Array<{
//     name: string;
//     value: number;
//     color: string;
//   }>;
// }

// const Analytics: React.FC = () => {
//   const [data, setData] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState('6months');
//   const [selectedMetric, setSelectedMetric] = useState('amount');

//   useEffect(() => {
//     fetchAnalyticsData();
//   }, [dateRange]);

//   const fetchAnalyticsData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all data
//       const [stats, villages, customers, loans, payments] = await Promise.all([
//         dashboardAPI.getStats(),
//         villagesAPI.getAll(),
//         customersAPI.getAll(),
//         loansAPI.getAll(),
//         paymentsAPI.getAll()
//       ]);

//       // Process monthly data
//       const monthlyData = generateMonthlyData(loans, payments);
      
//       // Process village data
//       const villageData = villages.map(village => {
//         const villageCustomers = customers.filter(c => 
//           String(c.villageId || c.village_id) === String(village.id)
//         );
//         const villageLoans = loans.filter(l => 
//           String(l.villageId || l.village_id) === String(village.id)
//         );
//         const totalAmount = villageLoans.reduce((sum, loan) => 
//           sum + (loan.amount || loan.principal_amount || 0), 0
//         );

//         return {
//           name: village.name,
//           customers: villageCustomers.length,
//           loans: villageLoans.length,
//           amount: totalAmount
//         };
//       });

//       // Process loan status data
//       const loanStatusCounts = loans.reduce((acc, loan) => {
//         const status = loan.status || 'unknown';
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {} as Record<string, number>);

//       const loanStatusData = Object.entries(loanStatusCounts).map(([status, count], index) => ({
//         name: status.charAt(0).toUpperCase() + status.slice(1),
//         value: count,
//         color: getStatusColor(status, index)
//       }));

//       // Process payment method data
//       const paymentMethodCounts = payments.reduce((acc, payment) => {
//         const method = payment.method || payment.payment_method || payment.paymentMethod || 'unknown';
//         acc[method] = (acc[method] || 0) + 1;
//         return acc;
//       }, {} as Record<string, number>);

//       const paymentMethodData = Object.entries(paymentMethodCounts).map(([method, count], index) => ({
//         name: method.replace('_', ' ').charAt(0).toUpperCase() + method.replace('_', ' ').slice(1),
//         value: count,
//         color: getMethodColor(method, index)
//       }));

//       setData({
//         totalVillages: stats.total_villages,
//         totalCustomers: stats.total_customers,
//         totalLoans: stats.total_loans,
//         totalAmount: stats.total_amount,
//         totalPaid: stats.total_paid,
//         totalPending: stats.total_pending,
//         monthlyData,
//         villageData,
//         loanStatusData,
//         paymentMethodData
//       });
//     } catch (error) {
//       console.error('Failed to fetch analytics data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateMonthlyData = (loans: any[], payments: any[]) => {
//     const months = [];
//     const now = new Date();
//     const monthCount = dateRange === '12months' ? 12 : 6;

//     for (let i = monthCount - 1; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
//       const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

//       const monthLoans = loans.filter(loan => {
//         const loanDate = loan.startDate || loan.start_date || loan.createdAt;
//         return loanDate && loanDate.startsWith(monthKey);
//       });

//       const monthPayments = payments.filter(payment => {
//         const paymentDate = payment.date || payment.payment_date || payment.paymentDate || payment.createdAt;
//         return paymentDate && paymentDate.startsWith(monthKey);
//       });

//       const totalAmount = monthLoans.reduce((sum, loan) => 
//         sum + (loan.amount || loan.principal_amount || 0), 0
//       );

//       months.push({
//         month: monthName,
//         loans: monthLoans.length,
//         payments: monthPayments.length,
//         amount: totalAmount
//       });
//     }

//     return months;
//   };

//   const getStatusColor = (status: string, index: number) => {
//     const colors = {
//       active: '#10B981',
//       completed: '#3B82F6',
//       pending: '#F59E0B',
//       defaulted: '#EF4444',
//       paid: '#06B6D4'
//     };
//     return colors[status as keyof typeof colors] || `hsl(${index * 60}, 70%, 50%)`;
//   };

//   const getMethodColor = (method: string, index: number) => {
//     const colors = {
//       cash: '#10B981',
//       bank_transfer: '#3B82F6',
//       cheque: '#F59E0B',
//       digital: '#8B5CF6'
//     };
//     return colors[method as keyof typeof colors] || `hsl(${index * 90}, 70%, 50%)`;
//   };

//   const calculateGrowthRate = (current: number, previous: number) => {
//     if (previous === 0) return 0;
//     return ((current - previous) / previous) * 100;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold">Failed to Load Analytics</p>
//           <p className="text-sm">Please try again later</p>
//         </div>
//         <Button onClick={fetchAnalyticsData}>Retry</Button>
//       </div>
//     );
//   }

//   const collectionRate = data.totalAmount > 0 ? (data.totalPaid / data.totalAmount) * 100 : 0;
//   const avgLoanSize = data.totalLoans > 0 ? data.totalAmount / data.totalLoans : 0;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
//           <p className="text-gray-600">Comprehensive insights into your loan management system</p>
//         </div>
//         <div className="flex space-x-3">
//           <select
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="6months">Last 6 Months</option>
//             <option value="12months">Last 12 Months</option>
//           </select>
//           <Button onClick={fetchAnalyticsData}>Refresh Data</Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="relative overflow-hidden">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Collection Rate</p>
//               <p className="text-2xl font-bold text-gray-900">{collectionRate.toFixed(1)}%</p>
//               <div className="flex items-center mt-2 text-sm">
//                 {collectionRate >= 80 ? (
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
//                 ) : (
//                   <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
//                 )}
//                 <span className={collectionRate >= 80 ? 'text-green-600' : 'text-yellow-600'}>
//                   {collectionRate >= 80 ? 'Excellent' : 'Needs Attention'}
//                 </span>
//               </div>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
//               <Target className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="relative overflow-hidden">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Avg Loan Size</p>
//               <p className="text-2xl font-bold text-gray-900">₹{avgLoanSize.toLocaleString()}</p>
//               <div className="flex items-center mt-2 text-sm">
//                 <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
//                 <span className="text-blue-600">Per customer</span>
//               </div>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//               <DollarSign className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="relative overflow-hidden">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Loans</p>
//               <p className="text-2xl font-bold text-gray-900">{data.totalLoans}</p>
//               <div className="flex items-center mt-2 text-sm">
//                 <CreditCard className="h-4 w-4 text-orange-500 mr-1" />
//                 <span className="text-orange-600">Total portfolio</span>
//               </div>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
//               <CreditCard className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="relative overflow-hidden">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Villages Served</p>
//               <p className="text-2xl font-bold text-gray-900">{data.totalVillages}</p>
//               <div className="flex items-center mt-2 text-sm">
//                 <MapPin className="h-4 w-4 text-purple-500 mr-1" />
//                 <span className="text-purple-600">Geographic reach</span>
//               </div>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
//               <MapPin className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Monthly Trends */}
//         <Card>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
//             <select
//               value={selectedMetric}
//               onChange={(e) => setSelectedMetric(e.target.value)}
//               className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="amount">Loan Amount</option>
//               <option value="loans">Number of Loans</option>
//               <option value="payments">Number of Payments</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={data.monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip 
//                 formatter={(value, name) => [
//                   selectedMetric === 'amount' ? `₹${Number(value).toLocaleString()}` : value,
//                   name === selectedMetric ? 
//                     (selectedMetric === 'amount' ? 'Amount' : 
//                      selectedMetric === 'loans' ? 'Loans' : 'Payments') : name
//                 ]}
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey={selectedMetric} 
//                 stroke="#3B82F6" 
//                 fill="#3B82F6" 
//                 fillOpacity={0.3}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* Loan Status Distribution */}
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Status Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={data.loanStatusData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {data.loanStatusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex flex-wrap justify-center gap-4 mt-4">
//             {data.loanStatusData.map((item, index) => (
//               <div key={index} className="flex items-center">
//                 <div 
//                   className="w-3 h-3 rounded-full mr-2"
//                   style={{ backgroundColor: item.color }}
//                 />
//                 <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Village Performance */}
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Village Performance</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data.villageData.slice(0, 8)} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="name" type="category" width={80} />
//               <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total Amount']} />
//               <Bar dataKey="amount" fill="#10B981" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* Payment Methods */}
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={data.paymentMethodData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 dataKey="value"
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//               >
//                 {data.paymentMethodData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* Summary Table */}
//       <Card>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Village Summary</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Village
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customers
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Loans
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Avg Loan Size
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data.villageData.map((village, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {village.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {village.customers}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {village.loans}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ₹{village.amount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ₹{village.loans > 0 ? (village.amount / village.loans).toLocaleString() : '0'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Analytics;

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard, 
  MapPin,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { dashboardAPI, villagesAPI, customersAPI, loansAPI, paymentsAPI } from '../services/api';

interface AnalyticsData {
  totalVillages: number;
  totalCustomers: number;
  totalLoans: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  monthlyData: Array<{
    month: string;
    loans: number;
    payments: number;
    amount: number;
  }>;
  villageData: Array<{
    name: string;
    customers: number;
    loans: number;
    amount: number;
  }>;
  loanStatusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  paymentMethodData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('amount');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [stats, villages, customers, loans, payments] = await Promise.all([
        dashboardAPI.getStats(),
        villagesAPI.getAll(),
        customersAPI.getAll(),
        loansAPI.getAll(),
        paymentsAPI.getAll()
      ]);

      // Process monthly data
      const monthlyData = generateMonthlyData(loans, payments);
      
      // Process village data
      const villageData = villages.map(village => {
        const villageCustomers = customers.filter(c => 
          String(c.villageId || c.village_id) === String(village.id)
        );
        const villageLoans = loans.filter(l => 
          String(l.villageId || l.village_id) === String(village.id)
        );
        const totalAmount = villageLoans.reduce((sum, loan) => 
          sum + (loan.amount || loan.principal_amount || 0), 0
        );

        return {
          name: village.name,
          customers: villageCustomers.length,
          loans: villageLoans.length,
          amount: totalAmount
        };
      });

      // Process loan status data
      const loanStatusCounts = loans.reduce((acc, loan) => {
        const status = loan.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const loanStatusData = Object.entries(loanStatusCounts).map(([status, count], index) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: getStatusColor(status, index)
      }));

      // Process payment method data
      const paymentMethodCounts = payments.reduce((acc, payment) => {
        const method = payment.method || payment.payment_method || payment.paymentMethod || 'unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const paymentMethodData = Object.entries(paymentMethodCounts).map(([method, count], index) => ({
        name: method.replace('_', ' ').charAt(0).toUpperCase() + method.replace('_', ' ').slice(1),
        value: count,
        color: getMethodColor(method, index)
      }));

      setData({
        totalVillages: stats.total_villages,
        totalCustomers: stats.total_customers,
        totalLoans: stats.total_loans,
        totalAmount: stats.total_amount,
        totalPaid: stats.total_paid,
        totalPending: stats.total_pending,
        monthlyData,
        villageData,
        loanStatusData,
        paymentMethodData
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (loans: any[], payments: any[]) => {
    const months = [];
    const now = new Date();
    const monthCount = dateRange === '12months' ? 12 : 6;

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      const monthLoans = loans.filter(loan => {
        const loanDate = loan.startDate || loan.start_date || loan.createdAt;
        return loanDate && loanDate.startsWith(monthKey);
      });

      const monthPayments = payments.filter(payment => {
        const paymentDate = payment.date || payment.payment_date || payment.paymentDate || payment.createdAt;
        return paymentDate && paymentDate.startsWith(monthKey);
      });

      const totalAmount = monthLoans.reduce((sum, loan) => 
        sum + (loan.amount || loan.principal_amount || 0), 0
      );

      months.push({
        month: monthName,
        loans: monthLoans.length,
        payments: monthPayments.length,
        amount: totalAmount
      });
    }

    return months;
  };

  const getStatusColor = (status: string, index: number) => {
    const colors = {
      active: '#10B981',
      completed: '#3B82F6',
      pending: '#F59E0B',
      defaulted: '#EF4444',
      paid: '#06B6D4'
    };
    return colors[status as keyof typeof colors] || `hsl(${index * 60}, 70%, 50%)`;
  };

  const getMethodColor = (method: string, index: number) => {
    const colors = {
      cash: '#10B981',
      bank_transfer: '#3B82F6',
      cheque: '#F59E0B',
      digital: '#8B5CF6'
    };
    return colors[method as keyof typeof colors] || `hsl(${index * 90}, 70%, 50%)`;
  };

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="text-lg font-semibold">Failed to Load Analytics</p>
          <p className="text-sm">Please try again later</p>
        </div>
        <Button onClick={fetchAnalyticsData}>Retry</Button>
      </div>
    );
  }

  const collectionRate = data.totalAmount > 0 ? (data.totalPaid / data.totalAmount) * 100 : 0;
  const avgLoanSize = data.totalLoans > 0 ? data.totalAmount / data.totalLoans : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your loan management system</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <Button onClick={fetchAnalyticsData}>Refresh Data</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{collectionRate.toFixed(1)}%</p>
              <div className="flex items-center mt-2 text-sm">
                {collectionRate >= 80 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                )}
                <span className={collectionRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                  {collectionRate >= 80 ? 'Excellent' : 'Needs Attention'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Loan Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{avgLoanSize.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600 dark:text-blue-400">Per customer</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.totalLoans}</p>
              <div className="flex items-center mt-2 text-sm">
                <CreditCard className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-orange-600 dark:text-orange-400">Total portfolio</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Villages Served</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.totalVillages}</p>
              <div className="flex items-center mt-2 text-sm">
                <MapPin className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-purple-600 dark:text-purple-400">Geographic reach</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="amount">Loan Amount</option>
              <option value="loans">Number of Loans</option>
              <option value="payments">Number of Payments</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                formatter={(value, name) => [
                  selectedMetric === 'amount' ? `₹${Number(value).toLocaleString()}` : value,
                  name === selectedMetric ? 
                    (selectedMetric === 'amount' ? 'Amount' : 
                     selectedMetric === 'loans' ? 'Loans' : 'Payments') : name
                ]}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Loan Status Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Loan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.loanStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.loanStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.loanStatusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Village Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.villageData.slice(0, 8)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total Amount']} 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Bar dataKey="amount" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.paymentMethodData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Village Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Village
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Loan Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.villageData.map((village, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {village.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {village.customers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {village.loans}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{village.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{village.loans > 0 ? (village.amount / village.loans).toLocaleString() : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;