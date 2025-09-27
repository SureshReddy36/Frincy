// import React, { useEffect, useState } from 'react';
// import { 
//   MapPin, 
//   Users, 
//   CreditCard, 
//   DollarSign, 
//   TrendingUp,
//   TrendingDown,
//   Activity
// } from 'lucide-react';
// import Card from '../components/UI/Card';
// import { dashboardAPI } from '../services/api';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// interface DashboardStats {
//   total_villages: number;
//   total_customers: number;
//   total_loans: number;
//   total_amount: number;
//   total_paid: number;
//   total_pending: number;
// }

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await dashboardAPI.getStats();
//         setStats(data);
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const statCards = [
//     {
//       title: 'Total Villages',
//       value: stats?.total_villages || 0,
//       icon: MapPin,
//       gradient: 'from-blue-500 to-purple-600',
//       change: '+12%',
//       trend: 'up'
//     },
//     {
//       title: 'Active Customers',
//       value: stats?.total_customers || 0,
//       icon: Users,
//       gradient: 'from-emerald-500 to-green-600',
//       change: '+8%',
//       trend: 'up'
//     },
//     {
//       title: 'Active Loans',
//       value: stats?.total_loans || 0,
//       icon: CreditCard,
//       gradient: 'from-orange-500 to-red-600',
//       change: '+15%',
//       trend: 'up'
//     },
//     {
//       title: 'Total Amount',
//       value: `₹${(stats?.total_amount || 0).toLocaleString()}`,
//       icon: DollarSign,
//       gradient: 'from-purple-500 to-pink-600',
//       change: '+25%',
//       trend: 'up'
//     }
//   ];

//   const chartData = [
//     { name: 'Jan', loans: 400, payments: 240 },
//     { name: 'Feb', loans: 300, payments: 139 },
//     { name: 'Mar', loans: 200, payments: 980 },
//     { name: 'Apr', loans: 278, payments: 390 },
//     { name: 'May', loans: 189, payments: 480 },
//     { name: 'Jun', loans: 239, payments: 380 },
//   ];

//   const pieData = [
//     { name: 'Paid', value: stats?.total_paid || 0, color: '#10B981' },
//     { name: 'Pending', value: stats?.total_pending || 0, color: '#F59E0B' },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => {
//           const Icon = stat.icon;
//           const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
//           return (
//             <Card key={index} hover className="relative overflow-hidden">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                   <div className="flex items-center mt-2 text-sm">
//                     <TrendIcon className="h-4 w-4 text-green-500 mr-1" />
//                     <span className="text-green-600 font-medium">{stat.change}</span>
//                     <span className="text-gray-500 ml-1">from last month</span>
//                   </div>
//                 </div>
//                 <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
//                   <Icon className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Bar Chart */}
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Loans vs Payments Overview</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="loans" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="payments" fill="#10B981" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* Pie Chart */}
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex justify-center space-x-6 mt-4">
//             {pieData.map((item, index) => (
//               <div key={index} className="flex items-center">
//                 <div 
//                   className="w-3 h-3 rounded-full mr-2"
//                   style={{ backgroundColor: item.color }}
//                 />
//                 <span className="text-sm text-gray-600">{item.name}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import Card from '../components/UI/Card';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  total_villages: number;
  total_customers: number;
  total_loans: number;
  total_amount: number;
  total_paid: number;
  total_pending: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Villages',
      value: stats?.total_villages || 0,
      icon: MapPin,
      gradient: 'from-blue-500 to-purple-600',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      gradient: 'from-emerald-500 to-green-600',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Active Loans',
      value: stats?.total_loans || 0,
      icon: CreditCard,
      gradient: 'from-orange-500 to-red-600',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Total Amount',
      value: `₹${(stats?.total_amount || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-600',
      change: '+25%',
      trend: 'up'
    }
  ];

  const chartData = [
    { name: 'Jan', loans: 400, payments: 240 },
    { name: 'Feb', loans: 300, payments: 139 },
    { name: 'Mar', loans: 200, payments: 980 },
    { name: 'Apr', loans: 278, payments: 390 },
    { name: 'May', loans: 189, payments: 480 },
    { name: 'Jun', loans: 239, payments: 380 },
  ];

  const pieData = [
    { name: 'Paid', value: stats?.total_paid || 0, color: '#10B981' },
    { name: 'Pending', value: stats?.total_pending || 0, color: '#F59E0B' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Loans vs Payments Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Bar dataKey="loans" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payments" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.total_amount ? ((stats.total_paid / stats.total_amount) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Loan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{stats?.total_loans ? Math.round(stats.total_amount / stats.total_loans).toLocaleString() : 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{(stats?.total_pending || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;