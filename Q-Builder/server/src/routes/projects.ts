import { Router } from 'express';
import Joi from 'joi';
import { ProjectController } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
  projectQuerySchema,
  createProjectFromQuoteSchema
} from '../validation/projects';

const router = Router();

// All project routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects with search and pagination
 * @access  Private
 */
router.get(
  '/',
  validateRequest(projectQuerySchema),
  ProjectController.getProjects
);

/**
 * @route   GET /api/v1/projects/outstanding-balance
 * @desc    Get projects with outstanding balances
 * @access  Private
 */
router.get('/outstanding-balance', ProjectController.getProjectsWithOutstandingBalance);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get a single project by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest(projectParamsSchema),
  ProjectController.getProjectById
);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createProjectSchema),
  ProjectController.createProject
);

/**
 * @route   POST /api/v1/projects/from-quote
 * @desc    Create project from accepted quote
 * @access  Private
 */
router.post(
  '/from-quote',
  validateRequest(createProjectFromQuoteSchema),
  ProjectController.createProjectFromQuote
);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest({ ...projectParamsSchema, ...updateProjectSchema }),
  ProjectController.updateProject
);

/**
 * @route   PATCH /api/v1/projects/:id/status
 * @desc    Update project status
 * @access  Private
 */
router.patch(
  '/:id/status',
  validateRequest({
    ...projectParamsSchema,
    body: Joi.object({
      status: Joi.string()
        .valid('active', 'completed', 'cancelled')
        .required()
        .messages({
          'any.only': 'Status must be one of: active, completed, cancelled',
          'any.required': 'Status is required'
        })
    })
  }),
  ProjectController.updateProjectStatus
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete(
  '/:id',
  validateRequest(projectParamsSchema),
  ProjectController.deleteProject
);

export default router;