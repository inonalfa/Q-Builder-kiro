import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import usePageTitle from '../../hooks/usePageTitle';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from '../navigation/Breadcrumb';

const Layout: React.FC = () => {
  const { direction, sidebarOpen, setSidebarOpen } = useUIStore();
  
  // Set page title based on current route
  usePageTitle();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <div className={`min-h-screen bg-gray-50 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:mr-64">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Header */}
          <Header />
          
          {/* Main content area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Breadcrumb />
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;