import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Define breadcrumb mappings
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    '/dashboard': [
      { label: 'לוח בקרה' }
    ],
    '/quotes': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'הצעות מחיר' }
    ],
    '/quotes/new': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'הצעות מחיר', path: '/quotes' },
      { label: 'הצעת מחיר חדשה' }
    ],
    '/projects': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'פרויקטים' }
    ],
    '/clients': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'לקוחות' }
    ],
    '/clients/new': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'לקוחות', path: '/clients' },
      { label: 'לקוח חדש' }
    ],
    '/profile': [
      { label: 'לוח בקרה', path: '/dashboard' },
      { label: 'פרופיל עסקי' }
    ]
  };

  // Handle dynamic routes (with IDs)
  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    // Check for exact match first
    if (breadcrumbMap[pathname]) {
      return breadcrumbMap[pathname];
    }

    // Handle dynamic routes
    if (pathname.match(/^\/quotes\/\d+$/)) {
      return [
        { label: 'לוח בקרה', path: '/dashboard' },
        { label: 'הצעות מחיר', path: '/quotes' },
        { label: 'צפייה בהצעת מחיר' }
      ];
    }

    if (pathname.match(/^\/quotes\/\d+\/edit$/)) {
      return [
        { label: 'לוח בקרה', path: '/dashboard' },
        { label: 'הצעות מחיר', path: '/quotes' },
        { label: 'עריכת הצעת מחיר' }
      ];
    }

    if (pathname.match(/^\/projects\/\d+$/)) {
      return [
        { label: 'לוח בקרה', path: '/dashboard' },
        { label: 'פרויקטים', path: '/projects' },
        { label: 'פרטי פרויקט' }
      ];
    }

    if (pathname.match(/^\/clients\/\d+$/)) {
      return [
        { label: 'לוח בקרה', path: '/dashboard' },
        { label: 'לקוחות', path: '/clients' },
        { label: 'פרטי לקוח' }
      ];
    }

    if (pathname.match(/^\/clients\/\d+\/edit$/)) {
      return [
        { label: 'לוח בקרה', path: '/dashboard' },
        { label: 'לקוחות', path: '/clients' },
        { label: 'עריכת לקוח' }
      ];
    }

    // Default fallback
    return [{ label: 'לוח בקרה', path: '/dashboard' }];
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show breadcrumbs if there's only one item (current page)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 space-x-reverse">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.path ? (
              <Link
                to={item.path}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;