import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const logosDir = path.join(uploadsDir, 'logos');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'logo') {
      cb(null, logosDir);
    } else {
      cb(new Error('Invalid field name'), '');
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and user ID
    const userId = (req as any).userId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `logo_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400, 'INVALID_FILE_TYPE'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

// Middleware for logo upload
export const uploadLogo = upload.single('logo');

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File size too large. Maximum size is 5MB', 400, 'FILE_TOO_LARGE'));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Too many files. Only one file allowed', 400, 'TOO_MANY_FILES'));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Unexpected field name', 400, 'UNEXPECTED_FIELD'));
    }
  }
  
  if (error instanceof AppError) {
    return next(error);
  }
  
  next(new AppError('File upload failed', 500, 'UPLOAD_FAILED'));
};

// Utility function to delete old logo file
export const deleteOldLogo = (logoUrl: string): void => {
  try {
    if (logoUrl && logoUrl.includes('/uploads/logos/')) {
      const filename = path.basename(logoUrl);
      const filePath = path.join(logosDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Error deleting old logo:', error);
    // Don't throw error, just log it
  }
};