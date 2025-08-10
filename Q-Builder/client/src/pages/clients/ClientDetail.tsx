import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useClientStore } from '../../stores/clientStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { 
  Button, 
  Card, 
  CardHeader,
  CardTitle,
  Badge,
  EmptyState
} from '../../components/ui/AppleComponents';

// Icons
const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ClientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const {
    loading,
    error,
    getClientById,
    fetchClients
  } = useClientStore();

  const client = id ? getClientById(parseInt(id, 10)) : null;
  
  usePageTitle(client ? client.name : 'פרטי לקוח');

  useEffect(() => {
    if (!client && !loading) {
      fetchClients();
    }
  }, [client, loading, fetchClients]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    navigate('/clients');
  };

  const handleEdit = () => {
    navigate(`/clients/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div>
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">שגיאה בטעינת פרטי הלקוח</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchClients()}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-6 py-8">
        <EmptyState
          icon={<UserIcon />}
          title="לקוח לא נמצא"
          description="הלקוח המבוקש לא קיים במערכת"
          action={
            <Button onClick={handleBack}>
              חזור לרשימת הלקוחות
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="חזור לרשימת הלקוחות"
          >
            <ArrowRightIcon />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {client.name}
            </h1>
            <p className="text-gray-600">
              פרטי הלקוח ופעילות במערכת
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleEdit}
          className="flex items-center gap-2"
        >
          <EditIcon />
          עריכה
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי קשר</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              {/* Contact Person */}
              {client.contactPerson && (
                <div className="flex items-center gap-3">
                  <UserIcon />
                  <div>
                    <div className="text-sm text-gray-600">איש קשר</div>
                    <div className="font-semibold">{client.contactPerson}</div>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div className="flex items-center gap-3">
                <PhoneIcon />
                <div>
                  <div className="text-sm text-gray-600">טלפון</div>
                  <div className="font-semibold" dir="ltr">{client.phone}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <EmailIcon />
                <div>
                  <div className="text-sm text-gray-600">אימייל</div>
                  <div className="font-semibold" dir="ltr">{client.email}</div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <LocationIcon />
                <div>
                  <div className="text-sm text-gray-600">כתובת</div>
                  <div className="font-semibold">{client.address}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>הערות</CardTitle>
              </CardHeader>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            </Card>
          )}

          {/* Related Quotes and Projects - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>הצעות מחיר ופרויקטים</CardTitle>
            </CardHeader>
            <div className="p-6">
              <EmptyState
                icon={<DocumentIcon />}
                title="אין הצעות מחיר או פרויקטים"
                description="עדיין לא נוצרו הצעות מחיר או פרויקטים עבור לקוח זה"
                action={
                  <div className="flex gap-3">
                    <Link to={`/quotes/new?clientId=${client.id}`}>
                      <Button className="flex items-center gap-2">
                        <DocumentIcon />
                        צור הצעת מחיר
                      </Button>
                    </Link>
                  </div>
                }
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Stats */}
          <Card>
            <CardHeader>
              <CardTitle>סטטיסטיקות</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DocumentIcon />
                  <span className="text-sm text-gray-600">הצעות מחיר</span>
                </div>
                <Badge variant="primary">0</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderIcon />
                  <span className="text-sm text-gray-600">פרויקטים</span>
                </div>
                <Badge variant="success">0</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon />
                  <span className="text-sm text-gray-600">נוצר</span>
                </div>
                <span className="text-sm text-gray-900">
                  {formatDate(client.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>פעולות מהירות</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-3">
              <Link to={`/quotes/new?clientId=${client.id}`} className="block">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <DocumentIcon />
                  צור הצעת מחיר
                </Button>
              </Link>
              
              <Button 
                variant="secondary" 
                className="w-full justify-start gap-2"
                onClick={() => window.open(`tel:${client.phone}`)}
              >
                <PhoneIcon />
                התקשר ללקוח
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full justify-start gap-2"
                onClick={() => window.open(`mailto:${client.email}`)}
              >
                <EmailIcon />
                שלח אימייל
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;