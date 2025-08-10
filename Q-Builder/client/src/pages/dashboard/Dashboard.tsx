import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { formatCurrency } from '../../utils/hebrew';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();

  const stats = [
    {
      id: 'quotes',
      title: 'הצעות מחיר',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue',
      description: 'הצעות פעילות החודש'
    },
    {
      id: 'projects',
      title: 'פרויקטים',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'green',
      description: 'פרויקטים פעילים'
    },
    {
      id: 'clients',
      title: 'לקוחות',
      value: '24',
      change: '+5',
      changeType: 'increase',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'purple',
      description: 'סה"כ לקוחות רשומים'
    },
    {
      id: 'revenue',
      title: 'הכנסות',
      value: formatCurrency(125000),
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'yellow',
      description: 'הכנסות החודש'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quote',
      title: 'הצעת מחיר חדשה נוצרה',
      description: 'הצעת מחיר Q-2024-001 ללקוח יוסי כהן',
      time: 'לפני 2 שעות',
      icon: '📄'
    },
    {
      id: 2,
      type: 'project',
      title: 'פרויקט הושלם',
      description: 'פרויקט P-2024-003 - שיפוץ דירה',
      time: 'לפני 4 שעות',
      icon: '✅'
    },
    {
      id: 3,
      type: 'payment',
      title: 'תשלום התקבל',
      description: 'תשלום של ₪15,000 מלקוח רחל לוי',
      time: 'לפני יום',
      icon: '💰'
    },
    {
      id: 4,
      type: 'client',
      title: 'לקוח חדש נוסף',
      description: 'דוד אברהם נוסף כלקוח חדש',
      time: 'לפני יומיים',
      icon: '👤'
    }
  ];

  const quickActions = [
    {
      id: 'new-quote',
      title: 'הצעת מחיר חדשה',
      description: 'צור הצעת מחיר חדשה ללקוח',
      icon: '📝',
      color: 'blue'
    },
    {
      id: 'add-client',
      title: 'הוסף לקוח',
      description: 'הוסף לקוח חדש למערכת',
      icon: '👥',
      color: 'green'
    },
    {
      id: 'view-projects',
      title: 'צפה בפרויקטים',
      description: 'נהל את הפרויקטים הפעילים',
      icon: '🏗️',
      color: 'purple'
    },
    {
      id: 'add-payment',
      title: 'רשום תשלום',
      description: 'רשום תשלום שהתקבל',
      icon: '💳',
      color: 'yellow'
    }
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new-quote':
        navigate('/quotes/new');
        break;
      case 'add-client':
        navigate('/clients/new');
        break;
      case 'view-projects':
        navigate('/projects');
        break;
      case 'add-payment':
        addNotification({
          type: 'info',
          message: 'רישום תשלום יהיה זמין בקרוב',
          duration: 3000
        });
        break;
      default:
        addNotification({
          type: 'info',
          message: 'פונקציה זו תהיה זמינה בקרוב',
          duration: 3000
        });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              שלום {user?.name || 'משתמש'}! 👋
            </h1>
            <p className="text-indigo-100">
              ברוך הבא למערכת ניהול העסק שלך - {user?.businessName}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 mr-2">{stat.description}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="w-full text-right p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <span className="text-2xl ml-3">{action.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-700">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">פעילות אחרונה</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                צפה בהכל
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-yellow-600 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">התראות חשובות</h4>
            <p className="text-sm text-yellow-700 mt-1">
              יש לך 2 הצעות מחיר שפגות בעוד 3 ימים • תשלום של ₪25,000 ממתין לגביה
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;