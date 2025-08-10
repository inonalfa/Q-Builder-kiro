import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import PaymentForm from './PaymentForm';
import type { Payment } from '../../types';

interface PaymentListProps {
  projectId: number;
  payments: Payment[];
  onPaymentUpdate: () => void;
}

const PaymentList: React.FC<PaymentListProps> = ({
  projectId,
  payments,
  onPaymentUpdate
}) => {
  const { deletePayment } = useProjectStore();
  const { addNotification } = useUIStore();
  
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<number | null>(null);

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'מזומן',
      check: 'צ\'ק',
      bank_transfer: 'העברה בנקאית',
      credit_card: 'כרטיס אשראי',
      other: 'אחר'
    };
    return methods[method] || method;
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את התשלום?')) {
      return;
    }

    setDeletingPaymentId(paymentId);
    try {
      await deletePayment(paymentId);
      addNotification({
        type: 'success',
        message: 'התשלום נמחק בהצלחה',
        duration: 3000
      });
      onPaymentUpdate();
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'שגיאה במחיקת התשלום',
        duration: 5000
      });
    } finally {
      setDeletingPaymentId(null);
    }
  };

  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">תשלומים</h2>
            <p className="text-sm text-gray-600">
              {payments.length} תשלומים • סה"כ: ₪{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">אין תשלומים</h3>
            <p className="mt-1 text-sm text-gray-500">התחל על ידי הוספת התשלום הראשון</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תאריך
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סכום
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    אמצעי תשלום
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מספר קבלה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    הערות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₪{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodText(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.receiptNumber || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {payment.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPayment(payment)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          title="עריכה"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          disabled={deletingPaymentId === payment.id}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50"
                          title="מחיקה"
                        >
                          {deletingPaymentId === payment.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Summary */}
        {payments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">סה"כ תשלומים:</span>
              <span className="text-lg font-bold text-gray-900">₪{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <PaymentForm
          projectId={projectId}
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSuccess={() => {
            setEditingPayment(null);
            onPaymentUpdate();
          }}
        />
      )}
    </div>
  );
};

export default PaymentList;