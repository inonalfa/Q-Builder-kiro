import apiService from './api';

export interface OAuthResponse {
  authUrl: string;
}

export interface OAuthCallbackParams {
  idToken?: string;
  code?: string;
  redirectUri: string;
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

class OAuthService {
  // Google OAuth methods
  async getGoogleAuthUrl(redirectUri: string, state?: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('redirectUri', redirectUri);
      if (state) {
        params.append('state', state);
      }
      
      const response = await apiService.get<OAuthResponse>(`/auth/google/url?${params.toString()}`);
      return response.data?.authUrl || '';
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      throw error;
    }
  }

  async handleGoogleCallback(params: OAuthCallbackParams) {
    try {
      return await apiService.post('/auth/google/callback', params);
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      throw error;
    }
  }

  // Apple OAuth methods
  async getAppleAuthUrl(redirectUri: string, state?: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('redirectUri', redirectUri);
      if (state) {
        params.append('state', state);
      }
      
      const response = await apiService.get<OAuthResponse>(`/auth/apple/url?${params.toString()}`);
      return response.data?.authUrl || '';
    } catch (error) {
      console.error('Failed to get Apple auth URL:', error);
      throw error;
    }
  }

  async handleAppleCallback(params: OAuthCallbackParams) {
    try {
      return await apiService.post('/auth/apple/callback', params);
    } catch (error) {
      console.error('Apple OAuth callback failed:', error);
      throw error;
    }
  }
  
  // Microsoft OAuth methods
  async getMicrosoftAuthUrl(redirectUri: string, state?: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('redirectUri', redirectUri);
      if (state) {
        params.append('state', state);
      }
      
      const response = await apiService.get<OAuthResponse>(`/auth/microsoft/url?${params.toString()}`);
      return response.data?.authUrl || '';
    } catch (error) {
      console.error('Failed to get Microsoft auth URL:', error);
      throw error;
    }
  }

  async handleMicrosoftCallback(params: OAuthCallbackParams) {
    try {
      return await apiService.post('/auth/microsoft/callback', params);
    } catch (error) {
      console.error('Microsoft OAuth callback failed:', error);
      throw error;
    }
  }

  // Helper method to generate OAuth state
  generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Store OAuth state in session storage for verification
  storeOAuthState(state: string): void {
    sessionStorage.setItem('oauth_state', state);
  }

  // Verify OAuth state from callback
  verifyOAuthState(state: string): boolean {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state'); // Clear state after verification
    return storedState === state;
  }
}

export const oauthService = new OAuthService();
export default oauthService;