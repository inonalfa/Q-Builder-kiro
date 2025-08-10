import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../../stores/projectStore';
import { useClientStore } from '../../stores/clientStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import usePageTitle from '../../hooks/usePageTitle';
import PaymentForm from '../../components/projects/PaymentForm';
import PaymentList from '../../components/projects/PaymentList';
import ProjectStatusModal from '../../components/projects/ProjectStatusModal';
import type { ProjectStatus } from '../../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const projectId = parseInt(id || '0');
  
  const { 
    selectedProject: project, 
    loading, 
    error, 
    fetchProject, 
    updateProject,
    clearError 
  } = useProjectStore();
  
  const { clients, fetchClients } = useClientStore();
  const { quotes, fetchQuotes } = useQuoteStore();
  const { addNotification } = useUIStore();
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  usePageTitle(project ? `פרויקט: ${project.name}` : 'פרטי פרויקט');

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchClients();
      fetchQuotes();
    }
  }, [projectId, fetchProject, fetchClients, fetchQuotes]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const getClient = () => {
    if (!project) return null;
    return clients.find(c => c.id === project.clientId);
  };

  const getOriginQuote = () => {
    if (!project?.originQuoteId) return null;
    return quotes.find(q => q.id === project.originQuoteId);
  };

  const calculateTotalPaid = () => {
    if (!project) return 0;
    return project.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateBalance = () => {
    if (!project) return 0;
    return project.budget - calculateTotalPaid();
  };

  const getProgressPercentage = () => {
    if (!project || project.budget === 0) return 0;
    return Math.min((calculateTotalPaid() / project.budget) * 100, 100);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'completed':
        return 'הושלם';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!project) return;
    
    try {
      await updateProject(project.id, { status: newStatus });
      addNotification({
        type: 'success',
        message: 'סטטוס הפרויקט עודכן בהצלחה',
        duration: 3000
      });
      setShowStatusModal(false);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'שגיאה בעדכון סטטוס הפרויקט',
        duration: 5000
      });
    }
  };

  if (loading && !project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">פרויקט לא נמצא</h3>
        <p className="mt-1 text-sm text-gray-500">הפרויקט המבוקש אינו קיים או שאין לך הרשאה לצפות בו</p>
        <div className="mt-6">
          <Link
            to="/projects"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            חזרה לרשימת הפרויקטים
          </Link>
        </div>
      </div>
    );
  }

  const client = getClient();
  const originQuote = getOriginQuote();
  const totalPaid = calculateTotalPaid();
  const balance = calculateBalance();
  const progress = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link
              to="/projects"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>
          <p className="text-gray-600">
            לקוח: {client?.name || 'לקוח לא ידוע'} • נוצר: {new Date(project.createdAt).toLocaleDateString('he-IL')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            עדכן סטטוס
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            הוסף תשלום
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="mr-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי הפרויקט</h2>
            <div className="space-y-4">
              {project.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                  <p className="text-gray-900">{project.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תאריך התחלה</label>
                  <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString('he-IL')}</p>
                </div>
                {project.endDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תאריך סיום</label>
                    <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString('he-IL')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          {client && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי הלקוח</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם</label>
                  <p className="text-gray-900">{client.name}</p>
                </div>
                {client.contactPerson && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">איש קשר</label>
                    <p className="text-gray-900">{client.contactPerson}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <p className="text-gray-900">{client.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                  <p className="text-gray-900">{client.address}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to={`/clients/${client.id}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  צפה בפרטי הלקוח המלאים →
                </Link>
              </div>
            </div>
          )}

          {/* Origin Quote */}
          {originQuote && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הצעת מחיר מקורית</h2>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900 font-medium">{originQuote.title}</p>
                  <p className="text-sm text-gray-600">מספר הצעה: {originQuote.quoteNumber}</p>
                  <p className="text-sm text-gray-600">
                    תאריך הנפקה: {new Date(originQuote.issueDate).toLocaleDateString('he-IL')}
                  </p>
                  <p className="text-sm text-gray-600">
                    סכום: ₪{originQuote.totalAmount.toLocaleString()}
                  </p>
                </div>
                <Link
                  to={`/quotes/${originQuote.id}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  צפה בהצעה →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">סיכום כספי</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">תקציב פרויקט:</span>
                <span className="font-semibold text-gray-900">₪{project.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">סה"כ שולם:</span>
                <span className="font-semibold text-green-600">₪{totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">יתרה:</span>
                <span className={`font-semibold ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  ₪{balance.toLocaleString()}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>התקדמות תשלומים</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">סטטיסטיקות</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">מספר תשלומים:</span>
                <span className="font-semibold">{project.payments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">תשלום ממוצע:</span>
                <span className="font-semibold">
                  ₪{project.payments.length > 0 ? (totalPaid / project.payments.length).toLocaleString() : '0'}
                </span>
              </div>
              {project.payments.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">תשלום אחרון:</span>
                  <span className="font-semibold">
                    {new Date(Math.max(...project.payments.map(p => new Date(p.date).getTime()))).toLocaleDateString('he-IL')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <PaymentList 
        projectId={project.id} 
        payments={project.payments}
        onPaymentUpdate={() => fetchProject(project.id)}
      />

      {/* Modals */}
      {showPaymentForm && (
        <PaymentForm
          projectId={project.id}
          onClose={() => setShowPaymentForm(false)}
          onSuccess={() => {
            setShowPaymentForm(false);
            fetchProject(project.id);
          }}
        />
      )}

      {showStatusModal && (
        <ProjectStatusModal
          currentStatus={project.status}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default ProjectDetail;