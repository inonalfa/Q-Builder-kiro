import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuoteStore } from '../../stores/quoteStore';
import { apiService } from '../../services/api';
import usePageTitle from '../../hooks/usePageTitle';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  StatusBadge,
  Modal,
  Skeleton,
  EmptyState,
  Badge,
  Divider
} from '../../components/ui/AppleComponents';
import type { Quote, QuoteStatus, Client } from '../../types';

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateQuoteStatus } = useQuoteStore();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<QuoteStatus>('draft');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [convertingToProject, setConvertingToProject] = useState(false);

  usePageTitle(quote ? `הצעת מחיר ${quote.quoteNumber}` : 'הצעת מחיר');

  useEffect(() => {
    if (id) {
      fetchQuote();
    }
  }, [id]);

  const fetchQuote = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get<Quote>(`/quotes/${id}`);
      if (response.success && response.data) {
        setQuote(response.data);

        // Fetch client information
        const clientData = getClientById(response.data.clientId);
        if (clientData) {
          setClient(clientData);
        } else {
          // Fetch client from API if not in store
          const clientResponse = await apiService.get<Client>(`/clients/${response.data.clientId}`);
          if (clientResponse.success && clientResponse.data) {
            setClient(clientResponse.data);
          }
        }
      } else {
        setError(response.error?.message || 'שגיאה בטעינת הצעת המחיר');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת הצעת המחיר');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!quote) return;

    setUpdatingStatus(true);
    try {
      await updateQuoteStatus(quote.id, selectedStatus);
      setQuote(prev => prev ? { ...prev, status: selectedStatus } : null);
      setStatusModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'שגיאה בעדכון סטטוס הצעת המחיר');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!quote) return;

    setGeneratingPdf(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/quotes/${quote.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('שגיאה ביצירת קובץ PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `quote-${quote.quoteNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'שגיאה בהורדת קובץ PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleConvertToProject = async () => {
    if (!quote || quote.status !== 'accepted') return;

    setConvertingToProject(true);
    try {
      const response = await apiService.post('/projects', {
        name: quote.title,
        description: `פרויקט שנוצר מהצעת מחיר ${quote.quoteNumber}`,
        clientId: quote.clientId,
        originQuoteId: quote.id,
        budget: quote.totalAmount,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
      });

      if (response.success && response.data) {
        navigate(`/projects/${response.data.id}`);
      } else {
        throw new Error(response.error?.message || 'שגיאה ביצירת הפרויקט');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת הפרויקט');
    } finally {
      setConvertingToProject(false);
    }
  };

  const getStatusText = (status: QuoteStatus) => {
    const statusMap = {
      draft: 'טיוטה',
      sent: 'נשלחה',
      accepted: 'אושרה',
      rejected: 'נדחתה',
      expired: 'פגה תוקף'
    };
    return statusMap[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton height="2rem" className="mb-4" />
          <Card>
            <CardHeader>
              <Skeleton height="1.5rem" width="60%" />
              <Skeleton height="1rem" width="40%" className="mt-2" />
            </CardHeader>
            <div className="p-6">
              <Skeleton height="1rem" className="mb-2" />
              <Skeleton height="1rem" className="mb-2" />
              <Skeleton height="1rem" width="80%" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title="שגיאה בטעינת הצעת המחיר"
            description={error || 'הצעת המחיר לא נמצאה'}
            action={
              <Button onClick={() => navigate('/quotes')}>
                חזרה לרשימת הצעות המחיר
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              הצעת מחיר {quote.quoteNumber}
            </h1>
            <div className="flex items-center gap-4">
              <StatusBadge status={quote.status}>
                {getStatusText(quote.status)}
              </StatusBadge>
              <span className="text-text-secondary">
                נוצרה ב-{formatDate(quote.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/quotes/${quote.id}/edit`)}
            >
              עריכה
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadPdf}
              loading={generatingPdf}
            >
              הורדת PDF
            </Button>
            <Button
              onClick={() => {
                setSelectedStatus(quote.status);
                setStatusModalOpen(true);
              }}
            >
              עדכון סטטוס
            </Button>
          </div>
        </div>

        {/* Quote Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי הצעת המחיר</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary">כותרת</label>
                <p className="text-text-primary">{quote.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">תאריך הנפקה</label>
                <p className="text-text-primary">{formatDate(quote.issueDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">תאריך תפוגה</label>
                <p className="text-text-primary">{formatDate(quote.expiryDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">סכום כולל</label>
                <p className="text-xl font-bold text-primary-600">
                  {formatCurrency(quote.totalAmount)}
                </p>
              </div>
            </div>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי הלקוח</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              {client ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">שם הלקוח</label>
                    <p className="text-text-primary">{client.name}</p>
                  </div>
                  {client.contactPerson && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">איש קשר</label>
                      <p className="text-text-primary">{client.contactPerson}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-text-secondary">טלפון</label>
                    <p className="text-text-primary">{client.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">אימייל</label>
                    <p className="text-text-primary">{client.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">כתובת</label>
                    <p className="text-text-primary">{client.address}</p>
                  </div>
                </>
              ) : (
                <p className="text-text-secondary">טוען פרטי לקוח...</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quote Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>פריטי הצעת המחיר</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="text-right p-4 font-medium text-text-secondary">תיאור</th>
                  <th className="text-right p-4 font-medium text-text-secondary">יחידה</th>
                  <th className="text-right p-4 font-medium text-text-secondary">כמות</th>
                  <th className="text-right p-4 font-medium text-text-secondary">מחיר יחידה</th>
                  <th className="text-right p-4 font-medium text-text-secondary">סכום</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-border-primary">
                    <td className="p-4 text-text-primary">{item.description}</td>
                    <td className="p-4 text-text-secondary">{item.unit}</td>
                    <td className="p-4 text-text-primary">{item.quantity}</td>
                    <td className="p-4 text-text-primary">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-4 font-medium text-text-primary">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-secondary">
                <tr>
                  <td colSpan={4} className="p-4 text-right font-medium text-text-primary">
                    סכום כולל:
                  </td>
                  <td className="p-4 font-bold text-xl text-primary-600">
                    {formatCurrency(quote.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Terms and Conditions */}
        {quote.terms && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>תנאים והערות</CardTitle>
            </CardHeader>
            <div className="p-6">
              <p className="text-text-primary whitespace-pre-wrap">{quote.terms}</p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/quotes')}
          >
            חזרה לרשימה
          </Button>

          {quote.status === 'accepted' && !quote.projectId && (
            <Button
              onClick={handleConvertToProject}
              loading={convertingToProject}
            >
              המר לפרויקט
            </Button>
          )}

          {quote.projectId && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/projects/${quote.projectId}`)}
            >
              עבור לפרויקט
            </Button>
          )}
        </div>

        {/* Status Update Modal */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="עדכון סטטוס הצעת מחיר"
          actions={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStatusModalOpen(false)}
              >
                ביטול
              </Button>
              <Button
                onClick={handleStatusChange}
                loading={updatingStatus}
              >
                עדכן
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-text-secondary">
              בחר את הסטטוס החדש עבור הצעת מחיר {quote.quoteNumber}:
            </p>
            <div className="space-y-2">
              {(['draft', 'sent', 'accepted', 'rejected', 'expired'] as QuoteStatus[]).map((status) => (
                <label key={status} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={(e) => setSelectedStatus(e.target.value as QuoteStatus)}
                    className="form-radio"
                  />
                  <StatusBadge status={status}>
                    {getStatusText(status)}
                  </StatusBadge>
                </label>
              ))}
            </div>
          </div>
        </Modal>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-error-500 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="mr-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteDetail;