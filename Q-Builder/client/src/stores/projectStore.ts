import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import type { Project, Payment, ApiResponse } from '../types';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  
  // Payment actions
  addPayment: (projectId: number, payment: Omit<Payment, 'id' | 'projectId'>) => Promise<Payment>;
  updatePayment: (paymentId: number, updates: Partial<Payment>) => Promise<Payment>;
  deletePayment: (paymentId: number) => Promise<void>;
  
  // UI actions
  setSelectedProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      projects: [],
      selectedProject: null,
      loading: false,
      error: null,

      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Project[]> = await apiService.get('/projects');
          if (response.success && response.data) {
            set({ projects: response.data, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch projects');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בטעינת הפרויקטים', 
            loading: false 
          });
        }
      },

      fetchProject: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Project> = await apiService.get(`/projects/${id}`);
          if (response.success && response.data) {
            set({ selectedProject: response.data, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch project');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בטעינת הפרויקט', 
            loading: false 
          });
        }
      },

      createProject: async (projectData: Partial<Project>) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Project> = await apiService.post('/projects', projectData);
          if (response.success && response.data) {
            const newProject = response.data;
            set(state => ({ 
              projects: [...state.projects, newProject],
              loading: false 
            }));
            return newProject;
          } else {
            throw new Error(response.error?.message || 'Failed to create project');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה ביצירת הפרויקט', 
            loading: false 
          });
          throw error;
        }
      },

      updateProject: async (id: number, updates: Partial<Project>) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Project> = await apiService.put(`/projects/${id}`, updates);
          if (response.success && response.data) {
            const updatedProject = response.data;
            set(state => ({
              projects: state.projects.map(p => p.id === id ? updatedProject : p),
              selectedProject: state.selectedProject?.id === id ? updatedProject : state.selectedProject,
              loading: false
            }));
            return updatedProject;
          } else {
            throw new Error(response.error?.message || 'Failed to update project');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בעדכון הפרויקט', 
            loading: false 
          });
          throw error;
        }
      },

      deleteProject: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse = await apiService.delete(`/projects/${id}`);
          if (response.success) {
            set(state => ({
              projects: state.projects.filter(p => p.id !== id),
              selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
              loading: false
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to delete project');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה במחיקת הפרויקט', 
            loading: false 
          });
          throw error;
        }
      },

      addPayment: async (projectId: number, payment: Omit<Payment, 'id' | 'projectId'>) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Payment> = await apiService.post(
            `/projects/${projectId}/payments`, 
            payment
          );
          if (response.success && response.data) {
            const newPayment = response.data;
            set(state => ({
              projects: state.projects.map(p => 
                p.id === projectId 
                  ? { ...p, payments: [...p.payments, newPayment] }
                  : p
              ),
              selectedProject: state.selectedProject?.id === projectId
                ? { ...state.selectedProject, payments: [...state.selectedProject.payments, newPayment] }
                : state.selectedProject,
              loading: false
            }));
            return newPayment;
          } else {
            throw new Error(response.error?.message || 'Failed to add payment');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בהוספת התשלום', 
            loading: false 
          });
          throw error;
        }
      },

      updatePayment: async (paymentId: number, updates: Partial<Payment>) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse<Payment> = await apiService.put(`/payments/${paymentId}`, updates);
          if (response.success && response.data) {
            const updatedPayment = response.data;
            set(state => ({
              projects: state.projects.map(p => ({
                ...p,
                payments: p.payments.map(payment => 
                  payment.id === paymentId ? updatedPayment : payment
                )
              })),
              selectedProject: state.selectedProject ? {
                ...state.selectedProject,
                payments: state.selectedProject.payments.map(payment =>
                  payment.id === paymentId ? updatedPayment : payment
                )
              } : null,
              loading: false
            }));
            return updatedPayment;
          } else {
            throw new Error(response.error?.message || 'Failed to update payment');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בעדכון התשלום', 
            loading: false 
          });
          throw error;
        }
      },

      deletePayment: async (paymentId: number) => {
        set({ loading: true, error: null });
        try {
          const response: ApiResponse = await apiService.delete(`/payments/${paymentId}`);
          if (response.success) {
            set(state => ({
              projects: state.projects.map(p => ({
                ...p,
                payments: p.payments.filter(payment => payment.id !== paymentId)
              })),
              selectedProject: state.selectedProject ? {
                ...state.selectedProject,
                payments: state.selectedProject.payments.filter(payment => payment.id !== paymentId)
              } : null,
              loading: false
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to delete payment');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה במחיקת התשלום', 
            loading: false 
          });
          throw error;
        }
      },

      setSelectedProject: (project: Project | null) => {
        set({ selectedProject: project });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'project-store',
    }
  )
);