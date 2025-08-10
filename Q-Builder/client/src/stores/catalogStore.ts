import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CatalogItem, Profession } from '../types';
import { apiService } from '../services/api';

interface CatalogState {
  catalogItems: CatalogItem[];
  professions: Profession[];
  loading: boolean;
  error: string | null;
  selectedProfession: number | null;
  searchQuery: string;
}

interface CatalogActions {
  // Data fetching
  fetchCatalogItems: () => Promise<void>;
  fetchCatalogItemsByProfession: (professionId: number) => Promise<void>;
  fetchProfessions: () => Promise<void>;
  
  // Catalog management
  createCatalogItem: (itemData: Omit<CatalogItem, 'id' | 'createdAt'>) => Promise<CatalogItem>;
  updateCatalogItem: (id: number, itemData: Partial<CatalogItem>) => Promise<CatalogItem>;
  deleteCatalogItem: (id: number) => Promise<void>;
  
  // UI state management
  setSelectedProfession: (professionId: number | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Computed getters
  getFilteredCatalogItems: () => CatalogItem[];
  getCatalogItemById: (id: number) => CatalogItem | undefined;
  getProfessionById: (id: number) => Profession | undefined;
  
  // Reset state
  reset: () => void;
}

type CatalogStore = CatalogState & CatalogActions;

const initialState: CatalogState = {
  catalogItems: [],
  professions: [],
  loading: false,
  error: null,
  selectedProfession: null,
  searchQuery: '',
};

export const useCatalogStore = create<CatalogStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Data fetching
      fetchCatalogItems: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get<CatalogItem[]>('/catalog');
          if (response.success && response.data) {
            set({ catalogItems: response.data, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch catalog items');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בטעינת פריטי הקטלוג', 
            loading: false 
          });
        }
      },

      fetchCatalogItemsByProfession: async (professionId) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get<CatalogItem[]>(`/catalog/profession/${professionId}`);
          if (response.success && response.data) {
            set({ catalogItems: response.data, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch catalog items');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בטעינת פריטי הקטלוג', 
            loading: false 
          });
        }
      },

      fetchProfessions: async () => {
        try {
          const response = await apiService.get<Profession[]>('/professions');
          if (response.success && response.data) {
            set({ professions: response.data });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch professions');
          }
        } catch (error: any) {
          console.error('Error fetching professions:', error);
        }
      },

      // Catalog management
      createCatalogItem: async (itemData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post<CatalogItem>('/catalog', itemData);
          if (response.success && response.data) {
            const newItem = response.data;
            set(state => ({
              catalogItems: [...state.catalogItems, newItem],
              loading: false
            }));
            return newItem;
          } else {
            throw new Error(response.error?.message || 'Failed to create catalog item');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה ביצירת פריט קטלוג חדש', 
            loading: false 
          });
          throw error;
        }
      },

      updateCatalogItem: async (id, itemData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.put<CatalogItem>(`/catalog/${id}`, itemData);
          if (response.success && response.data) {
            const updatedItem = response.data;
            set(state => ({
              catalogItems: state.catalogItems.map(item => 
                item.id === id ? updatedItem : item
              ),
              loading: false
            }));
            return updatedItem;
          } else {
            throw new Error(response.error?.message || 'Failed to update catalog item');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה בעדכון פריט הקטלוג', 
            loading: false 
          });
          throw error;
        }
      },

      deleteCatalogItem: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.delete(`/catalog/${id}`);
          if (response.success) {
            set(state => ({
              catalogItems: state.catalogItems.filter(item => item.id !== id),
              loading: false
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to delete catalog item');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'שגיאה במחיקת פריט הקטלוג', 
            loading: false 
          });
          throw error;
        }
      },

      // UI state management
      setSelectedProfession: (professionId) => set({ selectedProfession: professionId }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Computed getters
      getFilteredCatalogItems: () => {
        const { catalogItems, selectedProfession, searchQuery } = get();
        
        let filtered = catalogItems;
        
        // Apply profession filter
        if (selectedProfession) {
          filtered = filtered.filter(item => item.professionId === selectedProfession);
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            item.unit.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      },

      getCatalogItemById: (id) => {
        return get().catalogItems.find(item => item.id === id);
      },

      getProfessionById: (id) => {
        return get().professions.find(profession => profession.id === id);
      },

      // Reset state
      reset: () => set(initialState),
    }),
    {
      name: 'catalog-store',
    }
  )
);