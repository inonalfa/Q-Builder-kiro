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
import ClientList from '../../pages/clients/ClientList';
import ClientForm from '../../pages/clients/ClientForm';
import ClientDetail from '../../pages/clients/ClientDetail';
import QuoteList from '../../pages/quotes/QuoteList';
import QuoteForm from '../../pages/quotes/QuoteForm';
import QuoteDetail from '../../pages/quotes/QuoteDetail';
import ProjectList from '../../pages/projects/ProjectList';
import ProjectDetail from '../../pages/projects/ProjectDetail';
import { BusinessProfile } from '../../pages/profile';

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
          <Route path="quotes" element={<QuoteList />} />
          <Route path="quotes/new" element={<QuoteForm />} />
          <Route path="quotes/:id" element={<QuoteDetail />} />
          <Route path="quotes/:id/edit" element={<QuoteForm />} />
          
          {/* Projects Management */}
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          
          {/* Clients Management */}
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />
          
          {/* Business Profile */}
          <Route path="profile" element={<BusinessProfile />} />
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