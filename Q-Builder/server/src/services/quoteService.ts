import { Op } from 'sequelize';
import { Quote } from '../models/Quote';
import { QuoteItem, QuoteItemCreationAttributes } from '../models/QuoteItem';
import { Client } from '../models/Client';
import { CatalogItem } from '../models/CatalogItem';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { generateQuoteNumber } from '../utils/quoteNumber';
import { sequelize } from '../config/database';
import { QuoteData } from './pdfService';

export interface QuoteSearchOptions {
  search?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  clientId?: number;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'quoteNumber' | 'title' | 'status' | 'totalAmount' | 'issueDate' | 'expiryDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface QuoteWithDetails extends Quote {
  client?: Client;
  items?: QuoteItem[];
  project?: Project;
}

export interface CreateQuoteData {
  clientId: number;
  title: string;
  issueDate: Date;
  expiryDate: Date;
  currency?: string;
  terms?: string;
  items: Omit<QuoteItemCreationAttributes, 'quoteId' | 'lineTotal'>[];
}

export class QuoteService {
  /**
   * Get all quotes for a user with search and pagination
   */
  static async getQuotes(userId: number, options: QuoteSearchOptions = {}) {
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
      whereClause.issueDate = {};
      if (fromDate) whereClause.issueDate[Op.gte] = fromDate;
      if (toDate) whereClause.issueDate[Op.lte] = toDate;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { quoteNumber: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { '$client.name$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get quotes with related data
    const { rows: quotes, count: total } = await Quote.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'contactPerson', 'email', 'phone']
        },
        {
          model: QuoteItem,
          as: 'items',
          attributes: ['id', 'description', 'unit', 'quantity', 'unitPrice', 'lineTotal']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
      distinct: true
    });

    return {
      quotes: quotes as QuoteWithDetails[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single quote by ID
   */
  static async getQuoteById(userId: number, quoteId: number): Promise<QuoteWithDetails> {
    const quote = await Quote.findOne({
      where: { id: quoteId, userId },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'contactPerson', 'email', 'phone', 'address']
        },
        {
          model: QuoteItem,
          as: 'items',
          include: [
            {
              model: CatalogItem,
              as: 'catalogItem',
              attributes: ['id', 'name', 'unit', 'defaultPrice']
            }
          ]
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status']
        }
      ]
    }) as QuoteWithDetails;

    if (!quote) {
      throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
    }

