import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import OAuthButtons from '../../components/auth/OAuthButtons';
import apiService from '../../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addNotification } = useUIStore();

    // Admin credentials
    const ADMIN_EMAIL = 'inonalfa1@gmail.com';
    const ADMIN_PASSWORD = 'Ia04376';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // For demo purposes, check admin credentials first
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Create admin user object
                const adminUser = {
                    id: 1,
                    name: 'אינון אלפא',
                    email: ADMIN_EMAIL,
                    businessName: 'Q-Builder Admin',
                    phone: '+972-50-000-0000',
                    address: 'ישראל',
                    logoUrl: undefined,
                    professionIds: [1, 2, 3], // All professions
                };

                // Generate mock JWT token
                const token = 'admin-jwt-token-' + Date.now();

                // Login user
                login(adminUser, token);

                // Show success notification
                addNotification({
                    type: 'success',
                    message: 'התחברת בהצלחה למערכת!',
                    duration: 3000
                });

                // Navigate to dashboard
                navigate('/dashboard');
                return;
            }
            
            // Otherwise, try to login with the API
            const response = await apiService.login(email, password);
            
            if (response.success && response.data) {
                const { user, token } = response.data as { user: any; token: string };
                
                // Login user
                login(user, token);
                
                // Show success notification
                addNotification({
                    type: 'success',
                    message: 'התחברת בהצלחה למערכת!',
                    duration: 3000
                });
                
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                throw new Error('Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            
            addNotification({
                type: 'error',
                message: error.message || 'שם משתמש או סיסמה שגויים',
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        התחברות למערכת
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Q-Builder - מערכת ניהול הצעות מחיר
                    </p>
                </div>
                
                {/* Demo credentials info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-blue-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-sm font-medium text-blue-800">פרטי התחברות לדמו</h3>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-blue-700 font-mono">📧 {ADMIN_EMAIL}</p>
                        <p className="text-sm text-blue-700 font-mono">🔑 {ADMIN_PASSWORD}</p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                כתובת אימייל
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="כתובת אימייל"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                סיסמה
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="סיסמה"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    מתחבר...
                                </div>
                            ) : (
                                'התחבר'
                            )}
                        </button>
                    </div>
                </form>

                {/* OAuth Section */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">או התחבר באמצעות</span>
                        </div>
                    </div>

                    <OAuthButtons className="mt-6" />
                </div>

                {/* Registration Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        עדיין אין לך חשבון?{' '}
                        <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                            onClick={() => addNotification({ type: 'info', message: 'הרשמה תהיה זמינה בקרוב', duration: 3000 })}
                        >
                            הירשם כאן
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;