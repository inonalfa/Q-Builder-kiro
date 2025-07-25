import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import oauthService from '../../services/oauthService';

const OAuthCallback: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const provider = state?.split(':')[0]; // Format: "google:randomState" or "apple:randomState"
        
        // Check for errors from OAuth provider
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }
        
        // Verify state to prevent CSRF
        if (state && !oauthService.verifyOAuthState(state)) {
          throw new Error('Invalid OAuth state');
        }
        
        if (!code) {
          throw new Error('No authorization code received');
        }
        
        if (!provider) {
          throw new Error('Unknown OAuth provider');
        }
        
        // Get the redirect URI that was used for the OAuth request
        const redirectUri = `${window.location.origin}/auth/callback`;
        
        // Process based on provider
        let response;
        if (provider === 'google') {
          response = await oauthService.handleGoogleCallback({ code, redirectUri });
        } else if (provider === 'apple') {
          // For Apple, we might have user data in the form post
          const userDataParam = params.get('user');
          let userData;
          
          if (userDataParam) {
            try {
              userData = JSON.parse(userDataParam);
            } catch (e) {
              console.error('Failed to parse Apple user data:', e);
            }
          }
          
          response = await oauthService.handleAppleCallback({ 
            code, 
            redirectUri,
            user: userData
          });
        } else if (provider === 'microsoft') {
          response = await oauthService.handleMicrosoftCallback({ code, redirectUri });
        } else {
          throw new Error('Unsupported OAuth provider');
        }
        
        // Handle successful login
        if (response.success && response.data) {
          const { user, token } = response.data;
          
          // Store user data and token
          login(user, token);
          
          // Show success notification
          addNotification({
            type: 'success',
            message: 'התחברת בהצלחה למערכת!',
            duration: 3000
          });
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          throw new Error('Failed to authenticate with OAuth provider');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'שגיאה בתהליך ההתחברות');
        
        addNotification({
          type: 'error',
          message: 'שגיאה בתהליך ההתחברות',
          duration: 5000
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processOAuthCallback();
  }, [location, login, navigate, addNotification]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {isProcessing ? (
          <>
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              מעבד את פרטי ההתחברות...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              אנא המתן, אתה תועבר בקרוב
            </p>
          </>
        ) : error ? (
          <>
            <div className="flex justify-center text-red-500">
              <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              שגיאה בתהליך ההתחברות
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              מעביר אותך לעמוד ההתחברות...
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center text-green-500">
              <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              התחברת בהצלחה!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              מעביר אותך למערכת...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;