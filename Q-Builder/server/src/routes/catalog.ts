import { Router } from 'express';
import { catalogController, uploadCSV } from '../controllers/catalogController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/v1/catalog
 * @desc Get all catalog items
 * @access Private
 */
router.get('/', authenticateToken, catalogController.getAllCatalogItems.bind(catalogController));

/**
 * @route GET /api/v1/catalog/statistics
 * @desc Get catalog statistics
 * @access Private
 */
router.get('/statistics', authenticateToken, catalogController.getCatalogStatistics.bind(catalogController));

/**
 * @route GET /api/v1/catalog/profession/:professionId
 * @desc Get catalog items by profession ID
 * @access Private
 */
router.get('/profession/:professionId', authenticateToken, catalogController.getCatalogItemsByProfession.bind(catalogController));

/**
 * @route GET /api/v1/catalog/:id
 * @desc Get catalog item by ID
 * @access Private
 */
router.get('/:id', authenticateToken, catalogController.getCatalogItemById.bind(catalogController));

/**
 * @route POST /api/v1/catalog
 * @desc Create a new catalog item
 * @access Private
 */
router.post('/', authenticateToken, catalogController.createCatalogItem.bind(catalogController));

/**
 * @route PUT /api/v1/catalog/:id
 * @desc Update catalog item by ID
 * @access Private
 */
router.put('/:id', authenticateToken, catalogController.updateCatalogItem.bind(catalogController));

/**
 * @route DELETE /api/v1/catalog/:id
 * @desc Delete catalog item by ID
 * @access Private
 */
router.delete('/:id', authenticateToken, catalogController.deleteCatalogItem.bind(catalogController));

/**
 * @route POST /api/v1/catalog/import/:professionId
 * @desc Import catalog items from CSV file for a specific profession
 * @access Private (Admin)
 */
router.post('/import/:professionId', authenticateToken, uploadCSV, catalogController.importCatalogFromCSV.bind(catalogController));

/**
 * @route POST /api/v1/catalog/seed
 * @desc Seed catalog from CSV files (admin only)
 * @access Private (Admin)
 */
router.post('/seed', authenticateToken, catalogController.seedCatalogFromFiles.bind(catalogController));

/**
 * @route DELETE /api/v1/catalog/profession/:professionId
 * @desc Clear all catalog items for a profession (admin only)
 * @access Private (Admin)
 */
router.delete('/profession/:professionId', authenticateToken, catalogController.clearCatalogForProfession.bind(catalogController));

export default router;