// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { 
//   Home, 
//   MapPin, 
//   Users, 
//   CreditCard, 
//   DollarSign, 
//   BarChart3,
//   Settings,
//   LogOut
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: Home },
//   { name: 'Villages', href: '/villages', icon: MapPin },
//   { name: 'Customers', href: '/customers', icon: Users },
//   { name: 'Loans', href: '/loans', icon: CreditCard },
//   { name: 'Payments', href: '/payments', icon: DollarSign },
//   { name: 'Analytics', href: '/analytics', icon: BarChart3 },
//   { name: 'Settings', href: '/settings', icon: Settings },
// ];

// const Sidebar: React.FC = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   return (
//     <div className="flex h-full w-64 flex-col bg-white shadow-lg">
//       <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
//         <div className="flex items-center space-x-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//             <MapPin className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold text-gray-900">FRINCY</span>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 px-4 py-6">
//         {navigation.map((item) => {
//           const isActive = location.pathname === item.href;
//           const Icon = item.icon;
          
//           return (
//             <NavLink
//               key={item.name}
//               to={item.href}
//               className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
//                 isActive
//                   ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
//               {item.name}
//             </NavLink>
//           );
//         })}
//       </nav>

//       <div className="border-t border-gray-200 p-4">
//         <div className="flex items-center space-x-3 mb-4">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 text-sm font-medium text-white">
//             {user?.name?.charAt(0).toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
//             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={logout}
//           className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
//         >
//           <LogOut className="mr-3 h-5 w-5" />
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// // below is working
// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { 
//   Home, 
//   MapPin, 
//   Users, 
//   CreditCard, 
//   DollarSign, 
//   BarChart3,
//   Settings,
//   LogOut
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: Home },
//   { name: 'Villages', href: '/villages', icon: MapPin },
//   { name: 'Customers', href: '/customers', icon: Users },
//   { name: 'Loans', href: '/loans', icon: CreditCard },
//   { name: 'Payments', href: '/payments', icon: DollarSign },
//   { name: 'Analytics', href: '/analytics', icon: BarChart3 },
//   { name: 'Settings', href: '/settings', icon: Settings },
// ];

// const Sidebar: React.FC = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   return (
//     <div className="flex h-full w-64 flex-col bg-white shadow-lg">
//       <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
//         <div className="flex items-center space-x-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//             <MapPin className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold text-gray-900">FRINCY</span>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 px-4 py-6">
//         {navigation.map((item) => {
//           const isActive = location.pathname === item.href;
//           const Icon = item.icon;
          
//           return (
//             <NavLink
//               key={item.name}
//               to={item.href}
//               className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
//                 isActive
//                   ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
//               {item.name}
//             </NavLink>
//           );
//         })}
//       </nav>

//       <div className="border-t border-gray-200 p-4">
//         <div className="flex items-center space-x-3 mb-4">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 text-sm font-medium text-white">
//             {user?.name?.charAt(0).toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
//             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={logout}
//           className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
//         >
//           <LogOut className="mr-3 h-5 w-5" />
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Users, 
  CreditCard, 
  DollarSign, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Villages', href: '/villages', icon: MapPin },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Loans', href: '/loans', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">FRINCY</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 text-sm font-medium text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;