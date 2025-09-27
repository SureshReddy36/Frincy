// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '../types';
// import { authAPI } from '../services/api';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');

//       if (token && userData) {
//         try {
//           const user = JSON.parse(userData);
//           setUser(user);
//         } catch (error) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//         }
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await authAPI.login(email, password);
//       localStorage.setItem('token', response.access_token);
//       localStorage.setItem('user', JSON.stringify(response.user));
//       setUser(response.user);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (name: string, email: string, password: string) => {
//     try {
//       const response = await authAPI.register(name, email, password);
//       localStorage.setItem('token', response.access_token);
//       localStorage.setItem('user', JSON.stringify(response.user));
//       setUser(response.user);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     register,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '../types';
// import { authAPI } from '../services/api';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');

//       if (token && userData) {
//         try {
//           const user = JSON.parse(userData);
//           setUser(user);
//         } catch (error) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//         }
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await authAPI.login(email, password);
//       localStorage.setItem('token', response.access_token || response.token);
//       localStorage.setItem('user', JSON.stringify(response.user));
//       setUser(response.user);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (name: string, email: string, password: string) => {
//     try {
//       const response = await authAPI.register(name, email, password);
//       localStorage.setItem('token', response.access_token || response.token);
//       localStorage.setItem('user', JSON.stringify(response.user));
//       setUser(response.user);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     register,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          // Optionally refresh user data from server
          await refreshUser();
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.access_token || response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      localStorage.setItem('token', response.access_token || response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getProfile();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on refresh failure, just log the error
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};