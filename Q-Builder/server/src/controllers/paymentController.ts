import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';

export class PaymentController {
  /**
   * Get all payments for a project
   */
  static async getProjectPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.projectId);
      const { 
        fromDate, 
        toDate, 
        method, 
        minAmount, 
        maxAmount, 
        page, 
        limit, 
        sortBy, 
        sortOrder 
      } = req.query;

      const options: any = {};
      if (fromDate) options.fromDate = new Date(fromDate as string);
      if (toDate) options.toDate = new Date(toDate as string);
      if (method) options.method = method as string;
      if (minAmount) options.minAmount = parseFloat(minAmount as string);
      if (maxAmount) options.maxAmount = parseFloat(maxAmount as string);
      if (page) options.page = parseInt(page as string);
      if (limit) options.limit = parseInt(limit as string);
      if (sortBy) options.sortBy = sortBy;
      if (sortOrder) options.sortOrder = sortOrder;

      const result = await PaymentService.getProjectPayments(userId, projectId, options);

      res.json({
        success: true,
        data: result,
        message: 'Project payments retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single payment by ID
   */
  static async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const paymentId = parseInt(req.params.id);

      const payment = await PaymentService.getPaymentById(userId, paymentId);

      res.json({
        success: true,
        data: payment,
        message: 'Payment retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new payment for a project
   */
  static async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.projectId);
      const paymentData = req.body;

      const payment = await PaymentService.createPayment(userId, projectId, paymentData);

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Payment created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a payment
   */
  static async updatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const paymentId = parseInt(req.params.id);
      const updateData = req.body;

      const payment = await PaymentService.updatePayment(userId, paymentId, updateData);

      res.json({
        success: true,
        data: payment,
        message: 'Payment updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a payment
   */
  static async deletePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const paymentId = parseInt(req.params.id);

      await PaymentService.deletePayment(userId, paymentId);

      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment summary for a project
   */
  static async getProjectPaymentSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const projectId = parseInt(req.params.projectId);

      const summary = await PaymentService.getProjectPaymentSummary(userId, projectId);

      res.json({
        success: true,
        data: summary,
        message: 'Payment summary retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all payments for a user (across all projects)
   */
  static async getUserPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { 
        fromDate, 
        toDate, 
        method, 
        minAmount, 
        maxAmount, 
        page, 
        limit, 
        sortBy, 
        sortOrder 
      } = req.query;

      const options: any = {};
      if (fromDate) options.fromDate = new Date(fromDate as string);
      if (toDate) options.toDate = new Date(toDate as string);
      if (method) options.method = method as string;
      if (minAmount) options.minAmount = parseFloat(minAmount as string);
      if (maxAmount) options.maxAmount = parseFloat(maxAmount as string);
      if (page) options.page = parseInt(page as string);
      if (limit) options.limit = parseInt(limit as string);
      if (sortBy) options.sortBy = sortBy;
      if (sortOrder) options.sortOrder = sortOrder;

      const result = await PaymentService.getUserPayments(userId, options);

      res.json({
        success: true,
        data: result,
        message: 'User payments retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment methods used by user
   */
  static async getPaymentMethods(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;

      const methods = await PaymentService.getPaymentMethods(userId);

      res.json({
        success: true,
        data: methods,
        message: 'Payment methods retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}