import React from 'react';
import { useParams } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  usePageTitle('פרטי הצעת מחיר');

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">פרטי הצעת מחיר #{id}</h1>
      <p className="text-gray-600">עמוד פרטי הצעת מחיר יהיה זמין בקרוב</p>
    </div>
  );
};

export default QuoteDetail;