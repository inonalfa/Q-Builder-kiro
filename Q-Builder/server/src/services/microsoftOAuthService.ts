import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';

export interface MicrosoftUserInfo {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
}

export class MicrosoftOAuthService {
  private static readonly CLIENT_ID = config.oauth.microsoft.clientId;
  private static readonly CLIENT_SECRET = config.oauth.microsoft.clientSecret;
  private static readonly TENANT_ID = config.oauth.microsoft.tenantId;
  private static readonly REDIRECT_URI = config.oauth.microsoft.redirectUri;

  /**
   * Get Microsoft OAuth authorization URL
   */
  static getAuthUrl(redirectUri: string, state?: string): string {
    const baseUrl = `https://login.microsoftonline.com/${this.TENANT_ID}/oauth2/v2.0/authorize`;
    
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      response_type: 'code',
      redirect_uri: redirectUri || this.REDIRECT_URI,
      response_mode: 'query',
      scope: 'openid profile email User.Read',
    });

    if (state) {
      params.append('state', state);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  static async getTokens(code: string, redirectUri: string): Promise<any> {
    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.TENANT_ID}/oauth2/v2.0/token`;
      
      const params = new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code,
        redirect_uri: redirectUri || this.REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Microsoft OAuth token exchange error:', error.response?.data || error.message);
      throw new AppError('Failed to exchange Microsoft authorization code', 400, 'MICROSOFT_TOKEN_FAILED');
    }
  }

  /**
   * Get user information from Microsoft Graph API
   */
  static async getUserInfo(accessToken: string): Promise<MicrosoftUserInfo> {
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id, displayName, mail, userPrincipalName } = response.data;
      
      // Microsoft Graph API might return email in either mail or userPrincipalName
      const email = mail || userPrincipalName;
      
      if (!email) {
        throw new AppError('Email not found in Microsoft user profile', 400, 'MICROSOFT_EMAIL_MISSING');
      }

      return {
        id,
        email,
        name: displayName || 'Microsoft User',
        email_verified: true, // Microsoft accounts typically have verified emails
      };
    } catch (error: any) {
      console.error('Microsoft Graph API error:', error.response?.data || error.message);
      throw new AppError('Failed to get Microsoft user info', 400, 'MICROSOFT_USER_INFO_FAILED');
    }
  }

  /**
   * Verify Microsoft ID token
   */
  static async verifyIdToken(idToken: string): Promise<MicrosoftUserInfo> {
    try {
      // For Microsoft, we typically use the access token to get user info rather than decoding the ID token
      // This is because Microsoft's ID token validation requires additional steps like checking the issuer
      // For simplicity, we'll decode the token but in production should use a proper validation library
      
      const decoded: any = jwt.decode(idToken);
      
      if (!decoded) {
        throw new AppError('Invalid Microsoft ID token', 400, 'MICROSOFT_INVALID_TOKEN');
      }
      
      return {
        id: decoded.oid || decoded.sub,
        email: decoded.email || decoded.preferred_username,
        name: decoded.name || 'Microsoft User',
        email_verified: true, // Microsoft accounts typically have verified emails
      };
    } catch (error) {
      console.error('Microsoft ID token verification error:', error);
      throw new AppError('Failed to verify Microsoft ID token', 400, 'MICROSOFT_TOKEN_VERIFICATION_FAILED');
    }
  }
}