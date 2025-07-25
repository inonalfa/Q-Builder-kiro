import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config';
import { AppError } from './errorHandler';

// General API rate limiter
const apiLimiter = new RateLimiterMemory({
  points: config.rateLimit.maxRequests,
  duration: config.rateLimit.windowMs / 1000, // Convert to seconds
});

// Strict rate limiter for authentication endpoints
const authLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // 15 minutes
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await apiLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    throw new AppError(
      'Too many requests, please try again later',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
};

export const authRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    throw new AppError(
      'Too many authentication attempts, please try again later',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  }
};