import { Op } from 'sequelize';
import { Payment, PaymentCreationAttributes } from '../models/Payment';
import { Project } from '../models/Project';
import { Client } from '../models/Client';
import { AppError } from '../middleware/errorHandler';

export interface PaymentSearchOptions {
  fromDate?: Date;
  toDate?: Date;
  method?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'method' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentWithDetails extends Payment {
  project?: Project & {
    client?: Client;
  };
}

export interface CreatePaymentData {
  date: Date;
  amount: number;
  method: string;
  note?: string;
  receiptNumber?: string;
}

export interface PaymentSummary {
  totalAmount: number;
  paymentCount: number;
  averageAmount: number;
  methodBreakdown: { method: string; total: number; count: number }[];
}

export class PaymentService {
  /**
   * Get all payments for a project
   */
  static async getProjectPayments(
    userId: number, 
    projectId: number, 
    options: PaymentSearchOptions = {}
  ) {
    const {
      fromDate,
      toDate,
      method,
      minAmount,
      maxAmount,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc'
    } = options;

    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = { projectId };
    
    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date[Op.gte] = fromDate;
      if (toDate) whereClause.date[Op.lte] = toDate;
    }
    
    if (method) {
      whereClause.method = { [Op.iLike]: `%${method}%` };
    }
    
    if (minAmount !== undefined || maxAmount !== undefined) {
      whereClause.amount = {};
      if (minAmount !== undefined) whereClause.amount[Op.gte] = minAmount;
      if (maxAmount !== undefined) whereClause.amount[Op.lte] = maxAmount;
    }

