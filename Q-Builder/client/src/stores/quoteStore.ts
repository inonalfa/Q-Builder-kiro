import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Quote, QuoteStatus, Client } from '../types';
import { apiService } from '../services/api';

interface QuoteFilters {
  status?: QuoteStatus;
  clientId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface QuoteStore {
  // State
  quotes: Quote[];
  clients: Client[];
  selectedQuote: Quote | null;
  filters: QuoteFilters;
  loading: boolean;
  error: string | null;

  // Actions
  fetchQuotes: () => Promise<void>;
  fetchClients: () => Promise<void>;
  setFilters: (filters: Partial<QuoteFilters>) => void;
  clearFilters: () => void;
  setSelectedQuote: (quote: Quote | null) => void;
  createQuote: (quoteData: Partial<Quote>) => Promise<Quote>;
  updateQuote: (id: number, updates: Partial<Quote>) => Promise<Quote>;
  deleteQuote: (id: number) => Promise<void>;
  updateQuoteStatus: (id: number, status: QuoteStatus) => Promise<Quote>;

  // Computed getters
  getFilteredQuotes: () => Quote[];
  getQuotesByStatus: (status: QuoteStatus) => Quote[];
  getClientById: (id: number) => Client | undefined;
}

export const useQuoteStore = create<QuoteStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      quotes: [],
      clients: [],
      selectedQuote: null,
      filters: {},
      loading: false,
      error: null,

      // Actions
      fetchQuotes: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get('/quotes');
          if (response.success && response.data) {
            // Handle both array and paginated response formats
            let quotes: Quote[] = [];
            if (Array.isArray(response.data)) {
              quotes = response.data;
            } else if (response.data && typeof response.data === 'object' && 'quotes' in response.data) {
              quotes = (response.data as { quotes: Quote[] }).quotes || [];
            }
            set({ quotes, loading: false });
          } else {
            throw new Error(response.error?.message || 'Failed to fetch quotes');
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          console.error('Error fetching quotes:', error);
        }
      },

      fetchClients: async () => {
        try {
          const response = await apiService.get<Client[]>('/clients');
          if (response.success && response.data) {
            set({ clients: response.data });
          }
        } catch (error: any) {
          console.error('Error fetching clients:', error);
        }
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      setSelectedQuote: (quote) => {
        set({ selectedQuote: quote });
      },

      createQuote: async (quoteData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post<Quote>('/quotes', quoteData);
          if (response.success && response.data) {
            set((state) => ({
              quotes: [...state.quotes, response.data!],
              loading: false
            }));
            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to create quote');
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateQuote: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.put<Quote>(`/quotes/${id}`, updates);
          if (response.success && response.data) {
            set((state) => ({
              quotes: state.quotes.map(quote =>
                quote.id === id ? response.data! : quote
              ),
              selectedQuote: state.selectedQuote?.id === id ? response.data! : state.selectedQuote,
              loading: false
            }));
            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to update quote');
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteQuote: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.delete(`/quotes/${id}`);
          if (response.success) {
            set((state) => ({
              quotes: state.quotes.filter(quote => quote.id !== id),
              selectedQuote: state.selectedQuote?.id === id ? null : state.selectedQuote,
              loading: false
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to delete quote');
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateQuoteStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.put<Quote>(`/quotes/${id}`, { status });
          if (response.success && response.data) {
            set((state) => ({
              quotes: state.quotes.map(quote =>
                quote.id === id ? response.data! : quote
              ),
              selectedQuote: state.selectedQuote?.id === id ? response.data! : state.selectedQuote,
              loading: false
            }));
            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to update quote status');
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Computed getters
      getFilteredQuotes: () => {
        const { quotes, filters } = get();
        let filtered = [...quotes];

        // Filter by status
        if (filters.status) {
          filtered = filtered.filter(quote => quote.status === filters.status);
        }

        // Filter by client
        if (filters.clientId) {
          filtered = filtered.filter(quote => quote.clientId === filters.clientId);
        }

        // Filter by date range
        if (filters.dateFrom) {
          filtered = filtered.filter(quote =>
            new Date(quote.issueDate) >= new Date(filters.dateFrom!)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(quote =>
            new Date(quote.issueDate) <= new Date(filters.dateTo!)
          );
        }

        // Filter by search term
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(quote =>
            quote.title.toLowerCase().includes(searchTerm) ||
            quote.quoteNumber.toLowerCase().includes(searchTerm)
          );
        }

        // Sort by creation date (newest first)
        return filtered.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getQuotesByStatus: (status) => {
        const { quotes } = get();
        return quotes.filter(quote => quote.status === status);
      },

      getClientById: (id) => {
        const { clients } = get();
        return clients.find(client => client.id === id);
      }
    }),
    {
      name: 'quote-store'
    }
  )
);