import { Quote } from '../models/Quote';
import { Op } from 'sequelize';

/**
 * Generate a unique quote number in format Q-YYYY-NNNN
 * @param userId - The user ID to ensure uniqueness per user
 * @returns Promise<string> - The generated quote number
 */
export async function generateQuoteNumber(userId: number): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `Q-${currentYear}-`;
  
  // Find the highest quote number for this year and user
  const lastQuote = await Quote.findOne({
    where: {
      userId,
      quoteNumber: {
        [Op.like]: `${yearPrefix}%`
      }
    },
    order: [['quoteNumber', 'DESC']],
    attributes: ['quoteNumber']
  });
  
  let nextNumber = 1;
  
  if (lastQuote) {
    // Extract the number part from the last quote number
    const numberPart = lastQuote.quoteNumber.split('-')[2];
    if (numberPart && !isNaN(parseInt(numberPart))) {
      nextNumber = parseInt(numberPart) + 1;
    }
  }
  
  // Format with leading zeros (4 digits)
  const formattedNumber = nextNumber.toString().padStart(4, '0');
  
  return `${yearPrefix}${formattedNumber}`;
}

/**
 * Validate quote number format
 * @param quoteNumber - The quote number to validate
 * @returns boolean - True if valid format
 */
export function isValidQuoteNumberFormat(quoteNumber: string): boolean {
  const quoteNumberRegex = /^Q-\d{4}-\d{4}$/;
  return quoteNumberRegex.test(quoteNumber);
}

/**
 * Extract year from quote number
 * @param quoteNumber - The quote number
 * @returns number - The year or current year if invalid
 */
export function getYearFromQuoteNumber(quoteNumber: string): number {
  const parts = quoteNumber.split('-');
  if (parts.length >= 2 && !isNaN(parseInt(parts[1]))) {
    return parseInt(parts[1]);
  }
  return new Date().getFullYear();
}