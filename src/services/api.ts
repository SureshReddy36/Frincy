// import axios from 'axios';
// import { 
//   User, 
//   Village, 
//   Customer, 
//   Loan, 
//   Payment, 
//   AuthResponse, 
//   ApiResponse 
// } from '../types';

// const API_BASE_URL = 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   login: (email: string, password: string): Promise<AuthResponse> =>
//     api.post('/auth/login', { email, password }).then(res => res.data),
  
//   register: (name: string, email: string, password: string): Promise<AuthResponse> =>
//     api.post('/auth/register', { name, email, password }).then(res => res.data),
  
//   getProfile: (): Promise<User> =>
//     api.get('/auth/profile').then(res => res.data),
// };

// // Villages API
// export const villagesAPI = {
//   getAll: (): Promise<Village[]> =>
//     api.get('/villages').then(res => res.data),
  
//   getById: (id: string): Promise<Village> =>
//     api.get(`/villages/${id}`).then(res => res.data),
  
//   create: (village: Omit<Village, 'id' | 'createdAt' | 'totalCustomers' | 'totalLoans' | 'totalAmount'>): Promise<Village> =>
//     api.post('/villages', village).then(res => res.data),
  
//   update: (id: string, village: Partial<Village>): Promise<Village> =>
//     api.put(`/villages/${id}`, village).then(res => res.data),
  
//   delete: (id: string): Promise<void> =>
//     api.delete(`/villages/${id}`).then(res => res.data),
// };

// // Customers API
// export const customersAPI = {
//   getAll: (village_id?: string): Promise<Customer[]> =>
//     api.get('/customers', { params: { village_id } }).then(res => res.data),
  
//   getById: (id: string): Promise<Customer> =>
//     api.get(`/customers/${id}`).then(res => res.data),
  
//   create: (customer: {
//     name: string;
//     village_id: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//   }): Promise<Customer> =>
//     api.post('/customers', customer).then(res => res.data),
  
//   update: (id: string, customer: Partial<Customer>): Promise<Customer> =>
//     api.put(`/customers/${id}`, customer).then(res => res.data),
  
//   delete: (id: string): Promise<void> =>
//     api.delete(`/customers/${id}`).then(res => res.data),
// };

// // Loans API
// export const loansAPI = {
//   getAll: (customer_id?: string, village_id?: string): Promise<Loan[]> =>
//     api.get('/loans', { params: { customer_id, village_id } }).then(res => res.data),
  
//   getById: (id: string): Promise<Loan> =>
//     api.get(`/loans/${id}`).then(res => res.data),
  
//   create: (loan: {
//     customer_id: string;
//     village_id: string;
//     principal_amount: number;
//     interest_rate: number;
//     loan_period_months: number;
//     start_date: string;
//   }): Promise<Loan> =>
//     api.post('/loans', loan).then(res => res.data),
  
//   update: (id: string, loan: Partial<Loan>): Promise<Loan> =>
//     api.put(`/loans/${id}`, loan).then(res => res.data),
  
//   delete: (id: string): Promise<void> =>
//     api.delete(`/loans/${id}`).then(res => res.data),
// };

// // Payments API
// export const paymentsAPI = {
//   getAll: (loan_id?: string, customer_id?: string): Promise<Payment[]> =>
//     api.get('/payments', { params: { loan_id, customer_id } }).then(res => res.data),
  
//   getById: (id: string): Promise<Payment> =>
//     api.get(`/payments/${id}`).then(res => res.data),
  
//   create: (payment: {
//     loan_id: string;
//     customer_id: string;
//     amount: number;
//     payment_date: string;
//     payment_method: string;
//     reference_number?: string;
//     notes?: string;
//   }): Promise<Payment> =>
//     api.post('/payments', payment).then(res => res.data),
  
//   update: (id: string, payment: Partial<Payment>): Promise<Payment> =>
//     api.put(`/payments/${id}`, payment).then(res => res.data),
  
//   delete: (id: string): Promise<void> =>
//     api.delete(`/payments/${id}`).then(res => res.data),
// };

// // Dashboard API
// export const dashboardAPI = {
//   getStats: (): Promise<{
//     total_villages: number;
//     total_customers: number;
//     total_loans: number;
//     total_amount: number;
//     total_paid: number;
//     total_pending: number;
//   }> =>
//     api.get('/dashboard/stats').then(res => res.data),
// };
import axios from 'axios';
import { 
  User, 
  Village, 
  Customer, 
  Loan, 
  Payment, 
  AuthResponse, 
  ApiResponse 
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/register', { name, email, password }).then(res => res.data),
  
  getProfile: (): Promise<User> =>
    api.get('/auth/profile').then(res => res.data),

  updateProfile: (data: { name?: string; email?: string }): Promise<User> =>
    api.put('/auth/profile', data).then(res => res.data),

  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> =>
    api.put('/auth/change-password', data).then(res => res.data),
};

