// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import Dashboard from '../../pages/Dashboard';
// import Villages from '../../pages/Villages';
// import Customers from '../../pages/Customers';
// import Loans from '../../pages/Loans';
// import Payments from '../../pages/Payments';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="h-screen flex overflow-hidden bg-gray-50">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 flex z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`${
//         sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//       } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
//         <Sidebar />
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-auto bg-gray-50 p-6">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/villages" element={<Villages />} />
//             <Route path="/customers" element={<Customers />} />
//             <Route path="/loans" element={<Loans />} />
//             <Route path="/payments" element={<Payments />} />
//             <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>} />
//             <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// // below is working
// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="h-screen flex overflow-hidden bg-gray-50">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 flex z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`${
//         sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//       } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
//         <Sidebar />
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-auto bg-gray-50 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;