import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { GoogleOAuthService } from './services/googleOAuthService';
import { AppleOAuthService } from './services/appleOAuthService';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Initialize OAuth services
    try {
      GoogleOAuthService.initialize();
      logger.info('Google OAuth service initialized');
    } catch (error) {
      logger.warn('Google OAuth service initialization failed:', error);
    }

    try {
      AppleOAuthService.initialize();
      logger.info('Apple OAuth service initialized');
    } catch (error) {
      logger.warn('Apple OAuth service initialization failed:', error);
    }
    
    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Q-Builder API server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();