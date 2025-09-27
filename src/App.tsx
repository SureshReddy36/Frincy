// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout/Layout';
// import Dashboard from './pages/Dashboard';
// import Villages from './pages/Villages';
// import Customers from './pages/Customers';
// import Loans from './pages/Loans';
// import Payments from './pages/Payments';
// import Login from './pages/Login';
// import Register from './pages/Register';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <Routes>
//                     <Route path="/" element={<Dashboard />} />
//                     <Route path="/villages" element={<Villages />} />
//                     <Route path="/customers" element={<Customers />} />
//                     <Route path="/loans" element={<Loans />} />
//                     <Route path="/payments" element={<Payments />} />
//                     <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>} />
//                     <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
//                   </Routes>
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout/Layout';
// import Dashboard from './pages/Dashboard';
// import Villages from './pages/Villages';
// import Customers from './pages/Customers';
// import Loans from './pages/Loans';
// import Payments from './pages/Payments';
// import Analytics from './pages/Analytics';
// import Settings from './pages/Settings';
// import Login from './pages/Login';
// import Register from './pages/Register';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <Routes>
//                     <Route path="/" element={<Dashboard />} />
//                     <Route path="/villages" element={<Villages />} />
//                     <Route path="/customers" element={<Customers />} />
//                     <Route path="/loans" element={<Loans />} />
//                     <Route path="/payments" element={<Payments />} />
//                     <Route path="/analytics" element={<Analytics />} />
//                     <Route path="/settings" element={<Settings />} />
//                   </Routes>
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// below is the working
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout/Layout';
// import Dashboard from './pages/Dashboard';
// import Villages from './pages/Villages';
// import Customers from './pages/Customers';
// import Loans from './pages/Loans';
// import Payments from './pages/Payments';
// import Analytics from './pages/Analytics';
// import Settings from './pages/Settings';
// import Login from './pages/Login';
// import Register from './pages/Register';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <Routes>
//                     <Route path="/" element={<Dashboard />} />
//                     <Route path="/villages" element={<Villages />} />
//                     <Route path="/customers" element={<Customers />} />
//                     <Route path="/loans" element={<Loans />} />
//                     <Route path="/payments" element={<Payments />} />
//                     <Route path="/analytics" element={<Analytics />} />
//                     <Route path="/settings" element={<Settings />} />
//                   </Routes>
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Villages from './pages/Villages';
import Customers from './pages/Customers';
import Loans from './pages/Loans';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/villages" element={<Villages />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/loans" element={<Loans />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;