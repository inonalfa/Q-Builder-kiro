import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';

export class ProjectController {
  /**
   * Get all projects with search and pagination
   */
  static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const result = await ProjectService.getProjects(userId, options);

      res.json({
        success: true,
        data: result,
        message: 'Projects retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.id);

      const project = await ProjectService.getProjectById(userId, projectId);

      res.json({
        success: true,
        data: project,
        message: 'Project retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new project
   */
  static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectData = req.body;

      const project = await ProjectService.createProject(userId, projectData);

      res.status(201).json({
        success: true,
        data: project,
        message: 'Project created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create project from accepted quote
   */
  static async createProjectFromQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const data = req.body;

      const project = await ProjectService.createProjectFromQuote(userId, data);

      res.status(201).json({
        success: true,
        data: project,
        message: 'Project created from quote successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a project
   */
  static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.id);
      const updateData = req.body;

      const project = await ProjectService.updateProject(userId, projectId, updateData);

      res.json({
        success: true,
        data: project,
        message: 'Project updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update project status
   */
  static async updateProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.id);
      const { status } = req.body;

      const project = await ProjectService.updateProjectStatus(userId, projectId, status);

      res.json({
        success: true,
        data: project,
        message: `Project status updated to ${status}`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.id);

      await ProjectService.deleteProject(userId, projectId);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get projects with outstanding balances
   */
  static async getProjectsWithOutstandingBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;

      const projects = await ProjectService.getProjectsWithOutstandingBalance(userId);

      res.json({
        success: true,
        data: projects,
        message: 'Projects with outstanding balance retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}