// export interface User {
//   id: string;
//   name: string;
//   username: string;
//   email: string;
//   role: 'admin' | 'user';
//   createdAt: string;
// }

// export interface Village {
//   id: string;
//   name: string;
//   code: string;
//   description?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
//   createdAt: string;
//   updatedAt?: string;
//   totalCustomers?: number;
//   totalLoans?: number;
//   totalAmount?: number;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   villageId: string;
//   village_id?: string; // Alternative field name for backend compatibility
//   village?: Village;
//   villageName?: string;
//   villageCode?: string;
//   totalLoanAmount?: number;
//   totalPaidAmount?: number;
//   remainingAmount?: number;
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface Loan {
//   id: string;
//   customerId: string;
//   customer_id?: string; // Alternative field name for backend compatibility
//   villageId: string;
//   village_id?: string; // Alternative field name for backend compatibility
//   customer?: Customer;
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   villageName?: string;
//   villageCode?: string;
//   amount: number;
//   principal_amount?: number; // Alternative field name for backend compatibility
//   interestRate: number;
//   interest_rate?: number; // Alternative field name for backend compatibility
//   duration: number; // in months
//   loan_period_months?: number; // Alternative field name for backend compatibility
//   status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted' | 'paid';
//   startDate: string;
//   start_date?: string; // Alternative field name for backend compatibility
//   endDate?: string;
//   end_date?: string; // Alternative field name for backend compatibility
//   dueDate?: string; // Due date field
//   due_date?: string; // Alternative field name for backend compatibility
//   totalAmount?: number;
//   total_amount?: number; // Alternative field name for backend compatibility
//   paidAmount?: number;
//   paid_amount?: number; // Alternative field name for backend compatibility
//   remainingAmount?: number;
//   pending_amount?: number; // Alternative field name for backend compatibility
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface Payment {
//   id: string;
//   loanId: string;
//   loan_id?: string; // Alternative field name for backend compatibility
//   customerId: string;
//   customer_id?: string; // Alternative field name for backend compatibility
//   loan?: Loan;
//   customerName?: string;
//   amount: number;
//   paymentDate: string;
//   payment_date?: string; // Alternative field name for backend compatibility
//   date: string; // Alias for paymentDate
//   paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'online' | 'digital';
//   payment_method?: string; // Alternative field name for backend compatibility
//   method: string; // Alias for paymentMethod
//   status: 'pending' | 'completed' | 'failed';
//   reference?: string;
//   reference_number?: string; // Alternative field name for backend compatibility
//   notes?: string;
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   user: User;
//   access_token: string;
//   token: string;
// }

// export interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Village {
  id: string;
  name: string;
  code: string;
  description?: string;
  district?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
  updatedAt?: string;
  totalCustomers?: number;
  totalLoans?: number;
  totalAmount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  villageId: string;
  village_id?: string; // Alternative field name for backend compatibility
  village?: Village;
  villageName?: string;
  villageCode?: string;
  totalLoanAmount?: number;
  totalPaidAmount?: number;
  remainingAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Loan {
  id: string;
  customerId: string;
  customer_id?: string; // Alternative field name for backend compatibility
  villageId: string;
  village_id?: string; // Alternative field name for backend compatibility
  customer?: Customer;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  villageName?: string;
  villageCode?: string;
  amount: number;
  principal_amount?: number; // Alternative field name for backend compatibility
  interestRate: number;
  interest_rate?: number; // Alternative field name for backend compatibility
  duration: number; // in months
  loan_period_months?: number; // Alternative field name for backend compatibility
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted' | 'paid';
  startDate: string;
  start_date?: string; // Alternative field name for backend compatibility
  endDate?: string;
  end_date?: string; // Alternative field name for backend compatibility
  dueDate?: string; // Due date field
  due_date?: string; // Alternative field name for backend compatibility
  totalAmount?: number;
  total_amount?: number; // Alternative field name for backend compatibility
  paidAmount?: number;
  paid_amount?: number; // Alternative field name for backend compatibility
  remainingAmount?: number;
  pending_amount?: number; // Alternative field name for backend compatibility
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  loan_id?: string; // Alternative field name for backend compatibility
  customerId: string;
  customer_id?: string; // Alternative field name for backend compatibility
  loan?: Loan;
  customerName?: string;
  amount: number;
  paymentDate: string;
  payment_date?: string; // Alternative field name for backend compatibility
  date: string; // Alias for paymentDate
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'online' | 'digital';
  payment_method?: string; // Alternative field name for backend compatibility
  method: string; // Alias for paymentMethod
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  reference_number?: string; // Alternative field name for backend compatibility
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  relatedEntity?: {
    type: 'loan' | 'payment' | 'customer' | 'village';
    id: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user: User;
  access_token: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}