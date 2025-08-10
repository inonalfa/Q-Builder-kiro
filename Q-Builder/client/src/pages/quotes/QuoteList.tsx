import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuoteStore } from '../../stores/quoteStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import QuoteStatusSummary from '../../components/quotes/QuoteStatusSummary';
import type { QuoteStatus } from '../../types';

// Icons (using simple SVG icons for now)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Status badge component
const StatusBadge: React.FC<{ status: QuoteStatus }> = ({ status }) => {
  const getStatusConfig = (status: QuoteStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'טיוטה', className: 'bg-gray-100 text-gray-800' };
      case 'sent':
        return { label: 'נשלח', className: 'bg-blue-100 text-blue-800' };
      case 'accepted':
        return { label: 'אושר', className: 'bg-green-100 text-green-800' };
      case 'rejected':
        return { label: 'נדחה', className: 'bg-red-100 text-red-800' };
      case 'expired':
        return { label: 'פג תוקף', className: 'bg-orange-100 text-orange-800' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

// Quote card component
const QuoteCard: React.FC<{ quote: any }> = ({ quote }) => {
  const { getClientById } = useQuoteStore();
  const client = getClientById(quote.clientId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(quote.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0 && quote.status === 'sent';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <Link 
              to={`/quotes/${quote.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {quote.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">{quote.quoteNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={quote.status} />
          {isExpiringSoon() && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              פג תוקף בקרוב
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <UserIcon />
          <span className="mr-2">{client?.name || 'לקוח לא ידוע'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon />
          <span className="mr-2">{formatDate(quote.issueDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {formatCurrency(quote.totalAmount)}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/quotes/${quote.id}/edit`}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            עריכה
          </Link>
          <Link
            to={`/quotes/${quote.id}`}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            צפייה
          </Link>
        </div>
      </div>
    </div>
  );
};

// Filters component
const QuoteFilters: React.FC<{ 
  onRefresh: () => void; 
  loading: boolean; 
}> = ({ onRefresh, loading }) => {
  const { filters, setFilters, clearFilters, clients } = useQuoteStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusFilter = (status: QuoteStatus | undefined) => {
    setFilters({ status });
  };

  const statusOptions: { value: QuoteStatus; label: string }[] = [
    { value: 'draft', label: 'טיוטה' },
    { value: 'sent', label: 'נשלח' },
    { value: 'accepted', label: 'אושר' },
    { value: 'rejected', label: 'נדחה' },
    { value: 'expired', label: 'פג תוקף' }
  ];

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <QuoteStatusSummary onStatusFilter={handleStatusFilter} />
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="חיפוש הצעות מחיר..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FilterIcon />
            <span>סינון</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              נקה סינון
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshIcon />
            <span>רענן</span>
          </button>
          <Link
            to="/quotes/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            <span>הצעת מחיר חדשה</span>
          </Link>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סטטוס
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ status: e.target.value as QuoteStatus || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">כל הסטטוסים</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Client filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              לקוח
            </label>
            <select
              value={filters.clientId || ''}
              onChange={(e) => setFilters({ clientId: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">כל הלקוחות</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מתאריך
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ dateFrom: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              עד תאריך
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ dateTo: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// Main component
const QuoteList: React.FC = () => {
  usePageTitle('הצעות מחיר');
  
  const { 
    quotes, 
    loading, 
    error, 
    fetchQuotes, 
    fetchClients, 
    getFilteredQuotes 
  } = useQuoteStore();

  const filteredQuotes = getFilteredQuotes();

  const handleRefresh = async () => {
    try {
      await Promise.all([fetchQuotes(), fetchClients()]);
    } catch (error) {
      console.error('Error refreshing quote data:', error);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  if (loading && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-gray-600">טוען הצעות מחיר...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-red-800">
              שגיאה בטעינת הצעות המחיר
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הצעות מחיר</h1>
          <p className="text-gray-600 mt-1">
            ניהול הצעות המחיר שלך
          </p>
        </div>
      </div>

      {/* Filters */}
      <QuoteFilters onRefresh={handleRefresh} loading={loading} />

      {/* Quote list */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            אין הצעות מחיר
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            התחל על ידי יצירת הצעת מחיר חדשה
          </p>
          <div className="mt-6">
            <Link
              to="/quotes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon />
              <span className="mr-2">הצעת מחיר חדשה</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteList;