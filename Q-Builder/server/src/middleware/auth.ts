import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken, JwtPayload } from '../utils/jwt';
import { User } from '../models/User';
import { AppError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new AppError('Access token required', 401, 'MISSING_TOKEN');
    }

    const payload: JwtPayload = verifyToken(token);
    
    // Find user in database
    const user = await User.findByPk(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      if (error.message === 'TOKEN_EXPIRED') {
        next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
      } else if (error.message === 'INVALID_TOKEN') {
        next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
      } else {
        next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
      }
    } else {
      next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
    }
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload: JwtPayload = verifyToken(token);
      const user = await User.findByPk(payload.userId);
      
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};