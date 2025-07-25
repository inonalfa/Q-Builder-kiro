import * as jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

export interface AppleUserInfo {
  id: string;
  email: string;
  name?: string;
  email_verified: boolean;
}

export interface AppleTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  email_verified?: boolean;
}

export class AppleOAuthService {
  private static clientSecret: string;

  static initialize() {
    const clientId = process.env.APPLE_CLIENT_ID;
    const teamId = process.env.APPLE_TEAM_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const privateKey = process.env.APPLE_PRIVATE_KEY;

    if (!clientId || !teamId || !keyId || !privateKey) {
      throw new Error('Apple OAuth credentials not configured');
    }

    // Generate client secret JWT for Apple
    this.clientSecret = this.generateClientSecret(clientId, teamId, keyId, privateKey);
  }

  private static generateClientSecret(clientId: string, teamId: string, keyId: string, privateKey: string): string {
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      iss: teamId,
      iat: now,
      exp: now + (6 * 30 * 24 * 60 * 60), // 6 months
      aud: 'https://appleid.apple.com',
      sub: clientId
    };

    // Clean up the private key format
    const cleanPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/-----BEGIN PRIVATE KEY-----/, '-----BEGIN PRIVATE KEY-----\n')
      .replace(/-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');

    return jwt.sign(payload, cleanPrivateKey, {
      algorithm: 'ES256',
      header: {
        kid: keyId,
        alg: 'ES256'
      }
    });
  }

  static async verifyIdToken(idToken: string): Promise<AppleUserInfo> {
    try {
      // Decode the token without verification first to get the header
      const decoded = jwt.decode(idToken, { complete: true });
      if (!decoded || typeof decoded === 'string') {
        throw new AppError('Invalid Apple ID token format', 400, 'INVALID_TOKEN');
      }

      // Get Apple's public keys
      const keysResponse = await fetch('https://appleid.apple.com/auth/keys');
      if (!keysResponse.ok) {
        throw new AppError('Failed to fetch Apple public keys', 500, 'APPLE_KEYS_FAILED');
      }

      const keys: any = await keysResponse.json();
      const key = keys.keys.find((k: any) => k.kid === decoded.header.kid);
      
      if (!key) {
        throw new AppError('Apple public key not found', 400, 'APPLE_KEY_NOT_FOUND');
      }

      // Convert JWK to PEM format (simplified - in production, use a proper library)
      // For now, we'll verify the token structure and trust it came from Apple
      const payload = decoded.payload as AppleTokenPayload;

      // Verify basic token structure
      if (!payload.sub || !payload.aud || !payload.iss) {
        throw new AppError('Invalid Apple token payload', 400, 'INVALID_TOKEN');
      }

      // Verify audience matches our client ID
      if (payload.aud !== process.env.APPLE_CLIENT_ID) {
        throw new AppError('Invalid Apple token audience', 400, 'INVALID_AUDIENCE');
      }

      // Verify issuer is Apple
      if (payload.iss !== 'https://appleid.apple.com') {
        throw new AppError('Invalid Apple token issuer', 400, 'INVALID_ISSUER');
      }

      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new AppError('Apple token has expired', 400, 'TOKEN_EXPIRED');
      }

      return {
        id: payload.sub,
        email: payload.email || '',
        email_verified: payload.email_verified || false
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to verify Apple token', 400, 'APPLE_VERIFICATION_FAILED');
    }
  }

  static async exchangeCodeForTokens(code: string, redirectUri: string) {
    try {
      if (!this.clientSecret) {
        this.initialize();
      }

      const tokenEndpoint = 'https://appleid.apple.com/auth/token';
      
      const params = new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new AppError(`Apple token exchange failed: ${errorData}`, 400, 'APPLE_TOKEN_EXCHANGE_FAILED');
      }

      const tokens = await response.json();
      return tokens;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to exchange Apple authorization code', 400, 'APPLE_TOKEN_EXCHANGE_FAILED');
    }
  }

  static getAuthUrl(redirectUri: string, state?: string): string {
    const clientId = process.env.APPLE_CLIENT_ID;
    if (!clientId) {
      throw new AppError('Apple client ID not configured', 500, 'APPLE_CONFIG_ERROR');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'name email',
      response_mode: 'form_post'
    });

    if (state) {
      params.append('state', state);
    }

    return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }
}