import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../../stores/projectStore';
import { useClientStore } from '../../stores/clientStore';
import usePageTitle from '../../hooks/usePageTitle';
import type { Project, ProjectStatus } from '../../types';

const ProjectList: React.FC = () => {
  usePageTitle('פרויקטים');
  
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects, 
    clearError 
  } = useProjectStore();
  
  const { clients, fetchClients } = useClientStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'לקוח לא ידוע';
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

  const calculateProjectBalance = (project: Project) => {
    const totalPaid = project.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return project.budget - totalPaid;
  };

  const getProgressPercentage = (project: Project) => {
    if (project.budget === 0) return 0;
    const totalPaid = project.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return Math.min((totalPaid / project.budget) * 100, 100);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getClientName(project.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">פרויקטים</h1>
          <p className="text-gray-600 mt-1">נהל את הפרויקטים הפעילים שלך</p>
        </div>
        <Link
          to="/projects/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          פרויקט חדש
        </Link>
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">חיפוש פרויקטים</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="חיפוש לפי שם פרויקט או לקוח..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="status-filter" className="sr-only">סינון לפי סטטוס</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="completed">הושלם</option>
              <option value="cancelled">בוטל</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">אין פרויקטים</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'לא נמצאו פרויקטים התואמים לחיפוש'
              : 'התחל על ידי יצירת פרויקט חדש'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Link
                to="/projects/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                פרויקט חדש
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const balance = calculateProjectBalance(project);
            const progress = getProgressPercentage(project);
            
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      לקוח: {getClientName(project.clientId)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>התקדמות תשלומים</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">תקציב:</span>
                    <span className="font-medium">₪{project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">נותר לתשלום:</span>
                    <span className={`font-medium ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      ₪{balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">תשלומים:</span>
                    <span className="font-medium">{project.payments.length}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      נוצר: {new Date(project.createdAt).toLocaleDateString('he-IL')}
                    </span>
                    <div className="flex items-center text-indigo-600">
                      <span className="text-sm font-medium">פרטים</span>
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {filteredProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">סיכום פרויקטים</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {filteredProjects.length}
              </div>
              <div className="text-sm text-gray-600">סה"כ פרויקטים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredProjects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">פעילים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredProjects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">הושלמו</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₪{filteredProjects.reduce((sum, p) => sum + calculateProjectBalance(p), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">יתרת חוב</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;