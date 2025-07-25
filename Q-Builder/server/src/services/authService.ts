import { User, UserCreationAttributes } from '../models/User';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { GoogleOAuthService, GoogleUserInfo } from './googleOAuthService';
import { AppleOAuthService, AppleUserInfo } from './appleOAuthService';
import { MicrosoftOAuthService, MicrosoftUserInfo } from './microsoftOAuthService';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
  address: string;
  professionIds?: number[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any; // Using any to avoid Sequelize model complexity
  token: string;
}

export interface OAuthLoginData {
  idToken?: string;
  code?: string;
  redirectUri?: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new AppError(
        'Password does not meet requirements',
        400,
        'WEAK_PASSWORD',
        passwordValidation.errors
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('User already exists with this email', 409, 'USER_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const userData: UserCreationAttributes = {
      name: data.name,
      email: data.email,
      passwordHash,
      provider: 'local',
      emailVerified: false,
      businessName: data.businessName,
      phone: data.phone,
      address: data.address,
      professionIds: data.professionIds || [],
      vatRate: 0.18,
      notificationSettings: {
        emailEnabled: true,
        quoteExpiry: true,
        paymentReminders: true,
        quoteSent: true
      }
    };

    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Find user by email
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user has a password (local account)
    if (!user.passwordHash) {
      throw new AppError('Please use OAuth to sign in', 401, 'OAUTH_REQUIRED');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async getUserProfile(userId: number): Promise<any> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  static async updateProfile(userId: number, updates: any): Promise<any> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Remove sensitive fields that shouldn't be updated directly
    const { id, email, passwordHash, provider, providerId, createdAt, updatedAt, ...allowedUpdates } = updates;

    await user.update(allowedUpdates);

    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.passwordHash) {
      throw new AppError('Cannot change password for OAuth account', 400, 'OAUTH_ACCOUNT');
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(
        'New password does not meet requirements',
        400,
        'WEAK_PASSWORD',
        passwordValidation.errors
      );
    }

    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);
    await user.update({ passwordHash: newPasswordHash });
  }

  static async googleOAuthLogin(data: OAuthLoginData): Promise<AuthResponse> {
    let googleUserInfo: GoogleUserInfo;

    try {
      if (data.idToken) {
        // Direct ID token verification (for frontend OAuth)
        googleUserInfo = await GoogleOAuthService.verifyIdToken(data.idToken);
      } else if (data.code && data.redirectUri) {
        // Authorization code flow (for backend OAuth)
        const tokens = await GoogleOAuthService.getTokens(data.code, data.redirectUri);
        if (!tokens.access_token) {
          throw new AppError('Failed to get access token from Google', 400, 'GOOGLE_TOKEN_FAILED');
        }
        googleUserInfo = await GoogleOAuthService.getUserInfo(tokens.access_token);
      } else {
        throw new AppError('Either idToken or code with redirectUri is required', 400, 'MISSING_OAUTH_DATA');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Google OAuth authentication failed', 400, 'GOOGLE_OAUTH_FAILED');
    }

    // Check if user already exists
    let user = await User.findOne({ 
      where: { 
        email: googleUserInfo.email 
      } 
    });

    if (user) {
      // User exists - update OAuth info if needed
      if (user.provider !== 'google' || user.providerId !== googleUserInfo.id) {
        await user.update({
          provider: 'google',
          providerId: googleUserInfo.id,
          emailVerified: googleUserInfo.email_verified
        });
      }
    } else {
      // Create new user with Google OAuth data
      const userData: UserCreationAttributes = {
        name: googleUserInfo.name,
        email: googleUserInfo.email,
        provider: 'google',
        providerId: googleUserInfo.id,
        emailVerified: googleUserInfo.email_verified,
        businessName: googleUserInfo.name, // Default to user name, can be updated later
        phone: '', // Will need to be filled in profile
        address: '', // Will need to be filled in profile
        professionIds: [],
        vatRate: 0.18,
        notificationSettings: {
          emailEnabled: true,
          quoteExpiry: true,
          paymentReminders: true,
          quoteSent: true
        }
      };

      user = await User.create(userData);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async appleOAuthLogin(data: OAuthLoginData & { user?: { name?: { firstName?: string; lastName?: string } } }): Promise<AuthResponse> {
    let appleUserInfo: AppleUserInfo;

    try {
      if (data.idToken) {
        // Direct ID token verification (for frontend OAuth)
        appleUserInfo = await AppleOAuthService.verifyIdToken(data.idToken);
      } else if (data.code && data.redirectUri) {
        // Authorization code flow (for backend OAuth)
        const tokens: any = await AppleOAuthService.exchangeCodeForTokens(data.code, data.redirectUri);
        if (!tokens.id_token) {
          throw new AppError('Failed to get ID token from Apple', 400, 'APPLE_TOKEN_FAILED');
        }
        appleUserInfo = await AppleOAuthService.verifyIdToken(tokens.id_token);
      } else {
        throw new AppError('Either idToken or code with redirectUri is required', 400, 'MISSING_OAUTH_DATA');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Apple OAuth authentication failed', 400, 'APPLE_OAUTH_FAILED');
    }

    // Apple might provide user name in the first sign-in request
    let userName = appleUserInfo.name;
    if (!userName && data.user?.name) {
      const { firstName, lastName } = data.user.name;
      userName = [firstName, lastName].filter(Boolean).join(' ') || 'Apple User';
    }
    if (!userName) {
      userName = 'Apple User'; // Fallback name
    }

    // Check if user already exists
    let user = await User.findOne({ 
      where: { 
        email: appleUserInfo.email 
      } 
    });

    if (user) {
      // User exists - update OAuth info if needed
      if (user.provider !== 'apple' || user.providerId !== appleUserInfo.id) {
        await user.update({
          provider: 'apple',
          providerId: appleUserInfo.id,
          emailVerified: appleUserInfo.email_verified
        });
      }
    } else {
      // Create new user with Apple OAuth data
      const userData: UserCreationAttributes = {
        name: userName,
        email: appleUserInfo.email,
        provider: 'apple',
        providerId: appleUserInfo.id,
        emailVerified: appleUserInfo.email_verified,
        businessName: userName, // Default to user name, can be updated later
        phone: '', // Will need to be filled in profile
        address: '', // Will need to be filled in profile
        professionIds: [],
        vatRate: 0.18,
        notificationSettings: {
          emailEnabled: true,
          quoteExpiry: true,
          paymentReminders: true,
          quoteSent: true
        }
      };

      user = await User.create(userData);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async microsoftOAuthLogin(data: OAuthLoginData): Promise<AuthResponse> {
    let microsoftUserInfo: MicrosoftUserInfo;

    try {
      if (data.idToken) {
        // Direct ID token verification (for frontend OAuth)
        microsoftUserInfo = await MicrosoftOAuthService.verifyIdToken(data.idToken);
      } else if (data.code && data.redirectUri) {
        // Authorization code flow (for backend OAuth)
        const tokens = await MicrosoftOAuthService.getTokens(data.code, data.redirectUri);
        if (!tokens.access_token) {
          throw new AppError('Failed to get access token from Microsoft', 400, 'MICROSOFT_TOKEN_FAILED');
        }
        microsoftUserInfo = await MicrosoftOAuthService.getUserInfo(tokens.access_token);
      } else {
        throw new AppError('Either idToken or code with redirectUri is required', 400, 'MISSING_OAUTH_DATA');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Microsoft OAuth authentication failed', 400, 'MICROSOFT_OAUTH_FAILED');
    }

    // Check if user already exists
    let user = await User.findOne({ 
      where: { 
        email: microsoftUserInfo.email 
      } 
    });

    if (user) {
      // User exists - update OAuth info if needed
      if (user.provider !== 'microsoft' || user.providerId !== microsoftUserInfo.id) {
        await user.update({
          provider: 'microsoft',
          providerId: microsoftUserInfo.id,
          emailVerified: microsoftUserInfo.email_verified
        });
      }
    } else {
      // Create new user with Microsoft OAuth data
      const userData: UserCreationAttributes = {
        name: microsoftUserInfo.name,
        email: microsoftUserInfo.email,
        provider: 'microsoft',
        providerId: microsoftUserInfo.id,
        emailVerified: microsoftUserInfo.email_verified,
        businessName: microsoftUserInfo.name, // Default to user name, can be updated later
        phone: '', // Will need to be filled in profile
        address: '', // Will need to be filled in profile
        professionIds: [],
        vatRate: 0.18,
        notificationSettings: {
          emailEnabled: true,
          quoteExpiry: true,
          paymentReminders: true,
          quoteSent: true
        }
      };

      user = await User.create(userData);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async findOrCreateOAuthUser(
    provider: 'google' | 'apple' | 'microsoft',
    providerId: string,
    email: string,
    name: string,
    emailVerified: boolean = false
  ): Promise<User> {
    // Check if user already exists by email
    let user = await User.findOne({ where: { email } });

    if (user) {
      // User exists - update OAuth info if needed
      if (user.provider !== provider || user.providerId !== providerId) {
        await user.update({
          provider,
          providerId,
          emailVerified
        });
      }
      return user;
    }

    // Create new user
    const userData: UserCreationAttributes = {
      name,
      email,
      provider,
      providerId,
      emailVerified,
      businessName: name, // Default to user name
      phone: '', // Will need to be filled in profile
      address: '', // Will need to be filled in profile
      professionIds: [],
      vatRate: 0.18,
      notificationSettings: {
        emailEnabled: true,
        quoteExpiry: true,
        paymentReminders: true,
        quoteSent: true
      }
    };

    return await User.create(userData);
  }
}