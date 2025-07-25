import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../middleware/errorHandler';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string | undefined;
  email_verified: boolean;
}

export class GoogleOAuthService {
  private static client: OAuth2Client;

  static initialize() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    this.client = new OAuth2Client(clientId, clientSecret);
  }

  static async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      if (!this.client) {
        this.initialize();
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new AppError('Google client ID not configured', 500, 'GOOGLE_CONFIG_ERROR');
      }

      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientId
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AppError('Invalid Google token payload', 400, 'INVALID_TOKEN');
      }

      return {
        id: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture || undefined,
        email_verified: payload.email_verified || false
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to verify Google token', 400, 'GOOGLE_VERIFICATION_FAILED');
    }
  }

  static getAuthUrl(redirectUri: string, state?: string): string {
    if (!this.client) {
      this.initialize();
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrlOptions: any = {
      access_type: 'offline',
      scope: scopes,
      redirect_uri: redirectUri
    };

    if (state) {
      authUrlOptions.state = state;
    }

    return this.client.generateAuthUrl(authUrlOptions);
  }

  static async getTokens(code: string, redirectUri: string) {
    try {
      if (!this.client) {
        this.initialize();
      }

      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: redirectUri
      });

      return tokens;
    } catch (error) {
      throw new AppError('Failed to exchange Google authorization code', 400, 'GOOGLE_TOKEN_EXCHANGE_FAILED');
    }
  }

  static async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      if (!this.client) {
        this.initialize();
      }

      this.client.setCredentials({ access_token: accessToken });
      
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new AppError('Failed to fetch Google user info', 400, 'GOOGLE_USER_INFO_FAILED');
      }

      const userInfo: any = await response.json();
      
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        email_verified: userInfo.verified_email || false
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get Google user info', 400, 'GOOGLE_USER_INFO_FAILED');
    }
  }
}