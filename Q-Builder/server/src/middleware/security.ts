import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config';

// CORS configuration
export const corsOptions = {
  origin: config.env === 'development' 
    ? ['http://localhost:5173', 'http://localhost:3000'] 
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Helmet security configuration
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
};

export const corsMiddleware = cors(corsOptions);
export const helmetMiddleware = helmet(helmetOptions);