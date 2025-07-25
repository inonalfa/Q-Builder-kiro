import { Request, Response } from 'express';
import { professionService } from '../services/professionService';
import { ProfessionCreationAttributes } from '../models/Profession';

export class ProfessionController {
  /**
   * Get all professions
   */
  async getAllProfessions(_req: Request, res: Response): Promise<void> {
    try {
      const professions = await professionService.getAllProfessions();
      
      res.json({
        success: true,
        data: professions,
        message: 'Professions retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching professions:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch professions'
        }
      });
    }
  }

  /**
   * Get profession by ID
   */
  async getProfessionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const professionId = parseInt(id, 10);

      if (isNaN(professionId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      const profession = await professionService.getProfessionById(professionId);

      if (!profession) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Profession not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: profession,
        message: 'Profession retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching profession:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch profession'
        }
      });
    }
  }

  /**
   * Create a new profession (admin only)
   */
  async createProfession(req: Request, res: Response): Promise<void> {
    try {
      const professionData: ProfessionCreationAttributes = req.body;

      // Validate required fields
      if (!professionData.name || !professionData.nameHebrew) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name and Hebrew name are required'
          }
        });
        return;
      }

      const profession = await professionService.createProfession(professionData);

      res.status(201).json({
        success: true,
        data: profession,
        message: 'Profession created successfully'
      });
    } catch (error: any) {
      console.error('Error creating profession:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ERROR',
            message: 'Profession with this name already exists'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create profession'
        }
      });
    }
  }

  /**
   * Update profession by ID (admin only)
   */
  async updateProfession(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const professionId = parseInt(id, 10);
      const updates = req.body;

      if (isNaN(professionId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      const profession = await professionService.updateProfession(professionId, updates);

      if (!profession) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Profession not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: profession,
        message: 'Profession updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating profession:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ERROR',
            message: 'Profession with this name already exists'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update profession'
        }
      });
    }
  }

  /**
   * Delete profession by ID (admin only)
   */
  async deleteProfession(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const professionId = parseInt(id, 10);

      if (isNaN(professionId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profession ID'
          }
        });
        return;
      }

      const deleted = await professionService.deleteProfession(professionId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Profession not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profession deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting profession:', error);
      
      if (error.message.includes('Cannot delete profession with existing catalog items')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'CONSTRAINT_ERROR',
            message: 'Cannot delete profession with existing catalog items'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete profession'
        }
      });
    }
  }

  /**
   * Get professions with catalog item counts
   */
  async getProfessionsWithCounts(_req: Request, res: Response): Promise<void> {
    try {
      const professions = await professionService.getProfessionsWithCounts();
      
      res.json({
        success: true,
        data: professions,
        message: 'Professions with counts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching professions with counts:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch professions with counts'
        }
      });
    }
  }

  /**
   * Seed professions (admin only)
   */
  async seedProfessions(_req: Request, res: Response): Promise<void> {
    try {
      await professionService.seedProfessions();
      
      res.json({
        success: true,
        message: 'Professions seeded successfully'
      });
    } catch (error) {
      console.error('Error seeding professions:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to seed professions'
        }
      });
    }
  }
}

export const professionController = new ProfessionController();