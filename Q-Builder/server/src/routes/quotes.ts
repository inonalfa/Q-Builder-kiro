import { Router } from 'express';
import { QuoteController } from '../controllers/quoteController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createQuoteSchema,
  updateQuoteSchema,
  quoteParamsSchema,
  quoteQuerySchema,
  updateQuoteStatusSchema
} from '../validation/quotes';

const router = Router();

// All quote routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/quotes
 * @desc    Get all quotes with search and pagination
 * @access  Private
 */
router.get(
  '/',
  validateRequest(quoteQuerySchema),
  QuoteController.getQuotes
);

/**
 * @route   GET /api/v1/quotes/expiring
 * @desc    Get quotes expiring soon
 * @access  Private
 */
router.get('/expiring', QuoteController.getExpiringQuotes);

/**
 * @route   GET /api/v1/quotes/:id
 * @desc    Get a single quote by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest(quoteParamsSchema),
  QuoteController.getQuoteById
);

/**
 * @route   POST /api/v1/quotes
 * @desc    Create a new quote
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createQuoteSchema),
  QuoteController.createQuote
);

/**
 * @route   PUT /api/v1/quotes/:id
 * @desc    Update a quote
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest({ ...quoteParamsSchema, ...updateQuoteSchema }),
  QuoteController.updateQuote
);

/**
 * @route   PATCH /api/v1/quotes/:id/status
 * @desc    Update quote status
 * @access  Private
 */
router.patch(
  '/:id/status',
  validateRequest({ ...quoteParamsSchema, ...updateQuoteStatusSchema }),
  QuoteController.updateQuoteStatus
);

/**
 * @route   POST /api/v1/quotes/:id/accept
 * @desc    Accept a quote (shortcut for status update)
 * @access  Private
 */
router.post(
  '/:id/accept',
  validateRequest(quoteParamsSchema),
  QuoteController.acceptQuote
);

/**
 * @route   POST /api/v1/quotes/:id/send
 * @desc    Send a quote (shortcut for status update)
 * @access  Private
 */
router.post(
  '/:id/send',
  validateRequest(quoteParamsSchema),
  QuoteController.sendQuote
);

/**
 * @route   DELETE /api/v1/quotes/:id
 * @desc    Delete a quote
 * @access  Private
 */
router.delete(
  '/:id',
  validateRequest(quoteParamsSchema),
  QuoteController.deleteQuote
);

export default router;