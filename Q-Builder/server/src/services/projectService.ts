import { Op } from 'sequelize';
import { Project } from '../models/Project';
import { Client } from '../models/Client';
import { Quote } from '../models/Quote';
import { Payment } from '../models/Payment';
import { AppError } from '../middleware/errorHandler';
import { generateProjectNumber } from '../utils/projectNumber';
import { sequelize } from '../config/database';

export interface ProjectSearchOptions {
  search?: string;
  status?: 'active' | 'completed' | 'cancelled';
  clientId?: number;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'status' | 'budget' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectWithDetails extends Project {
  client?: Client;
  originQuote?: Quote;
  payments?: Payment[];
  totalPaid?: number;
  remainingBalance?: number;
}

export interface CreateProjectData {
  clientId: number;
  originQuoteId?: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
}

export interface CreateProjectFromQuoteData {
  quoteId: number;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export class ProjectService {
  /**
   * Get all projects for a user with search and pagination
   */
  static async getProjects(userId: number, options: ProjectSearchOptions = {}) {
    const {
      search = '',
      status,
      clientId,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (clientId) {
      whereClause.clientId = clientId;
    }
    
    if (fromDate || toDate) {
      whereClause.startDate = {};
      if (fromDate) whereClause.startDate[Op.gte] = fromDate;
      if (toDate) whereClause.startDate[Op.lte] = toDate;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { '$client.name$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get projects with related data and payment calculations
    const { rows: projects, count: total } = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'contactPerson', 'email', 'phone']
        },
        {
          model: Quote,
          as: 'originQuote',
          attributes: ['id', 'quoteNumber', 'title', 'totalAmount']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'amount', 'date', 'method']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
      distinct: true
    });

    // Calculate payment totals for each project
    const projectsWithTotals = projects.map(project => {
      const projectData = project as ProjectWithDetails;
      const totalPaid = projectData.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const remainingBalance = Number(project.budget) - totalPaid;
      
      return {
        ...projectData.toJSON(),
        totalPaid,
        remainingBalance
      };
    });

    return {
      projects: projectsWithTotals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single project by ID
   */
  static async getProjectById(userId: number, projectId: number): Promise<ProjectWithDetails> {
    const project = await Project.findOne({
      where: { id: projectId, userId },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'contactPerson', 'email', 'phone', 'address']
        },
        {
          model: Quote,
          as: 'originQuote',
          attributes: ['id', 'quoteNumber', 'title', 'totalAmount', 'issueDate']
        },
        {
          model: Payment,
          as: 'payments',
          order: [['date', 'DESC']]
        }
      ]
    }) as ProjectWithDetails;

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // Calculate payment totals
    const totalPaid = project.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const remainingBalance = Number(project.budget) - totalPaid;
    
    project.totalPaid = totalPaid;
    project.remainingBalance = remainingBalance;

    return project;
  }

  /**
   * Create a new project
   */
  static async createProject(userId: number, projectData: CreateProjectData): Promise<ProjectWithDetails> {
    const transaction = await sequelize.transaction();
    
    try {
      // Verify client exists and belongs to user
      const client = await Client.findOne({
        where: { id: projectData.clientId, userId }
      });

      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }

      // Verify origin quote if provided
      if (projectData.originQuoteId) {
        const quote = await Quote.findOne({
          where: { id: projectData.originQuoteId, userId, clientId: projectData.clientId }
        });

        if (!quote) {
          throw new AppError('Origin quote not found', 404, 'QUOTE_NOT_FOUND');
        }

        if (quote.status !== 'accepted') {
          throw new AppError('Only accepted quotes can be converted to projects', 409, 'QUOTE_NOT_ACCEPTED');
        }
      }

      // Generate project number (using name field for now)
      const projectNumber = await generateProjectNumber(userId);

      // Create project
      const projectCreateData: any = {
        userId,
        clientId: projectData.clientId,
        name: projectData.name || projectNumber,
        budget: projectData.budget,
        startDate: projectData.startDate,
        status: 'active'
      };

      if (projectData.originQuoteId) {
        projectCreateData.originQuoteId = projectData.originQuoteId;
      }

      if (projectData.description?.trim()) {
        projectCreateData.description = projectData.description.trim();
      }

      if (projectData.endDate) {
        projectCreateData.endDate = projectData.endDate;
      }

      const project = await Project.create(projectCreateData, { transaction });

      // If created from quote, update quote's projectId
      if (projectData.originQuoteId) {
        await Quote.update(
          { projectId: project.id },
          { where: { id: projectData.originQuoteId }, transaction }
        );
      }

      await transaction.commit();

      // Return project with related data
      return await this.getProjectById(userId, project.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Create project from accepted quote
   */
  static async createProjectFromQuote(
    userId: number, 
    data: CreateProjectFromQuoteData
  ): Promise<ProjectWithDetails> {
    const quote = await Quote.findOne({
      where: { id: data.quoteId, userId },
      include: [{ model: Client, as: 'client' }]
    });

    if (!quote) {
      throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
    }

    if (quote.status !== 'accepted') {
      throw new AppError('Only accepted quotes can be converted to projects', 409, 'QUOTE_NOT_ACCEPTED');
    }

    // Check if project already exists for this quote
    const existingProject = await Project.findOne({
      where: { originQuoteId: quote.id }
    });

    if (existingProject) {
      throw new AppError('Project already exists for this quote', 409, 'PROJECT_ALREADY_EXISTS');
    }

    const projectData: CreateProjectData = {
      clientId: quote.clientId,
      originQuoteId: quote.id,
      name: data.name || `Project for ${quote.title}`,
      startDate: data.startDate || new Date(),
      budget: Number(quote.totalAmount)
    };

    if (data.description?.trim()) {
      projectData.description = data.description.trim();
    }

    if (data.endDate) {
      projectData.endDate = data.endDate;
    }

    return await this.createProject(userId, projectData);
  }

  /**
   * Update a project
   */
  static async updateProject(
    userId: number, 
    projectId: number, 
    updateData: Partial<CreateProjectData>
  ): Promise<ProjectWithDetails> {
    const project = await Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // Verify client if being updated
    if (updateData.clientId && updateData.clientId !== project.clientId) {
      const client = await Client.findOne({
        where: { id: updateData.clientId, userId }
      });

      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }
    }

    // Prepare update data
    const projectUpdateData: any = {};
    if (updateData.clientId !== undefined) projectUpdateData.clientId = updateData.clientId;
    if (updateData.name !== undefined) projectUpdateData.name = updateData.name.trim();
    if (updateData.startDate !== undefined) projectUpdateData.startDate = updateData.startDate;
    if (updateData.endDate !== undefined) projectUpdateData.endDate = updateData.endDate;
    if (updateData.budget !== undefined) projectUpdateData.budget = updateData.budget;
    
    if (updateData.description !== undefined) {
      if (updateData.description?.trim()) {
        projectUpdateData.description = updateData.description.trim();
      }
    }

    // Update project
    await project.update(projectUpdateData);

    // Return updated project with related data
    return await this.getProjectById(userId, project.id);
  }

  /**
   * Update project status
   */
  static async updateProjectStatus(
    userId: number, 
    projectId: number, 
    status: 'active' | 'completed' | 'cancelled'
  ): Promise<ProjectWithDetails> {
    const project = await Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // Set end date when completing project
    const updateData: any = { status };
    if (status === 'completed' && !project.endDate) {
      updateData.endDate = new Date();
    }

    await project.update(updateData);

    return await this.getProjectById(userId, project.id);
  }

  /**
   * Delete a project
   */
  static async deleteProject(userId: number, projectId: number): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const project = await Project.findOne({
        where: { id: projectId, userId },
        include: [{ model: Payment, as: 'payments' }]
      }) as ProjectWithDetails;

      if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      // Check if project has payments
      if (project.payments && project.payments.length > 0) {
        throw new AppError(
          'Cannot delete project with existing payments. Please delete payments first.',
          409,
          'PROJECT_HAS_PAYMENTS'
        );
      }

      // If project was created from quote, remove the projectId reference
      if (project.originQuoteId) {
        await sequelize.query(
          'UPDATE quotes SET "projectId" = NULL WHERE id = :quoteId',
          {
            replacements: { quoteId: project.originQuoteId },
            transaction
          }
        );
      }

      // Delete project
      await project.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get projects with outstanding balances
   */
  static async getProjectsWithOutstandingBalance(userId: number): Promise<ProjectWithDetails[]> {
    const projects = await Project.findAll({
      where: {
        userId,
        status: { [Op.in]: ['active', 'completed'] }
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['amount']
        }
      ]
    });

    // Filter projects with outstanding balance
    const projectsWithBalance = projects
      .map(project => {
        const projectData = project as ProjectWithDetails;
        const totalPaid = projectData.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
        const remainingBalance = Number(project.budget) - totalPaid;
        
        projectData.totalPaid = totalPaid;
        projectData.remainingBalance = remainingBalance;
        
        return projectData;
      })
      .filter(project => project.remainingBalance! > 0);

    return projectsWithBalance;
  }
}