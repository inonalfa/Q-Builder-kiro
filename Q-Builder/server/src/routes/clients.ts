import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createClientSchema,
  updateClientSchema,
  clientParamsSchema,
  clientQuerySchema
} from '../validation/clients';

const router = Router();

// All client routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients with search and pagination
 * @access  Private
 */
router.get(
  '/',
  validateRequest(clientQuerySchema),
  ClientController.getClients
);

/**
 * @route   GET /api/v1/clients/search
 * @desc    Search clients by name or email
 * @access  Private
 */
router.get('/search', ClientController.searchClients);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get a single client by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest(clientParamsSchema),
  ClientController.getClientById
);

/**
 * @route   POST /api/v1/clients
 * @desc    Create a new client
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createClientSchema),
  ClientController.createClient
);

/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update a client
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest({ ...clientParamsSchema, ...updateClientSchema }),
  ClientController.updateClient
);

/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete a client
 * @access  Private
 */
router.delete(
  '/:id',
  validateRequest(clientParamsSchema),
  ClientController.deleteClient
);

export default router;