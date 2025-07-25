import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { GoogleOAuthService } from '../services/googleOAuthService';
import { AppleOAuthService } from '../services/appleOAuthService';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const user = await AuthService.getUserProfile(req.userId);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const user = await AuthService.updateProfile(req.userId, req.body);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400, 'MISSING_PASSWORDS');
      }

      await AuthService.changePassword(req.userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // For JWT, logout is handled client-side by removing the token
      // In the future, we could implement token blacklisting here
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleOAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken, code, redirectUri } = req.body;
      
      if (!idToken && (!code || !redirectUri)) {
        throw new AppError('Either idToken or code with redirectUri is required', 400, 'MISSING_OAUTH_DATA');
      }

      const result = await AuthService.googleOAuthLogin({ idToken, code, redirectUri });
      
      res.json({
        success: true,
        message: 'Google OAuth login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { redirectUri, state } = req.query;
      
      if (!redirectUri || typeof redirectUri !== 'string') {
        throw new AppError('redirectUri is required', 400, 'MISSING_REDIRECT_URI');
      }

      const authUrl = GoogleOAuthService.getAuthUrl(redirectUri, state as string);
      
      res.json({
        success: true,
        data: { authUrl }
      });
    } catch (error) {
      next(error);
    }
  }

  static async appleOAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken, code, redirectUri, user } = req.body;
      
      if (!idToken && (!code || !redirectUri)) {
        throw new AppError('Either idToken or code with redirectUri is required', 400, 'MISSING_OAUTH_DATA');
      }

      const result = await AuthService.appleOAuthLogin({ idToken, code, redirectUri, user });
      
      res.json({
        success: true,
        message: 'Apple OAuth login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async appleAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { redirectUri, state } = req.query;
      
      if (!redirectUri || typeof redirectUri !== 'string') {
        throw new AppError('redirectUri is required', 400, 'MISSING_REDIRECT_URI');
      }

      const authUrl = AppleOAuthService.getAuthUrl(redirectUri, state as string);
      
      res.json({
        success: true,
        data: { authUrl }
      });
    } catch (error) {
      next(error);
    }
  }
}