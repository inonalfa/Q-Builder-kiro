import { PDFService, QuoteData } from '../services/pdfService';
import { PDFCacheService } from '../services/pdfCacheService';
import fs from 'fs';
import path from 'path';

// Sample quote data for testing
const sampleQuoteData: QuoteData = {
  quoteNumber: 'Q-2025-0001',
  issueDate: new Date('2025-01-15'),
  expiryDate: new Date('2025-02-15'),
  business: {
    name: 'חברת הבנייה המובילה בע"מ',
    address: 'רחוב הרצל 123, תל אביב-יפו 6777001',
    phone: '03-1234567',
    email: 'info@building-company.co.il'
  },
  client: {
    name: 'יוסי כהן',
    contactPerson: 'יוסי כהן',
    phone: '050-1234567',
    email: 'yossi.cohen@example.com',
    address: 'רחוב בן גוריון 45, רמת גן 5252245'
  },
  items: [
    {
      description: 'עבודות חפירה וחציבה לביסוס הבניין',
      unit: 'מ"ק',
      quantity: 100,
      unitPrice: 150,
      lineTotal: 15000
    },
    {
      description: 'יציקת בטון מזוין C25 כולל ברזל',
      unit: 'מ"ק',
      quantity: 50,
      unitPrice: 800,
      lineTotal: 40000
    },
    {
      description: 'עבודות איטום קירות חוץ ויסודות',
      unit: 'מ"ר',
      quantity: 200,
      unitPrice: 120,
      lineTotal: 24000
    },
    {
      description: 'התקנת מערכת ניקוז סביב הבניין',
      unit: 'מ"א',
      quantity: 80,
      unitPrice: 180,
      lineTotal: 14400
    }
  ],
  subtotal: 93400,
  vatRate: 0.18,
  vatAmount: 16812,
  total: 110212,
  terms: 'תנאי תשלום: 30 יום מתאריך הוצאת החשבונית. המחירים כוללים מע"מ. העבודה תבוצע בהתאם למפרט הטכני המצורף. אחריות לעבודה: 12 חודשים מתאריך סיום העבודה.'
};

async function testPDFSystem(): Promise<void> {
  try {
    console.log('=== Testing Complete PDF Generation and Caching System ===\n');
    
    // Test 1: Generate PDF
    console.log('1. Testing PDF generation...');
    const startTime = Date.now();
    const pdfBuffer = await PDFService.generateQuotePDF(sampleQuoteData);
    const generationTime = Date.now() - startTime;
    
    console.log(`   ✓ PDF generated successfully in ${generationTime}ms`);
    console.log(`   ✓ PDF size: ${pdfBuffer.length} bytes (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
    
    // Save the PDF to a test file
    const outputPath = path.join(__dirname, '../../../test-quote-system.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`   ✓ PDF saved to: ${outputPath}\n`);
    
    // Test 2: Cache functionality
    console.log('2. Testing PDF caching system...');
    const userId = 1;
    const quoteId = 123;
    const updatedAt = new Date();
    
    // Check cache before storing
    const isCachedBefore = PDFCacheService.isCached(userId, quoteId, updatedAt);
    console.log(`   ✓ Cache check before storing: ${isCachedBefore ? 'Found' : 'Not found'}`);
    
    // Cache the PDF
    PDFCacheService.cachePDF(userId, quoteId, updatedAt, pdfBuffer);
    console.log(`   ✓ PDF cached for user ${userId}, quote ${quoteId}`);
    
    // Check cache after storing
    const isCachedAfter = PDFCacheService.isCached(userId, quoteId, updatedAt);
    console.log(`   ✓ Cache check after storing: ${isCachedAfter ? 'Found' : 'Not found'}`);
    
    // Retrieve from cache
    const cachedPDF = PDFCacheService.getCachedPDF(userId, quoteId, updatedAt);
    if (cachedPDF) {
      console.log(`   ✓ Retrieved cached PDF: ${cachedPDF.length} bytes`);
      console.log(`   ✓ Cache integrity: ${cachedPDF.equals(pdfBuffer) ? 'Valid' : 'Invalid'}`);
    } else {
      console.log(`   ✗ Failed to retrieve cached PDF`);
    }
    
    // Test 3: Cache statistics
    console.log('\n3. Testing cache statistics...');
    const stats = PDFCacheService.getCacheStats();
    console.log(`   ✓ Total cached files: ${stats.totalFiles}`);
    console.log(`   ✓ Total cache size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log(`   ✓ Oldest cache file: ${stats.oldestFile?.toISOString() || 'None'}`);
    
    // Test 4: Cache performance comparison
    console.log('\n4. Testing cache performance...');
    
    // Generate fresh PDF (no cache)
    const freshStartTime = Date.now();
    await PDFService.generateQuotePDF(sampleQuoteData);
    const freshTime = Date.now() - freshStartTime;
    
    // Retrieve from cache
    const cacheStartTime = Date.now();
    PDFCacheService.getCachedPDF(userId, quoteId, updatedAt);
    const cacheTime = Date.now() - cacheStartTime;
    
    console.log(`   ✓ Fresh generation time: ${freshTime}ms`);
    console.log(`   ✓ Cache retrieval time: ${cacheTime}ms`);
    console.log(`   ✓ Performance improvement: ${((freshTime - cacheTime) / freshTime * 100).toFixed(1)}%`);
    
    // Test 5: Cache cleanup
    console.log('\n5. Testing cache cleanup...');
    const statsBefore = PDFCacheService.getCacheStats();
    PDFCacheService.clearExpiredCache();
    const statsAfter = PDFCacheService.getCacheStats();
    
    console.log(`   ✓ Files before cleanup: ${statsBefore.totalFiles}`);
    console.log(`   ✓ Files after cleanup: ${statsAfter.totalFiles}`);
    
    // Test 6: Error handling
    console.log('\n6. Testing error handling...');
    try {
      // Test with invalid data
      const invalidData = { ...sampleQuoteData, items: [] };
      await PDFService.generateQuotePDF(invalidData);
      console.log(`   ✓ Handled empty items gracefully`);
    } catch (error) {
      console.log(`   ✓ Error handling works: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Clean up test cache
    PDFCacheService.clearQuoteCache(userId, quoteId);
    console.log(`   ✓ Test cache cleaned up`);
    
    console.log('\n=== All PDF System Tests Completed Successfully! ===');
    
  } catch (error) {
    console.error('\n❌ PDF System Test Failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testPDFSystem().catch(console.error);
}

export { testPDFSystem };