    // Get payments
    const { rows: payments, count: total } = await Payment.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset
    });

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single payment by ID
   */
  static async getPaymentById(userId: number, paymentId: number): Promise<PaymentWithDetails> {
    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [
        {
          model: Project,
          as: 'project',
          where: { userId },
          include: [
            {
              model: Client,
              as: 'client',
              attributes: ['id', 'name', 'contactPerson', 'email']
            }
          ]
        }
      ]
    }) as PaymentWithDetails;

    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    return payment;
  }

  /**
   * Create a new payment
   */
  static async createPayment(
    userId: number, 
    projectId: number, 
    paymentData: CreatePaymentData
  ): Promise<PaymentWithDetails> {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // Calculate current total payments
    const existingPayments = await Payment.sum('amount', {
      where: { projectId }
    });

    const currentTotal = existingPayments || 0;
    const newTotal = currentTotal + Number(paymentData.amount);

    // Check if payment exceeds project budget
    if (newTotal > Number(project.budget)) {
      throw new AppError(
        `Payment amount exceeds remaining budget. Remaining: ${Number(project.budget) - currentTotal}`,
        409,
        'PAYMENT_EXCEEDS_BUDGET'
      );
    }

    // Sanitize data
    const sanitizedData: PaymentCreationAttributes = {
      projectId,
      date: paymentData.date,
      amount: Number(paymentData.amount),
      method: paymentData.method.trim()
    };

    if (paymentData.note?.trim()) {
      sanitizedData.note = paymentData.note.trim();
    }

    if (paymentData.receiptNumber?.trim()) {
      sanitizedData.receiptNumber = paymentData.receiptNumber.trim();
    }

    const payment = await Payment.create(sanitizedData);

    return await this.getPaymentById(userId, payment.id);
  }

  /**
   * Update a payment
   */
  static async updatePayment(
    userId: number, 
    paymentId: number, 
    updateData: Partial<CreatePaymentData>
  ): Promise<PaymentWithDetails> {
    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [
        {
          model: Project,
          as: 'project',
          where: { userId }
        }
      ]
    }) as PaymentWithDetails;

    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    // If amount is being updated, check budget constraints
    if (updateData.amount !== undefined && updateData.amount !== payment.amount) {
      const existingPayments = await Payment.sum('amount', {
        where: { 
          projectId: payment.projectId,
          id: { [Op.ne]: paymentId }
        }
      });

      const otherPaymentsTotal = existingPayments || 0;
      const newTotal = otherPaymentsTotal + Number(updateData.amount);

      if (newTotal > Number(payment.project!.budget)) {
        throw new AppError(
          `Payment amount exceeds project budget. Available: ${Number(payment.project!.budget) - otherPaymentsTotal}`,
          409,
          'PAYMENT_EXCEEDS_BUDGET'
        );
      }
    }

    // Prepare update data
    const paymentUpdateData: any = {};
    if (updateData.date !== undefined) paymentUpdateData.date = updateData.date;
    if (updateData.amount !== undefined) paymentUpdateData.amount = Number(updateData.amount);
    if (updateData.method !== undefined) paymentUpdateData.method = updateData.method.trim();
    
    if (updateData.note !== undefined) {
      if (updateData.note?.trim()) {
        paymentUpdateData.note = updateData.note.trim();
      }
    }
    
    if (updateData.receiptNumber !== undefined) {
      if (updateData.receiptNumber?.trim()) {
        paymentUpdateData.receiptNumber = updateData.receiptNumber.trim();
      }
    }

    await payment.update(paymentUpdateData);

    return await this.getPaymentById(userId, payment.id);
  }

  /**
   * Delete a payment
   */
  static async deletePayment(userId: number, paymentId: number): Promise<void> {
    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [
        {
          model: Project,
          as: 'project',
          where: { userId }
        }
      ]
    });

    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    await payment.destroy();
  }

  /**
   * Get payment summary for a project
   */
  static async getProjectPaymentSummary(userId: number, projectId: number): Promise<PaymentSummary> {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    const payments = await Payment.findAll({
      where: { projectId },
      attributes: ['amount', 'method']
    });

    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const paymentCount = payments.length;
    const averageAmount = paymentCount > 0 ? totalAmount / paymentCount : 0;

    // Calculate method breakdown
    const methodMap = new Map<string, { total: number; count: number }>();
    
    payments.forEach(payment => {
      const method = payment.method;
      const existing = methodMap.get(method) || { total: 0, count: 0 };
      methodMap.set(method, {
        total: existing.total + Number(payment.amount),
        count: existing.count + 1
      });
    });

    const methodBreakdown = Array.from(methodMap.entries()).map(([method, data]) => ({
      method,
      total: data.total,
      count: data.count
    }));

    return {
      totalAmount,
      paymentCount,
      averageAmount,
      methodBreakdown
    };
  }

  /**
   * Get all payments for a user (across all projects)
   */
  static async getUserPayments(userId: number, options: PaymentSearchOptions = {}) {
    const {
      fromDate,
      toDate,
      method,
      minAmount,
      maxAmount,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    
    // Build where clause for payments
    const paymentWhere: any = {};
    
    if (fromDate || toDate) {
      paymentWhere.date = {};
      if (fromDate) paymentWhere.date[Op.gte] = fromDate;
      if (toDate) paymentWhere.date[Op.lte] = toDate;
    }
    
    if (method) {
      paymentWhere.method = { [Op.iLike]: `%${method}%` };
    }
    
    if (minAmount !== undefined || maxAmount !== undefined) {
      paymentWhere.amount = {};
      if (minAmount !== undefined) paymentWhere.amount[Op.gte] = minAmount;
      if (maxAmount !== undefined) paymentWhere.amount[Op.lte] = maxAmount;
    }

    // Get payments with project and client info
    const { rows: payments, count: total } = await Payment.findAndCountAll({
      where: paymentWhere,
      include: [
        {
          model: Project,
          as: 'project',
          where: { userId },
          include: [
            {
              model: Client,
              as: 'client',
              attributes: ['id', 'name', 'contactPerson']
            }
          ]
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
      distinct: true
    });

    return {
      payments: payments as PaymentWithDetails[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get payment methods used by user
   */
  static async getPaymentMethods(userId: number): Promise<string[]> {
    const methods = await Payment.findAll({
      attributes: ['method'],
      include: [
        {
          model: Project,
          as: 'project',
          where: { userId },
          attributes: []
        }
      ],
      group: ['method'],
      order: [['method', 'ASC']]
    });

    return methods.map(payment => payment.method);
  }
}