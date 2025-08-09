import { PDFService, QuoteData } from '../services/pdfService';
import fs from 'fs';
import path from 'path';

// Sample quote data for testing
const sampleQuoteData: QuoteData = {
  quoteNumber: 'Q-2025-0001',
  issueDate: new Date('2025-01-15'),
  expiryDate: new Date('2025-02-15'),
  business: {
    name: 'חברת הבנייה המובילה',
    address: 'רחוב הרצל 123, תל אביב',
    phone: '03-1234567',
    email: 'info@building-company.co.il'
  },
  client: {
    name: 'יוסי כהן',
    contactPerson: 'יוסי כהן',
    phone: '050-1234567',
    email: 'yossi@example.com',
    address: 'רחוב בן גוריון 45, רמת גן'
  },
  items: [
    {
      description: 'עבודות חפירה וחציבה',
      unit: 'מ"ק',
      quantity: 100,
      unitPrice: 150,
      lineTotal: 15000
    },
    {
      description: 'יציקת בטון מזוין',
      unit: 'מ"ק',
      quantity: 50,
      unitPrice: 800,
      lineTotal: 40000
    },
    {
      description: 'עבודות איטום',
      unit: 'מ"ר',
      quantity: 200,
      unitPrice: 120,
      lineTotal: 24000
    }
  ],
  subtotal: 79000,
  vatRate: 0.18,
  vatAmount: 14220,
  total: 93220,
  terms: 'תנאי תשלום: 30 יום מתאריך הוצאת החשבונית. העבודה תבוצע בהתאם למפרט הטכני המצורף.'
};

async function testPDFGeneration() {
  try {
    console.log('Testing PDF generation...');
    
    const pdfBuffer = await PDFService.generateQuotePDF(sampleQuoteData);
    
    // Save the PDF to a test file
    const outputPath = path.join(__dirname, '../../../test-quote.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`PDF generated successfully! Saved to: ${outputPath}`);
    console.log(`PDF size: ${pdfBuffer.length} bytes`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Run the test
if (require.main === module) {
  testPDFGeneration();
}

export { testPDFGeneration };