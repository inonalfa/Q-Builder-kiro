import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import oauthService from '../../services/oauthService';

interface OAuthButtonsProps {
  className?: string;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { addNotification } = useUIStore();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading('google');
      
      // Generate and store state for CSRF protection
      const state = `google:${oauthService.generateState()}`;
      oauthService.storeOAuthState(state);
      
      // Get redirect URL
      const redirectUri = `${window.location.origin}/auth/callback`;
      const authUrl = await oauthService.getGoogleAuthUrl(redirectUri, state);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      addNotification({
        type: 'error',
        message: 'שגיאה בהתחברות עם Google',
        duration: 5000
      });
      setIsLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading('apple');
      
      // Generate and store state for CSRF protection
      const state = `apple:${oauthService.generateState()}`;
      oauthService.storeOAuthState(state);
      
      // Get redirect URL
      const redirectUri = `${window.location.origin}/auth/callback`;
      const authUrl = await oauthService.getAppleAuthUrl(redirectUri, state);
      
      // Redirect to Apple OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Apple OAuth error:', error);
      addNotification({
        type: 'error',
        message: 'שגיאה בהתחברות עם Apple',
        duration: 5000
      });
      setIsLoading(null);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading('microsoft');
      
      // Generate and store state for CSRF protection
      const state = `microsoft:${oauthService.generateState()}`;
      oauthService.storeOAuthState(state);
      
      // Get redirect URL
      const redirectUri = `${window.location.origin}/auth/callback`;
      const authUrl = await oauthService.getMicrosoftAuthUrl(redirectUri, state);
      
      // Redirect to Microsoft OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Microsoft OAuth error:', error);
      addNotification({
        type: 'error',
        message: 'שגיאה בהתחברות עם Microsoft',
        duration: 5000
      });
      setIsLoading(null);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      <button
        type="button"
        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleGoogleLogin}
        disabled={isLoading !== null}
      >
        {isLoading === 'google' ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span className="mr-2">Google</span>
      </button>

      <button
        type="button"
        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAppleLogin}
        disabled={isLoading !== null}
      >
        {isLoading === 'apple' ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.2 2.24c.8-.96 1.32-2.24 1.17-3.55-.03-.13-.06-.26-.1-.38C13.1-.45 11.25.24 10.1 1.2c-.88.73-1.65 1.79-1.44 2.85.02.11.05.22.09.32 1.31-.04 2.58-.82 3.45-1.93zM8.57 6.05c1.25-.15 2.33.7 3.09.7.77 0 1.97-.82 3.33-.7 1.7.1 2.98.99 3.76 2.44-1.52.86-2.55 2.46-2.55 4.32 0 2.21 1.03 4.16 2.53 5.45-.54 1.37-1.17 2.63-2.18 3.75-1.01 1.12-2.1 1.95-3.44 1.95-1.32 0-1.72-.78-3.21-.78-1.49 0-1.97.82-3.21.82-1.24 0-2.35-.73-3.46-2.05C1.9 18.98 1 16.51 1 14.22c0-3.06 1.86-4.72 3.64-4.72 1.35 0 2.5.88 3.36.88.81 0 2.04-.94 3.57-.33z" clipRule="evenodd" />
          </svg>
        )}
        <span className="mr-2">Apple</span>
      </button>

      <button
        type="button"
        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleMicrosoftLogin}
        disabled={isLoading !== null}
      >
        {isLoading === 'microsoft' ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
        )}
        <span className="mr-2">Microsoft</span>
      </button>
    </div>
  );
};

export default OAuthButtons;