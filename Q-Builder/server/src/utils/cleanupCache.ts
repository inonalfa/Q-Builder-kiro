import { PDFCacheService } from '../services/pdfCacheService';

/**
 * Cleanup expired PDF cache files
 */
async function cleanupExpiredCache(): Promise<void> {
  try {
    console.log('Starting PDF cache cleanup...');
    
    // Get cache stats before cleanup
    const statsBefore = PDFCacheService.getCacheStats();
    console.log(`Cache stats before cleanup:`, {
      totalFiles: statsBefore.totalFiles,
      totalSizeMB: (statsBefore.totalSize / 1024 / 1024).toFixed(2),
      oldestFile: statsBefore.oldestFile?.toISOString()
    });
    
    // Clear expired cache
    PDFCacheService.clearExpiredCache();
    
    // Get cache stats after cleanup
    const statsAfter = PDFCacheService.getCacheStats();
    console.log(`Cache stats after cleanup:`, {
      totalFiles: statsAfter.totalFiles,
      totalSizeMB: (statsAfter.totalSize / 1024 / 1024).toFixed(2),
      oldestFile: statsAfter.oldestFile?.toISOString()
    });
    
    const filesRemoved = statsBefore.totalFiles - statsAfter.totalFiles;
    const sizeFreedMB = (statsBefore.totalSize - statsAfter.totalSize) / 1024 / 1024;
    
    console.log(`Cleanup completed: ${filesRemoved} files removed, ${sizeFreedMB.toFixed(2)} MB freed`);
    
  } catch (error) {
    console.error('Error during cache cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupExpiredCache().then(() => {
    console.log('Cache cleanup finished successfully');
    process.exit(0);
  });
}

export { cleanupExpiredCache };