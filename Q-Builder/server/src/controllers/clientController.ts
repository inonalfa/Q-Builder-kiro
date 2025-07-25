import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/clientService';
import { AppError } from '../middleware/errorHandler';

export class ClientController {
  /**
   * Get all clients with search and pagination
   */
  static async getClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { search, page, limit, sortBy, sortOrder } = req.query;

      const options: any = {};
      if (search) options.search = search as string;
      if (page) options.page = parseInt(page as string);
      if (limit) options.limit = parseInt(limit as string);
      if (sortBy) options.sortBy = sortBy;
      if (sortOrder) options.sortOrder = sortOrder;

      const result = await ClientService.getClients(userId, options);

      res.json({
        success: true,
        data: result,
        message: 'Clients retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single client by ID
   */
  static async getClientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const clientId = parseInt(req.params.id);

      const client = await ClientService.getClientById(userId, clientId);

      res.json({
        success: true,
        data: client,
        message: 'Client retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new client
   */
  static async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const clientData = req.body;

      const client = await ClientService.createClient(userId, clientData);

      res.status(201).json({
        success: true,
        data: client,
        message: 'Client created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a client
   */
  static async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const clientId = parseInt(req.params.id);
      const updateData = req.body;

      const client = await ClientService.updateClient(userId, clientId, updateData);

      res.json({
        success: true,
        data: client,
        message: 'Client updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const clientId = parseInt(req.params.id);

      await ClientService.deleteClient(userId, clientId);

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search clients
   */
  static async searchClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { q, limit } = req.query;

      if (!q) {
        throw new AppError('Search query is required', 400, 'MISSING_SEARCH_QUERY');
      }

      const clients = await ClientService.searchClients(
        userId, 
        q as string, 
        limit ? parseInt(limit as string) : undefined
      );

      res.json({
        success: true,
        data: clients,
        message: 'Search completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}