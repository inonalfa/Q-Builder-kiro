import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class PDFCacheService {
  private static readonly CACHE_DIR = path.join(__dirname, '../cache/pdfs');
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache PDFs for 24 hours

  /**
   * Initialize cache directory
   */
  private static ensureCacheDir(): void {
    if (!fs.existsSync(this.CACHE_DIR)) {
      fs.mkdirSync(this.CACHE_DIR, { recursive: true });
    }
  }

  /**
   * Generate cache key for a quote PDF
   */
  private static generateCacheKey(userId: number, quoteId: number, quoteUpdatedAt: Date): string {
    const data = `${userId}-${quoteId}-${quoteUpdatedAt.getTime()}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Get cached PDF file path
   */
  private static getCacheFilePath(cacheKey: string): string {
    return path.join(this.CACHE_DIR, `${cacheKey}.pdf`);
  }

  /**
   * Check if cached PDF exists and is valid
   */
  public static isCached(userId: number, quoteId: number, quoteUpdatedAt: Date): boolean {
    try {
      this.ensureCacheDir();
      
      const cacheKey = this.generateCacheKey(userId, quoteId, quoteUpdatedAt);
      const cacheFilePath = this.getCacheFilePath(cacheKey);
      
      if (!fs.existsSync(cacheFilePath)) {
        return false;
      }

      // Check if cache is expired
      const stats = fs.statSync(cacheFilePath);
      const cacheAge = Date.now() - stats.mtime.getTime();
      const maxAge = this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Convert to milliseconds

      if (cacheAge > maxAge) {
        // Remove expired cache
        fs.unlinkSync(cacheFilePath);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Error checking PDF cache:', error);
      return false;
    }
  }

  /**
   * Get cached PDF buffer
   */
  public static getCachedPDF(userId: number, quoteId: number, quoteUpdatedAt: Date): Buffer | null {
    try {
      if (!this.isCached(userId, quoteId, quoteUpdatedAt)) {
        return null;
      }

      const cacheKey = this.generateCacheKey(userId, quoteId, quoteUpdatedAt);
      const cacheFilePath = this.getCacheFilePath(cacheKey);
      
      return fs.readFileSync(cacheFilePath);
    } catch (error) {
      console.warn('Error reading cached PDF:', error);
      return null;
    }
  }

  /**
   * Cache PDF buffer
   */
  public static cachePDF(
    userId: number, 
    quoteId: number, 
    quoteUpdatedAt: Date, 
    pdfBuffer: Buffer
  ): void {
    try {
      this.ensureCacheDir();
      
      const cacheKey = this.generateCacheKey(userId, quoteId, quoteUpdatedAt);
      const cacheFilePath = this.getCacheFilePath(cacheKey);
      
      fs.writeFileSync(cacheFilePath, pdfBuffer);
      
      console.log(`PDF cached for quote ${quoteId} with key ${cacheKey}`);
    } catch (error) {
      console.warn('Error caching PDF:', error);
      // Don't throw error - caching failure shouldn't break PDF generation
    }
  }

  /**
   * Clear cache for a specific quote
   */
  public static clearQuoteCache(userId: number, quoteId: number): void {
    try {
      this.ensureCacheDir();
      
      // Since we don't know the exact updatedAt, we need to find and remove all cache files for this quote
      const files = fs.readdirSync(this.CACHE_DIR);
      
      files.forEach(file => {
        if (file.startsWith(`${userId}-${quoteId}-`) && file.endsWith('.pdf')) {
          const filePath = path.join(this.CACHE_DIR, file);
          fs.unlinkSync(filePath);
          console.log(`Cleared cache file: ${file}`);
        }
      });
    } catch (error) {
      console.warn('Error clearing quote cache:', error);
    }
  }

  /**
   * Clear all expired cache files
   */
  public static clearExpiredCache(): void {
    try {
      this.ensureCacheDir();
      
      const files = fs.readdirSync(this.CACHE_DIR);
      const maxAge = this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
      let clearedCount = 0;
      
      files.forEach(file => {
        const filePath = path.join(this.CACHE_DIR, file);
        const stats = fs.statSync(filePath);
        const cacheAge = Date.now() - stats.mtime.getTime();
        
        if (cacheAge > maxAge) {
          fs.unlinkSync(filePath);
          clearedCount++;
        }
      });
      
      if (clearedCount > 0) {
        console.log(`Cleared ${clearedCount} expired PDF cache files`);
      }
    } catch (error) {
      console.warn('Error clearing expired cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  public static getCacheStats(): { totalFiles: number; totalSize: number; oldestFile: Date | null } {
    try {
      this.ensureCacheDir();
      
      const files = fs.readdirSync(this.CACHE_DIR);
      let totalSize = 0;
      let oldestFile: Date | null = null;
      
      files.forEach(file => {
        const filePath = path.join(this.CACHE_DIR, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        if (!oldestFile || stats.mtime < oldestFile) {
          oldestFile = stats.mtime;
        }
      });
      
      return {
        totalFiles: files.length,
        totalSize,
        oldestFile
      };
    } catch (error) {
      console.warn('Error getting cache stats:', error);
      return { totalFiles: 0, totalSize: 0, oldestFile: null };
    }
  }
}