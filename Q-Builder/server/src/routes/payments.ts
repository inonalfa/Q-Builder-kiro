import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentParamsSchema,
  projectPaymentParamsSchema,
  paymentQuerySchema
} from '../validation/payments';

const router = Router();

// All payment routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/payments
 * @desc    Get all payments for a user (across all projects)
 * @access  Private
 */
router.get(
  '/',
  validateRequest(paymentQuerySchema),
  PaymentController.getUserPayments
);

/**
 * @route   GET /api/v1/payments/methods
 * @desc    Get payment methods used by user
 * @access  Private
 */
router.get('/methods', PaymentController.getPaymentMethods);

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get a single payment by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest(paymentParamsSchema),
  PaymentController.getPaymentById
);

/**
 * @route   PUT /api/v1/payments/:id
 * @desc    Update a payment
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest({ ...paymentParamsSchema, ...updatePaymentSchema }),
  PaymentController.updatePayment
);

/**
 * @route   DELETE /api/v1/payments/:id
 * @desc    Delete a payment
 * @access  Private
 */
router.delete(
  '/:id',
  validateRequest(paymentParamsSchema),
  PaymentController.deletePayment
);

/**
 * @route   GET /api/v1/projects/:projectId/payments
 * @desc    Get all payments for a project
 * @access  Private
 */
router.get(
  '/projects/:projectId',
  validateRequest({ ...projectPaymentParamsSchema, ...paymentQuerySchema }),
  PaymentController.getProjectPayments
);

/**
 * @route   POST /api/v1/projects/:projectId/payments
 * @desc    Create a new payment for a project
 * @access  Private
 */
router.post(
  '/projects/:projectId',
  validateRequest({ ...projectPaymentParamsSchema, ...createPaymentSchema }),
  PaymentController.createPayment
);

/**
 * @route   GET /api/v1/projects/:projectId/payments/summary
 * @desc    Get payment summary for a project
 * @access  Private
 */
router.get(
  '/projects/:projectId/summary',
  validateRequest(projectPaymentParamsSchema),
  PaymentController.getProjectPaymentSummary
);

export default router;