    return quote;
  }

  /**
   * Create a new quote
   */
  static async createQuote(userId: number, quoteData: CreateQuoteData): Promise<QuoteWithDetails> {
    const transaction = await sequelize.transaction();
    
    try {
      // Verify client exists and belongs to user
      const client = await Client.findOne({
        where: { id: quoteData.clientId, userId }
      });

      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }

      // Generate unique quote number
      const quoteNumber = await generateQuoteNumber(userId);

      // Calculate total amount from items
      let totalAmount = 0;
      const processedItems = quoteData.items.map(item => {
        const lineTotal = Number(item.quantity) * Number(item.unitPrice);
        totalAmount += lineTotal;
        return {
          ...item,
          lineTotal
        };
      });

      // Create quote
      const quoteCreateData: any = {
        userId,
        clientId: quoteData.clientId,
        quoteNumber,
        title: quoteData.title.trim(),
        issueDate: quoteData.issueDate,
        expiryDate: quoteData.expiryDate,
        status: 'draft',
        totalAmount,
        currency: quoteData.currency || 'ILS'
      };

      if (quoteData.terms?.trim()) {
        quoteCreateData.terms = quoteData.terms.trim();
      }

      const quote = await Quote.create(quoteCreateData, { transaction });

      // Create quote items
      await QuoteItem.bulkCreate(
        processedItems.map(item => ({
          ...item,
          quoteId: quote.id,
          description: item.description.trim(),
          unit: item.unit.trim()
        })),
        { transaction }
      );

      await transaction.commit();

      // Return quote with related data
      return await this.getQuoteById(userId, quote.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update a quote
   */
  static async updateQuote(
    userId: number, 
    quoteId: number, 
    updateData: Partial<CreateQuoteData>
  ): Promise<QuoteWithDetails> {
    const transaction = await sequelize.transaction();
    
    try {
      const quote = await Quote.findOne({
        where: { id: quoteId, userId },
        include: [{ model: QuoteItem, as: 'items' }]
      });

      if (!quote) {
        throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
      }

      // Check if quote can be modified
      if (quote.status === 'accepted') {
        throw new AppError('Cannot modify accepted quote', 409, 'QUOTE_ACCEPTED');
      }

      // Verify client if being updated
      if (updateData.clientId && updateData.clientId !== quote.clientId) {
        const client = await Client.findOne({
          where: { id: updateData.clientId, userId }
        });

        if (!client) {
          throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
        }
      }

      // Prepare update data
      const quoteUpdateData: any = {};
      if (updateData.clientId !== undefined) quoteUpdateData.clientId = updateData.clientId;
      if (updateData.title !== undefined) quoteUpdateData.title = updateData.title.trim();
      if (updateData.issueDate !== undefined) quoteUpdateData.issueDate = updateData.issueDate;
      if (updateData.expiryDate !== undefined) quoteUpdateData.expiryDate = updateData.expiryDate;
      if (updateData.currency !== undefined) quoteUpdateData.currency = updateData.currency;
      if (updateData.terms !== undefined) {
        if (updateData.terms?.trim()) {
          quoteUpdateData.terms = updateData.terms.trim();
        }
      }

      // Handle items update
      if (updateData.items) {
        // Delete existing items
        await QuoteItem.destroy({
          where: { quoteId: quote.id },
          transaction
        });

        // Calculate new total and create new items
        let totalAmount = 0;
        const processedItems = updateData.items.map(item => {
          const lineTotal = Number(item.quantity) * Number(item.unitPrice);
          totalAmount += lineTotal;
          return {
            ...item,
            quoteId: quote.id,
            lineTotal,
            description: item.description.trim(),
            unit: item.unit.trim()
          };
        });

        await QuoteItem.bulkCreate(processedItems, { transaction });
        quoteUpdateData.totalAmount = totalAmount;
      }

      // Update quote
      await quote.update(quoteUpdateData, { transaction });

      await transaction.commit();

      // Clear PDF cache since quote was updated
      const { PDFCacheService } = await import('./pdfCacheService');
      PDFCacheService.clearQuoteCache(userId, quote.id);

      // Return updated quote with related data
      return await this.getQuoteById(userId, quote.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update quote status
   */
  static async updateQuoteStatus(
    userId: number, 
    quoteId: number, 
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  ): Promise<QuoteWithDetails> {
    const quote = await Quote.findOne({
      where: { id: quoteId, userId }
    });

    if (!quote) {
      throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
    }

    // Validate status transitions
    if (quote.status === 'accepted' && status !== 'accepted') {
      throw new AppError('Cannot change status of accepted quote', 409, 'QUOTE_ACCEPTED');
    }

    if (status === 'accepted' && quote.status === 'rejected') {
      throw new AppError('Cannot accept rejected quote', 409, 'INVALID_STATUS_TRANSITION');
    }

    await quote.update({ status });

    // Clear PDF cache since quote status was updated
    const { PDFCacheService } = await import('./pdfCacheService');
    PDFCacheService.clearQuoteCache(userId, quote.id);

    return await this.getQuoteById(userId, quote.id);
  }

  /**
   * Delete a quote
   */
  static async deleteQuote(userId: number, quoteId: number): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const quote = await Quote.findOne({
        where: { id: quoteId, userId },
        include: [{ model: Project, as: 'project' }]
      }) as QuoteWithDetails;

      if (!quote) {
        throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
      }

      // Check if quote has associated project
      if (quote.project) {
        throw new AppError(
          'Cannot delete quote with associated project',
          409,
          'QUOTE_HAS_PROJECT'
        );
      }

      // Check if quote is accepted
      if (quote.status === 'accepted') {
        throw new AppError('Cannot delete accepted quote', 409, 'QUOTE_ACCEPTED');
      }

      // Delete quote items first (cascade should handle this, but being explicit)
      await QuoteItem.destroy({
        where: { quoteId: quote.id },
        transaction
      });

      // Delete quote
      await quote.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get quotes expiring soon
   */
  static async getExpiringQuotes(userId: number, daysAhead: number = 3): Promise<Quote[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const quotes = await Quote.findAll({
      where: {
        userId,
        status: 'sent',
        expiryDate: {
          [Op.lte]: futureDate,
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    return quotes;
  }

  /**
   * Mark expired quotes
   */
  static async markExpiredQuotes(): Promise<number> {
    const [affectedCount] = await Quote.update(
      { status: 'expired' },
      {
        where: {
          status: 'sent',
          expiryDate: {
            [Op.lt]: new Date()
          }
        }
      }
    );

    return affectedCount;
  }

  /**
   * Get quote data formatted for PDF generation
   */
  static async getQuoteForPDF(userId: number, quoteId: number): Promise<QuoteData> {
    const quote = await Quote.findOne({
      where: { id: quoteId, userId },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'contactPerson', 'email', 'phone', 'address']
        },
        {
          model: QuoteItem,
          as: 'items',
          attributes: ['id', 'description', 'unit', 'quantity', 'unitPrice', 'lineTotal']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'businessName', 'phone', 'email', 'address', 'logoUrl', 'vatRate']
        }
      ]
    }) as QuoteWithDetails & { user: User };

    if (!quote) {
      throw new AppError('Quote not found', 404, 'QUOTE_NOT_FOUND');
    }

    if (!quote.client) {
      throw new AppError('Quote client data not found', 404, 'CLIENT_DATA_NOT_FOUND');
    }

    if (!quote.user) {
      throw new AppError('Quote user data not found', 404, 'USER_DATA_NOT_FOUND');
    }

    // Calculate VAT amounts
    const vatRate = quote.user.vatRate || 0.18; // Default 18% VAT
    const subtotal = quote.totalAmount;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    // Format data for PDF generation
    const pdfData: QuoteData = {
      quoteNumber: quote.quoteNumber,
      issueDate: quote.issueDate,
      expiryDate: quote.expiryDate,
      business: {
        name: quote.user.businessName || 'Business Name',
        address: quote.user.address || '',
        phone: quote.user.phone || '',
        email: quote.user.email || '',
        logoUrl: quote.user.logoUrl
      },
      client: {
        name: quote.client.name,
        contactPerson: quote.client.contactPerson,
        phone: quote.client.phone,
        email: quote.client.email,
        address: quote.client.address
      },
      items: quote.items?.map(item => ({
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })) || [],
      subtotal,
      vatRate,
      vatAmount,
      total,
      terms: quote.terms
    };

    return pdfData;
  }
}