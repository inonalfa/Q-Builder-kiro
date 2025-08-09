import { Request, Response, NextFunction } from 'express';
import { QuoteService } from '../services/quoteService';
import { PDFService } from '../services/pdfService';
import { PDFCacheService } from '../services/pdfCacheService';
import { AppError } from '../middleware/errorHandler';

export class QuoteController {
  /**
   * Get all quotes with search and pagination
   */
  static async getQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { 
        search, 
        status, 
        clientId, 
        fromDate, 
        toDate, 
        page, 
        limit, 
        sortBy, 
        sortOrder 
      } = req.query;

      const options: any = {};
      if (search) options.search = search as string;
      if (status) options.status = status;
      if (clientId) options.clientId = parseInt(clientId as string);
      if (fromDate) options.fromDate = new Date(fromDate as string);
      if (toDate) options.toDate = new Date(toDate as string);
      if (page) options.page = parseInt(page as string);
      if (limit) options.limit = parseInt(limit as string);
      if (sortBy) options.sortBy = sortBy;
      if (sortOrder) options.sortOrder = sortOrder;

      const result = await QuoteService.getQuotes(userId, options);

      res.json({
        success: true,
        data: result,
        message: 'Quotes retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single quote by ID
   */
  static async getQuoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);

      const quote = await QuoteService.getQuoteById(userId, quoteId);

      res.json({
        success: true,
        data: quote,
        message: 'Quote retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new quote
   */
  static async createQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteData = req.body;

      const quote = await QuoteService.createQuote(userId, quoteData);

      res.status(201).json({
        success: true,
        data: quote,
        message: 'Quote created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a quote
   */
  static async updateQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);
      const updateData = req.body;

      const quote = await QuoteService.updateQuote(userId, quoteId, updateData);

      res.json({
        success: true,
        data: quote,
        message: 'Quote updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update quote status
   */
  static async updateQuoteStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);
      const { status } = req.body;

      const quote = await QuoteService.updateQuoteStatus(userId, quoteId, status);

      res.json({
        success: true,
        data: quote,
        message: `Quote status updated to ${status}`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a quote
   */
  static async deleteQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);

      await QuoteService.deleteQuote(userId, quoteId);

      res.json({
        success: true,
        message: 'Quote deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get quotes expiring soon
   */
  static async getExpiringQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { days } = req.query;
      const daysAhead = days ? parseInt(days as string) : 3;

      const quotes = await QuoteService.getExpiringQuotes(userId, daysAhead);

      res.json({
        success: true,
        data: quotes,
        message: 'Expiring quotes retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept a quote (shortcut for status update)
   */
  static async acceptQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);

      const quote = await QuoteService.updateQuoteStatus(userId, quoteId, 'accepted');

      res.json({
        success: true,
        data: quote,
        message: 'Quote accepted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send a quote (shortcut for status update)
   */
  static async sendQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);

      const quote = await QuoteService.updateQuoteStatus(userId, quoteId, 'sent');

      res.json({
        success: true,
        data: quote,
        message: 'Quote sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate and download quote PDF with caching and proper error handling
   */
  static async generateQuotePDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const quoteId = parseInt(req.params.id);

      // Validate quote ID
      if (isNaN(quoteId) || quoteId <= 0) {
        throw new AppError('Invalid quote ID', 400, 'INVALID_QUOTE_ID');
      }

      // Get quote basic info first to check if it exists and get updatedAt
      const quote = await QuoteService.getQuoteById(userId, quoteId);
      
      if (!quote) {
        throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
      }

      let pdfBuffer: Buffer;

      // Check if PDF is cached
      const cachedPDF = PDFCacheService.getCachedPDF(userId, quoteId, quote.updatedAt);
      
      if (cachedPDF) {
        console.log(`Using cached PDF for quote ${quoteId}`);
        pdfBuffer = cachedPDF;
      } else {
        console.log(`Generating new PDF for quote ${quoteId}`);
        
        // Get full quote data for PDF generation
        const quoteData = await QuoteService.getQuoteForPDF(userId, quoteId);

        // Generate PDF buffer
        pdfBuffer = await PDFService.generateQuotePDF(quoteData);

        // Cache the generated PDF
        PDFCacheService.cachePDF(userId, quoteId, quote.updatedAt, pdfBuffer);
      }

      // Generate safe filename
      const safeQuoteNumber = quote.quoteNumber.replace(/[^a-zA-Z0-9\-_]/g, '_');
      const filename = `quote-${safeQuoteNumber}.pdf`;

      // Set response headers for PDF download with proper content type
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Send PDF buffer
      res.send(pdfBuffer);
      
    } catch (error) {
      // Handle specific PDF generation errors
      if (error instanceof Error) {
        if (error.message.includes('PDF generation')) {
          next(new AppError('Failed to generate PDF document', 500, 'PDF_GENERATION_FAILED'));
        } else if (error.message.includes('font')) {
          next(new AppError('PDF font loading error', 500, 'PDF_FONT_ERROR'));
        } else {
          next(error);
        }
      } else {
        next(new AppError('Unknown error during PDF generation', 500, 'UNKNOWN_PDF_ERROR'));
      }
    }
  }
}