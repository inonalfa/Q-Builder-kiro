import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import type { Payment } from '../../types';

interface PaymentFormProps {
  projectId: number;
  payment?: Payment;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  projectId,
  payment,
  onClose,
  onSuccess
}) => {
  const { addPayment, updatePayment, loading } = useProjectStore();
  const { addNotification } = useUIStore();
  
  const [formData, setFormData] = useState({
    date: payment?.date ? payment.date.split('T')[0] : new Date().toISOString().split('T')[0],
    amount: payment?.amount?.toString() || '',
    method: payment?.method || 'cash',
    note: payment?.note || '',
    receiptNumber: payment?.receiptNumber || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    { value: 'cash', label: 'מזומן' },
    { value: 'check', label: 'צ\'ק' },
    { value: 'bank_transfer', label: 'העברה בנקאית' },
    { value: 'credit_card', label: 'כרטיס אשראי' },
    { value: 'other', label: 'אחר' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'תאריך התשלום נדרש';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'סכום התשלום חייב להיות גדול מ-0';
    }

    if (!formData.method) {
      newErrors.method = 'אמצעי תשלום נדרש';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const paymentData = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        method: formData.method,
        note: formData.note || undefined,
        receiptNumber: formData.receiptNumber || undefined
      };

      if (payment) {
        await updatePayment(payment.id, paymentData);
        addNotification({
          type: 'success',
          message: 'התשלום עודכן בהצלחה',
          duration: 3000
        });
      } else {
        await addPayment(projectId, paymentData);
        addNotification({
          type: 'success',
          message: 'התשלום נוסף בהצלחה',
          duration: 3000
        });
      }
      
      onSuccess();
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'שגיאה בשמירת התשלום',
        duration: 5000
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {payment ? 'עריכת תשלום' : 'הוספת תשלום חדש'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                תאריך התשלום *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                סכום התשלום (₪) *
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                className={`block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                אמצעי תשלום *
              </label>
              <select
                id="method"
                value={formData.method}
                onChange={(e) => handleInputChange('method', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.method ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.method && (
                <p className="mt-1 text-sm text-red-600">{errors.method}</p>
              )}
            </div>

            {/* Receipt Number */}
            <div>
              <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700 mb-1">
                מספר קבלה
              </label>
              <input
                type="text"
                id="receiptNumber"
                value={formData.receiptNumber}
                onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                placeholder="מספר קבלה או אסמכתא"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                הערות
              </label>
              <textarea
                id="note"
                rows={3}
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="הערות נוספות על התשלום..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {payment ? 'עדכן תשלום' : 'הוסף תשלום'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;