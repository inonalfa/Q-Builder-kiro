import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';

const QuoteForm: React.FC = () => {
  usePageTitle('הצעת מחיר חדשה');

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">הצעת מחיר חדשה</h1>
      <p className="text-gray-600">טופס יצירת הצעת מחיר יהיה זמין בקרוב</p>
    </div>
  );
};

export default QuoteForm;