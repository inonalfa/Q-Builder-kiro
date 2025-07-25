// User and Authentication Types
export interface User {
  id: number;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  address: string;
  logoUrl?: string;
  professionIds: number[];
  vatRate: number;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  quoteExpiry: boolean;
  paymentReminders: boolean;
  quoteSent: boolean;
}

// Client Types
export interface Client {
  id: number;
  userId: number;
  name: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  createdAt: string;
}

// Quote Types
export interface Quote {
  id: number;
  userId: number;
  clientId: number;
  projectId?: number;
  quoteNumber: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  status: QuoteStatus;
  totalAmount: number;
  currency: string;
  terms?: string;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuoteItem {
  id: number;
  quoteId: number;
  catalogItemId?: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Project Types
export interface Project {
  id: number;
  userId: number;
  clientId: number;
  originQuoteId?: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget: number;
  payments: Payment[];
  createdAt: string;
}

export type ProjectStatus = 'active' | 'completed' | 'cancelled';

// Payment Types
export interface Payment {
  id: number;
  projectId: number;
  date: string;
  amount: number;
  method: string;
  note?: string;
  receiptNumber?: string;
}

// Catalog Types
export interface Profession {
  id: number;
  name: string;
  nameHebrew: string;
  createdAt: string;
}

export interface CatalogItem {
  id: number;
  professionId: number;
  name: string;
  unit: string;
  defaultPrice?: number;
  description?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
  address: string;
}

// UI Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}