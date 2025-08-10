import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Client } from '../types';
import { apiService } from '../services/api';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  selectedClient: Client | null;
}

interface ClientActions {
  // Data fetching
  fetchClients: () => Promise<void>;
  
  // Client management
  createClient: (clientData: Omit<Client, 'id' | 'userId' | 'createdAt'>) => Promise<Client>;
  updateClient: (id: number, clientData: Partial<Client>) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;
  
  // UI state management
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'name' | 'createdAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setSelectedClient: (client: Client | null) => void;
  
  // Computed getters
  getFilteredClients: () => Client[];
  getClientById: (id: number) => Client | undefined;
  
  // Reset state
  reset: () => void;
}

type ClientStore = ClientState & ClientActions;

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  selectedClient: null,
};

export const useClientStore = create<ClientStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Data fetching
      fetchClients: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get<Client[]>('/clients');
          if (response.success && response.data) {
            set({ clients: response.data, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch clients');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בטעינת רשימת הלקוחות', 
            loading: false 
          });
        }
      },

      // Client management
      createClient: async (clientData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post<Client>('/clients', clientData);
          if (response.success && response.data) {
            const newClient = response.data;
            set(state => ({
              clients: [...state.clients, newClient],
              loading: false
            }));
            return newClient;
          } else {
            throw new Error(response.error?.message || 'Failed to create client');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה ביצירת לקוח חדש', 
            loading: false 
          });
          throw error;
        }
      },

      updateClient: async (id, clientData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.put<Client>(`/clients/${id}`, clientData);
          if (response.success && response.data) {
            const updatedClient = response.data;
            set(state => ({
              clients: state.clients.map(client => 
                client.id === id ? updatedClient : client
              ),
              selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient,
              loading: false
            }));
            return updatedClient;
          } else {
            throw new Error(response.error?.message || 'Failed to update client');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בעדכון פרטי הלקוח', 
            loading: false 
          });
          throw error;
        }
      },

      deleteClient: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.delete(`/clients/${id}`);
          if (response.success) {
            set(state => ({
              clients: state.clients.filter(client => client.id !== id),
              selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
              loading: false
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to delete client');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה במחיקת הלקוח', 
            loading: false 
          });
          throw error;
        }
      },

      // UI state management
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setSortOrder: (order) => set({ sortOrder: order }),
      
      setSelectedClient: (client) => set({ selectedClient: client }),

      // Computed getters
      getFilteredClients: () => {
        const { clients, searchQuery, sortBy, sortOrder } = get();
        
        let filtered = clients;
        
        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = clients.filter(client => 
            client.name.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.phone.includes(query) ||
            (client.contactPerson && client.contactPerson.toLowerCase().includes(query)) ||
            client.address.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: string | Date;
          let bValue: string | Date;
          
          if (sortBy === 'name') {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
          } else {
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        return filtered;
      },

      getClientById: (id) => {
        return get().clients.find(client => client.id === id);
      },

      // Reset state
      reset: () => set(initialState),
    }),
    {
      name: 'client-store',
    }
  )
);