import { Project } from '../models/Project';
import { Op } from 'sequelize';

/**
 * Generate a unique project number in format P-YYYY-NNNN
 * @param userId - The user ID to ensure uniqueness per user
 * @returns Promise<string> - The generated project number
 */
export async function generateProjectNumber(userId: number): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `P-${currentYear}-`;
  
  // Find the highest project number for this year and user
  // Note: We'll need to add a projectNumber field to the Project model
  // For now, we'll use the name field pattern or add it later
  const lastProject = await Project.findOne({
    where: {
      userId,
      name: {
        [Op.like]: `${yearPrefix}%`
      }
    },
    order: [['name', 'DESC']],
    attributes: ['name']
  });
  
  let nextNumber = 1;
  
  if (lastProject && lastProject.name.startsWith(yearPrefix)) {
    // Extract the number part from the last project name
    const numberPart = lastProject.name.split('-')[2];
    if (numberPart && !isNaN(parseInt(numberPart))) {
      nextNumber = parseInt(numberPart) + 1;
    }
  }
  
  // Format with leading zeros (4 digits)
  const formattedNumber = nextNumber.toString().padStart(4, '0');
  
  return `${yearPrefix}${formattedNumber}`;
}

/**
 * Validate project number format
 * @param projectNumber - The project number to validate
 * @returns boolean - True if valid format
 */
export function isValidProjectNumberFormat(projectNumber: string): boolean {
  const projectNumberRegex = /^P-\d{4}-\d{4}$/;
  return projectNumberRegex.test(projectNumber);
}

/**
 * Extract year from project number
 * @param projectNumber - The project number
 * @returns number - The year or current year if invalid
 */
export function getYearFromProjectNumber(projectNumber: string): number {
  const parts = projectNumber.split('-');
  if (parts.length >= 2 && !isNaN(parseInt(parts[1]))) {
    return parseInt(parts[1]);
  }
  return new Date().getFullYear();
}