import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('auth-storage');
    let authToken = null;
    
    if (token) {
      try {
        const parsed = JSON.parse(token);
        authToken = parsed.state?.token;
      } catch (e) {
        console.error('Error parsing auth token:', e);
      }
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Handle different HTTP status codes
        const errorMessage = data.error?.message || data.message || this.getErrorMessage(response.status);
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.data = data;
        
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      
      // Handle network errors
      if (!error.status) {
        error.message = 'שגיאת רשת - בדוק את החיבור לאינטרנט';
      }
      
      throw error;
    }
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'בקשה שגויה - נתונים לא תקינים';
      case 401:
        return 'נדרשת התחברות למערכת';
      case 403:
        return 'אין הרשאה לביצוע פעולה זו';
      case 404:
        return 'המשאב המבוקש לא נמצא';
      case 429:
        return 'יותר מדי בקשות - נסה שוב מאוחר יותר';
      case 500:
        return 'שגיאת שרת פנימית';
      case 503:
        return 'השירות אינו זמין כרגע';
      default:
        return 'אירעה שגיאה לא צפויה';
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }
  
  async googleOAuth(data: { idToken?: string; code?: string; redirectUri?: string }) {
    return this.request('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async appleOAuth(data: { 
    idToken?: string; 
    code?: string; 
    redirectUri?: string;
    user?: {
      name?: {
        firstName?: string;
        lastName?: string;
      }
    }
  }) {
    return this.request('/auth/apple/callback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;