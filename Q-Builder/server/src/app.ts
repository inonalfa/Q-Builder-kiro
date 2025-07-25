import express from 'express';
import { corsMiddleware, helmetMiddleware } from './middleware/security';
import { rateLimitMiddleware } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import professionRoutes from './routes/professions';
import catalogRoutes from './routes/catalog';
// import clientRoutes from './routes/clients';
// import quoteRoutes from './routes/quotes';
// import projectRoutes from './routes/projects';

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimitMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Q-Builder API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/professions', professionRoutes);
app.use('/api/v1/catalog', catalogRoutes);
// app.use('/api/v1/clients', clientRoutes);
// app.use('/api/v1/quotes', quoteRoutes);
// app.use('/api/v1/projects', projectRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;