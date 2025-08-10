import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Layout Components
import Layout from '../layout/Layout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Auth Pages
import Login from '../../pages/auth/Login';
import OAuthCallback from '../../pages/auth/OAuthCallback';

// Protected Pages
import Dashboard from '../../pages/dashboard/Dashboard';

// Placeholder components for future implementation
const QuotesPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">הצעות מחיר</h1>
    <p className="text-gray-600">עמוד זה יהיה זמין בקרוב</p>
  </div>
);

const ProjectsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">פרויקטים</h1>
    <p className="text-gray-600">עמוד זה יהיה זמין בקרוב</p>
  </div>
);

const ClientsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">לקוחות</h1>
    <p className="text-gray-600">עמוד זה יהיה זמין בקרוב</p>
  </div>
);

const ProfilePage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">פרופיל עסקי</h1>
    <p className="text-gray-600">עמוד זה יהיה זמין בקרוב</p>
  </div>
);

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Quotes Management */}
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="quotes/new" element={<QuotesPage />} />
          <Route path="quotes/:id" element={<QuotesPage />} />
          <Route path="quotes/:id/edit" element={<QuotesPage />} />
          
          {/* Projects Management */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectsPage />} />
          
          {/* Clients Management */}
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientsPage />} />
          <Route path="clients/:id/edit" element={<ClientsPage />} />
          
          {/* Business Profile */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;