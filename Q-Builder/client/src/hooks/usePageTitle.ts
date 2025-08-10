import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = (customTitle?: string) => {
  const location = useLocation();

  useEffect(() => {
    // Define page titles
    const titleMap: Record<string, string> = {
      '/dashboard': 'לוח בקרה',
      '/quotes': 'הצעות מחיר',
      '/quotes/new': 'הצעת מחיר חדשה',
      '/projects': 'פרויקטים',
      '/clients': 'לקוחות',
      '/clients/new': 'לקוח חדש',
      '/profile': 'פרופיל עסקי',
      '/login': 'התחברות'
    };

    // Handle dynamic routes
    const getPageTitle = (pathname: string): string => {
      // Check for exact match first
      if (titleMap[pathname]) {
        return titleMap[pathname];
      }

      // Handle dynamic routes
      if (pathname.match(/^\/quotes\/\d+$/)) {
        return 'צפייה בהצעת מחיר';
      }

      if (pathname.match(/^\/quotes\/\d+\/edit$/)) {
        return 'עריכת הצעת מחיר';
      }

      if (pathname.match(/^\/projects\/\d+$/)) {
        return 'פרטי פרויקט';
      }

      if (pathname.match(/^\/clients\/\d+$/)) {
        return 'פרטי לקוח';
      }

      if (pathname.match(/^\/clients\/\d+\/edit$/)) {
        return 'עריכת לקוח';
      }

      // Default fallback
      return 'Q-Builder';
    };

    const pageTitle = customTitle || getPageTitle(location.pathname);
    const fullTitle = pageTitle === 'Q-Builder' ? 'Q-Builder' : `${pageTitle} | Q-Builder`;
    
    document.title = fullTitle;
  }, [location.pathname, customTitle]);
};

export default usePageTitle;