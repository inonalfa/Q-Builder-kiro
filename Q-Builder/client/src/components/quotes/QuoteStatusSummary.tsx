import React from 'react';
import { useQuoteStore } from '../../stores/quoteStore';
import type { QuoteStatus } from '../../types';

interface StatusSummaryProps {
  onStatusFilter?: (status: QuoteStatus | undefined) => void;
}

const QuoteStatusSummary: React.FC<StatusSummaryProps> = ({ onStatusFilter }) => {
  const { quotes } = useQuoteStore();

  const getStatusCounts = () => {
    const counts = {
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
      total: quotes.length
    };

    quotes.forEach(quote => {
      counts[quote.status]++;
    });

    return counts;
  };

  const counts = getStatusCounts();

  const statusCards = [
    {
      status: 'draft' as QuoteStatus,
      label: 'טיוטות',
      count: counts.draft,
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      hoverColor: 'hover:bg-gray-100'
    },
    {
      status: 'sent' as QuoteStatus,
      label: 'נשלחו',
      count: counts.sent,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      status: 'accepted' as QuoteStatus,
      label: 'אושרו',
      count: counts.accepted,
      color: 'bg-green-50 border-green-200 text-green-700',
      hoverColor: 'hover:bg-green-100'
    },
    {
      status: 'rejected' as QuoteStatus,
      label: 'נדחו',
      count: counts.rejected,
      color: 'bg-red-50 border-red-200 text-red-700',
      hoverColor: 'hover:bg-red-100'
    },
    {
      status: 'expired' as QuoteStatus,
      label: 'פג תוקף',
      count: counts.expired,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      hoverColor: 'hover:bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      {/* Total quotes */}
      <div 
        className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
          onStatusFilter ? 'hover:shadow-sm' : ''
        }`}
        onClick={() => onStatusFilter?.(undefined)}
      >
        <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
        <div className="text-sm text-gray-600">סה"כ הצעות</div>
      </div>

      {/* Status-specific cards */}
      {statusCards.map(({ status, label, count, color, hoverColor }) => (
        <div
          key={status}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${color} ${hoverColor} ${
            onStatusFilter ? 'hover:shadow-sm' : ''
          }`}
          onClick={() => onStatusFilter?.(status)}
        >
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-sm">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuoteStatusSummary;