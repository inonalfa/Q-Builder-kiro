import { Op } from 'sequelize';
import { Client, ClientCreationAttributes } from '../models/Client';
import { Quote } from '../models/Quote';
import { Project } from '../models/Project';
import { AppError } from '../middleware/errorHandler';

export interface ClientSearchOptions {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ClientWithCounts extends Client {
  quotesCount?: number;
  projectsCount?: number;
  quotes?: Quote[];
  projects?: Project[];
}

export class ClientService {
  /**
   * Get all clients for a user with search and pagination
   */
  static async getClients(userId: number, options: ClientSearchOptions = {}) {
    const {
      search = '',
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = options;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = { userId };
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get clients with counts
    const { rows: clients, count: total } = await Client.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
      include: [
        {
          model: Quote,
          as: 'quotes',
          attributes: [],
          required: false
        },
        {
          model: Project,
          as: 'projects',
          attributes: [],
          required: false
        }
      ],
      attributes: {
        include: [
          [
            Client.sequelize!.fn('COUNT', Client.sequelize!.col('quotes.id')),
            'quotesCount'
          ],
          [
            Client.sequelize!.fn('COUNT', Client.sequelize!.col('projects.id')),
            'projectsCount'
          ]
        ]
      },
      group: ['Client.id'],
      subQuery: false
    });

    return {
      clients: clients as ClientWithCounts[],
      pagination: {
        page,
        limit,
        total: typeof total === 'number' ? total : clients.length,
        totalPages: Math.ceil((typeof total === 'number' ? total : clients.length) / limit)
      }
    };
  }

  /**
   * Get a single client by ID
   */
  static async getClientById(userId: number, clientId: number): Promise<ClientWithCounts> {
    const client = await Client.findOne({
      where: { id: clientId, userId },
      include: [
        {
          model: Quote,
          as: 'quotes',
          attributes: ['id', 'quoteNumber', 'title', 'status', 'totalAmount', 'createdAt'],
          order: [['createdAt', 'DESC']]
        },
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'name', 'status', 'budget', 'startDate', 'endDate', 'createdAt'],
          order: [['createdAt', 'DESC']]
        }
      ]
    }) as ClientWithCounts;

    if (!client) {
      throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    // Add counts
    client.quotesCount = client.quotes?.length || 0;
    client.projectsCount = client.projects?.length || 0;

    return client;
  }

  /**
   * Create a new client
   */
  static async createClient(userId: number, clientData: Omit<ClientCreationAttributes, 'userId'>): Promise<Client> {
    // Check if client with same email already exists for this user
    const existingClient = await Client.findOne({
      where: { userId, email: clientData.email }
    });

    if (existingClient) {
      throw new AppError('Client with this email already exists', 409, 'CLIENT_EMAIL_EXISTS');
    }

    // Sanitize data
    const sanitizedData: ClientCreationAttributes = {
      userId,
      name: clientData.name.trim(),
      phone: clientData.phone.trim(),
      email: clientData.email.toLowerCase().trim(),
      address: clientData.address.trim()
    };

    if (clientData.contactPerson?.trim()) {
      sanitizedData.contactPerson = clientData.contactPerson.trim();
    }

    if (clientData.notes?.trim()) {
      sanitizedData.notes = clientData.notes.trim();
    }

    const client = await Client.create(sanitizedData);
    return client;
  }

  /**
   * Update a client
   */
  static async updateClient(
    userId: number, 
    clientId: number, 
    updateData: Partial<Omit<ClientCreationAttributes, 'userId'>>
  ): Promise<Client> {
    const client = await Client.findOne({
      where: { id: clientId, userId }
    });

    if (!client) {
      throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    // If email is being updated, check for conflicts
    if (updateData.email && updateData.email !== client.email) {
      const existingClient = await Client.findOne({
        where: { 
          userId, 
          email: updateData.email,
          id: { [Op.ne]: clientId }
        }
      });

      if (existingClient) {
        throw new AppError('Client with this email already exists', 409, 'CLIENT_EMAIL_EXISTS');
      }
    }

    // Sanitize update data
    const sanitizedData: Partial<ClientCreationAttributes> = {};
    if (updateData.name !== undefined) sanitizedData.name = updateData.name.trim();
    if (updateData.contactPerson !== undefined) {
      if (updateData.contactPerson?.trim()) {
        sanitizedData.contactPerson = updateData.contactPerson.trim();
      }
    }
    if (updateData.phone !== undefined) sanitizedData.phone = updateData.phone.trim();
    if (updateData.email !== undefined) sanitizedData.email = updateData.email.toLowerCase().trim();
    if (updateData.address !== undefined) sanitizedData.address = updateData.address.trim();
    if (updateData.notes !== undefined) {
      if (updateData.notes?.trim()) {
        sanitizedData.notes = updateData.notes.trim();
      }
    }

    await client.update(sanitizedData);
    return client;
  }

  /**
   * Delete a client
   */
  static async deleteClient(userId: number, clientId: number): Promise<void> {
    const client = await Client.findOne({
      where: { id: clientId, userId },
      include: [
        { model: Quote, as: 'quotes' },
        { model: Project, as: 'projects' }
      ]
    }) as ClientWithCounts;

    if (!client) {
      throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    // Check if client has quotes or projects
    if (client.quotes && client.quotes.length > 0) {
      throw new AppError(
        'Cannot delete client with existing quotes. Please delete quotes first.',
        409,
        'CLIENT_HAS_QUOTES'
      );
    }

    if (client.projects && client.projects.length > 0) {
      throw new AppError(
        'Cannot delete client with existing projects. Please delete projects first.',
        409,
        'CLIENT_HAS_PROJECTS'
      );
    }

    await client.destroy();
  }

  /**
   * Search clients by name or email
   */
  static async searchClients(userId: number, searchTerm: string, limit: number = 10): Promise<Client[]> {
    if (!searchTerm.trim()) {
      return [];
    }

    const clients = await Client.findAll({
      where: {
        userId,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { contactPerson: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      order: [['name', 'ASC']],
      limit,
      attributes: ['id', 'name', 'contactPerson', 'email', 'phone']
    });

    return clients;
  }
}