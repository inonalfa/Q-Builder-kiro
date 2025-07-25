import { Router } from 'express';
import { professionController } from '../controllers/professionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/v1/professions
 * @desc Get all professions
 * @access Private
 */
router.get('/', authenticateToken, professionController.getAllProfessions.bind(professionController));

/**
 * @route GET /api/v1/professions/counts
 * @desc Get professions with catalog item counts
 * @access Private
 */
router.get('/counts', authenticateToken, professionController.getProfessionsWithCounts.bind(professionController));

/**
 * @route GET /api/v1/professions/:id
 * @desc Get profession by ID
 * @access Private
 */
router.get('/:id', authenticateToken, professionController.getProfessionById.bind(professionController));

/**
 * @route POST /api/v1/professions
 * @desc Create a new profession (admin only)
 * @access Private (Admin)
 */
router.post('/', authenticateToken, professionController.createProfession.bind(professionController));

/**
 * @route PUT /api/v1/professions/:id
 * @desc Update profession by ID (admin only)
 * @access Private (Admin)
 */
router.put('/:id', authenticateToken, professionController.updateProfession.bind(professionController));

/**
 * @route DELETE /api/v1/professions/:id
 * @desc Delete profession by ID (admin only)
 * @access Private (Admin)
 */
router.delete('/:id', authenticateToken, professionController.deleteProfession.bind(professionController));

/**
 * @route POST /api/v1/professions/seed
 * @desc Seed professions with predefined data (admin only)
 * @access Private (Admin)
 */
router.post('/seed', authenticateToken, professionController.seedProfessions.bind(professionController));

export default router;