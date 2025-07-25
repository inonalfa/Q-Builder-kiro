import { Request, Response } from 'express';
import { catalogService } from '../services/catalogService';
import { CatalogItemCreationAttributes } from '../models/CatalogItem';
import multer from 'multer';

// Configure multer for CSV file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadCSV = upload.single('csvFile');

export class CatalogController {
  /**
   * Get all catalog items
   */
  async getAllCatalogItems(_req: Request, res: Response): Promise<void> {
    try {
      const catalogItems = await catalogService.getAllCatalogItems();
      
      res.json({
        success: true,
        data: catalogItems,
        message: 'Catalog items retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch catalog items'
        }
      });
    }
  }

  /**
   * Get catalog items by profession ID
   */
  async getCatalogItemsByProfession(req: Request, res: Response): Promise<void> {
    try {
      const { professionId } = req.params;
      const id = parseInt(professionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      const catalogItems = await catalogService.getCatalogItemsByProfession(id);
      
      res.json({
        success: true,
        data: catalogItems,
        message: 'Catalog items retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching catalog items by profession:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch catalog items'
        }
      });
    }
  }

  /**
   * Get catalog item by ID
   */
  async getCatalogItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const catalogItemId = parseInt(id, 10);

      if (isNaN(catalogItemId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid catalog item ID'
          }
        });
        return;
      }

      const catalogItem = await catalogService.getCatalogItemById(catalogItemId);

      if (!catalogItem) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Catalog item not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: catalogItem,
        message: 'Catalog item retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching catalog item:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch catalog item'
        }
      });
    }
  }

  /**
   * Create a new catalog item
   */
  async createCatalogItem(req: Request, res: Response): Promise<void> {
    try {
      const catalogItemData: CatalogItemCreationAttributes = req.body;

      // Validate required fields
      if (!catalogItemData.professionId || !catalogItemData.name || !catalogItemData.unit) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Profession ID, name, and unit are required'
          }
        });
        return;
      }

      const catalogItem = await catalogService.createCatalogItem(catalogItemData);

      res.status(201).json({
        success: true,
        data: catalogItem,
        message: 'Catalog item created successfully'
      });
    } catch (error: any) {
      console.error('Error creating catalog item:', error);
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PROFESSION',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create catalog item'
        }
      });
    }
  }

  /**
   * Update catalog item by ID
   */
  async updateCatalogItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const catalogItemId = parseInt(id, 10);
      const updates = req.body;

      if (isNaN(catalogItemId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid catalog item ID'
          }
        });
        return;
      }

      const catalogItem = await catalogService.updateCatalogItem(catalogItemId, updates);

      if (!catalogItem) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Catalog item not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: catalogItem,
        message: 'Catalog item updated successfully'
      });
    } catch (error) {
      console.error('Error updating catalog item:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update catalog item'
        }
      });
    }
  }

  /**
   * Delete catalog item by ID
   */
  async deleteCatalogItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const catalogItemId = parseInt(id, 10);

      if (isNaN(catalogItemId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid catalog item ID'
          }
        });
        return;
      }

      const deleted = await catalogService.deleteCatalogItem(catalogItemId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Catalog item not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Catalog item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting catalog item:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete catalog item'
        }
      });
    }
  }

  /**
   * Import catalog items from CSV file
   */
  async importCatalogFromCSV(req: Request, res: Response): Promise<void> {
    try {
      const { professionId } = req.params;
      const id = parseInt(professionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'CSV file is required'
          }
        });
        return;
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const csvData = catalogService.parseCatalogCSV(csvContent);
      const importedItems = await catalogService.importCatalogItemsFromCSV(id, csvData);

      res.json({
        success: true,
        data: {
          importedCount: importedItems.length,
          items: importedItems
        },
        message: `Successfully imported ${importedItems.length} catalog items`
      });
    } catch (error: any) {
      console.error('Error importing catalog from CSV:', error);
      
      if (error.message.includes('Profession not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFESSION_NOT_FOUND',
            message: 'Profession not found'
          }
        });
        return;
      }

      if (error.message.includes('Failed to parse CSV')) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CSV_PARSE_ERROR',
            message: error.message
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to import catalog from CSV'
        }
      });
    }
  }

  /**
   * Seed catalog from CSV files (admin only)
   */
  async seedCatalogFromFiles(_req: Request, res: Response): Promise<void> {
    try {
      const results = await catalogService.seedCatalogFromCSVFiles();
      
      const totalImported = Object.values(results).reduce((sum, count) => sum + count, 0);

      res.json({
        success: true,
        data: {
          results,
          totalImported
        },
        message: `Successfully seeded catalog with ${totalImported} items`
      });
    } catch (error) {
      console.error('Error seeding catalog from files:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to seed catalog from files'
        }
      });
    }
  }

  /**
   * Get catalog statistics
   */
  async getCatalogStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const statistics = await catalogService.getCatalogStatistics();
      
      res.json({
        success: true,
        data: statistics,
        message: 'Catalog statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching catalog statistics:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch catalog statistics'
        }
      });
    }
  }

  /**
   * Clear catalog for profession (admin only)
   */
  async clearCatalogForProfession(req: Request, res: Response): Promise<void> {
    try {
      const { professionId } = req.params;
      const id = parseInt(professionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      const deletedCount = await catalogService.clearCatalogForProfession(id);

      res.json({
        success: true,
        data: { deletedCount },
        message: `Cleared ${deletedCount} catalog items for profession`
      });
    } catch (error) {
      console.error('Error clearing catalog for profession:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to clear catalog for profession'
        }
      });
    }
  }
}

export const catalogController = new CatalogController();