import { create } from 'zustand';

interface UIState {
  loading: boolean;
  sidebarOpen: boolean;
  currentLanguage: 'he' | 'en';
  direction: 'rtl' | 'ltr';
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIActions {
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (language: 'he' | 'en') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  loading: false,
  sidebarOpen: false,
  currentLanguage: 'he',
  direction: 'rtl',
  notifications: [],

  // Actions
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setLanguage: (language: 'he' | 'en') => {
    const direction = language === 'he' ? 'rtl' : 'ltr';
    set({ currentLanguage: language, direction });
    
    // Update document direction
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));