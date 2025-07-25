import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { authRateLimitMiddleware } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, updateProfileSchema, googleOAuthSchema, googleAuthUrlSchema, appleOAuthSchema, appleAuthUrlSchema } from '../validation/auth';

const router = Router();

// Public routes with rate limiting
router.post('/register', 
  authRateLimitMiddleware,
  validateRequest(registerSchema),
  AuthController.register
);

router.post('/login',
  authRateLimitMiddleware,
  validateRequest(loginSchema),
  AuthController.login
);

// Protected routes
router.get('/me',
  authenticateToken,
  AuthController.getProfile
);

router.put('/profile',
  authenticateToken,
  validateRequest(updateProfileSchema),
  AuthController.updateProfile
);

router.post('/change-password',
  authenticateToken,
  authRateLimitMiddleware,
  AuthController.changePassword
);

router.post('/logout',
  authenticateToken,
  AuthController.logout
);

// Google OAuth routes
router.get('/google/url',
  validateRequest(googleAuthUrlSchema),
  AuthController.googleAuthUrl
);

router.post('/google/callback',
  authRateLimitMiddleware,
  validateRequest(googleOAuthSchema),
  AuthController.googleOAuth
);

// Apple OAuth routes
router.get('/apple/url',
  validateRequest(appleAuthUrlSchema),
  AuthController.appleAuthUrl
);

router.post('/apple/callback',
  authRateLimitMiddleware,
  validateRequest(appleOAuthSchema),
  AuthController.appleOAuth
);

export default router;