// Villages API
export const villagesAPI = {
  getAll: (): Promise<Village[]> =>
    api.get('/villages').then(res => res.data),
  
  getById: (id: string): Promise<Village> =>
    api.get(`/villages/${id}`).then(res => res.data),
  
  create: (village: Omit<Village, 'id' | 'createdAt' | 'totalCustomers' | 'totalLoans' | 'totalAmount'>): Promise<Village> =>
    api.post('/villages', village).then(res => res.data),
  
  update: (id: string, village: Partial<Village>): Promise<Village> =>
    api.put(`/villages/${id}`, village).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/villages/${id}`).then(res => res.data),
};

// Customers API
export const customersAPI = {
  getAll: (village_id?: string): Promise<Customer[]> =>
    api.get('/customers', { params: { village_id } }).then(res => res.data),
  
  getById: (id: string): Promise<Customer> =>
    api.get(`/customers/${id}`).then(res => res.data),
  
  create: (customer: {
    name: string;
    village_id: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<Customer> =>
    api.post('/customers', customer).then(res => res.data),
  
  update: (id: string, customer: {
    name?: string;
    village_id?: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<Customer> =>
    api.put(`/customers/${id}`, customer).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/customers/${id}`).then(res => res.data),
};

// Loans API
export const loansAPI = {
  getAll: (customer_id?: string, village_id?: string): Promise<Loan[]> =>
    api.get('/loans', { params: { customer_id, village_id } }).then(res => res.data),
  
  getById: (id: string): Promise<Loan> =>
    api.get(`/loans/${id}`).then(res => res.data),
  
  create: (loan: {
    customer_id: string;
    village_id: string;
    principal_amount: number;
    interest_rate: number;
    loan_period_months: number;
    start_date: string;
    due_date: string;
  }): Promise<Loan> =>
    api.post('/loans', loan).then(res => res.data),
  
  update: (id: string, loan: {
    interest_rate?: number;
    loan_period_months?: number;
    status?: string;
  }): Promise<Loan> =>
    api.put(`/loans/${id}`, loan).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/loans/${id}`).then(res => res.data),
};

// Payments API
export const paymentsAPI = {
  getAll: (loan_id?: string, customer_id?: string): Promise<Payment[]> =>
    api.get('/payments', { params: { loan_id, customer_id } }).then(res => res.data),
  
  getById: (id: string): Promise<Payment> =>
    api.get(`/payments/${id}`).then(res => res.data),
  
  create: (payment: {
    loan_id: string;
    customer_id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }): Promise<Payment> =>
    api.post('/payments', payment).then(res => res.data),
  
  update: (id: string, payment: {
    loan_id?: string;
    customer_id?: string;
    amount?: number;
    payment_date?: string;
    payment_method?: string;
    reference_number?: string;
    notes?: string;
  }): Promise<Payment> =>
    api.put(`/payments/${id}`, payment).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/payments/${id}`).then(res => res.data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (): Promise<{
    total_villages: number;
    total_customers: number;
    total_loans: number;
    total_amount: number;
    total_paid: number;
    total_pending: number;
  }> =>
    api.get('/dashboard/stats').then(res => res.data),
};

// Settings API
export const settingsAPI = {
  exportData: (options: {
    format: 'json' | 'csv' | 'excel';
    tables: string[];
    dateRange?: { start: string; end: string };
  }): Promise<Blob> =>
    api.post('/settings/export', options, { responseType: 'blob' }).then(res => res.data),

  importData: (file: File): Promise<{ success: boolean; message: string; imported: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/settings/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  optimizeDatabase: (): Promise<{ success: boolean; message: string }> =>
    api.post('/settings/optimize-db').then(res => res.data),

  clearCache: (): Promise<{ success: boolean; message: string }> =>
    api.post('/settings/clear-cache').then(res => res.data),

  getSystemInfo: (): Promise<{
    version: string;
    database: { size: string; tables: number; records: number };
    cache: { size: string; entries: number };
    lastBackup?: string;
  }> =>
    api.get('/settings/system-info').then(res => res.data),
};