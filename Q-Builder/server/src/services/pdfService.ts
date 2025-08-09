import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface ClientInfo {
  name: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
}

export interface QuoteItem {
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface QuoteData {
  quoteNumber: string;
  issueDate: Date;
  expiryDate: Date;
  business: BusinessInfo;
  client: ClientInfo;
  items: QuoteItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms?: string;
}

export class PDFService {
  private static readonly FONTS_DIR = path.join(__dirname, '../assets/fonts');
  private static readonly HEBREW_FONT_REGULAR = 'NotoSansHebrew-Regular.ttf';
  private static readonly HEBREW_FONT_BOLD = 'NotoSansHebrew-Bold.ttf';

  /**
   * Initialize Hebrew fonts for PDF generation
   */
  private static async initializeFonts(doc: PDFKit.PDFDocument): Promise<void> {
    try {
      // For now, use built-in fonts that support Hebrew characters
      // PDFKit's built-in fonts have limited Hebrew support, but this is a starting point
      doc.registerFont('HebrewRegular', 'Helvetica');
      doc.registerFont('HebrewBold', 'Helvetica-Bold');

      // Set default font to Hebrew-supporting font
      doc.font('HebrewRegular');
    } catch (error) {
      console.warn('Failed to load Hebrew fonts, using fallback:', error);
      // Use system default font as fallback
      doc.font('Helvetica');
    }
  }

  /**
   * Create RTL text rendering utility
   */
  private static renderRTLText(
    doc: PDFKit.PDFDocument,
    text: string,
    x: number,
    y: number,
    options: any = {}
  ): void {
    // For RTL text, we need to adjust the alignment
    const rtlOptions = {
      ...options,
      align: options.align || 'right',
      direction: 'rtl'
    };

    doc.text(text, x, y, rtlOptions);
  }

  /**
   * Create a new PDF document with Hebrew support
   */
  private static createDocument(): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      },
      info: {
        Title: 'הצעת מחיר', // "Price Quote" in Hebrew
        Author: 'Q-Builder System',
        Subject: 'Price Quote Document'
      }
    });

    return doc;
  }

  /**
   * Add business logo to PDF header section
   */
  private static async addBusinessLogo(
    doc: PDFKit.PDFDocument,
    logoUrl?: string
  ): Promise<void> {
    if (!logoUrl) return;

    try {
      // If logoUrl is a local file path
      if (fs.existsSync(logoUrl)) {
        // Add logo to top-left corner with proper sizing
        doc.image(logoUrl, 50, 50, { 
          width: 120, 
          height: 80,
          fit: [120, 80],
          align: 'center',
          valign: 'center'
        });
      }
    } catch (error) {
      console.warn('Failed to add business logo:', error);
      // Continue without logo if it fails
    }
  }

  /**
   * Add business information block with RTL alignment and Hebrew formatting
   */
  private static addBusinessInfo(
    doc: PDFKit.PDFDocument,
    business: BusinessInfo
  ): void {
    const startX = 350;
    let currentY = 50;

    // Business name - larger and bold
    doc.font('HebrewBold').fontSize(16);
    this.renderRTLText(doc, business.name, startX, currentY, { width: 200 });
    
    currentY += 25;
    
    // Business address
    doc.font('HebrewRegular').fontSize(11);
    this.renderRTLText(doc, business.address, startX, currentY, { width: 200 });
    
    currentY += 18;
    
    // Phone with Hebrew label
    this.renderRTLText(doc, `טלפון: ${business.phone}`, startX, currentY, { width: 200 });
    
    currentY += 18;
    
    // Email with Hebrew label
    this.renderRTLText(doc, `דוא"ל: ${business.email}`, startX, currentY, { width: 200 });
    
    // Add a subtle line separator
    currentY += 25;
    doc.moveTo(startX, currentY)
       .lineTo(startX + 200, currentY)
       .strokeColor('#CCCCCC')
       .lineWidth(0.5)
       .stroke()
       .strokeColor('#000000')
       .lineWidth(1);
  }

  /**
   * Add quote header information
   */
  private static addQuoteHeader(
    doc: PDFKit.PDFDocument,
    quoteData: QuoteData
  ): void {
    const startY = 150;
    
    // Quote title
    doc.font('HebrewBold').fontSize(18);
    this.renderRTLText(doc, 'הצעת מחיר', 300, startY, { width: 200 });

    // Quote details
    doc.font('HebrewRegular').fontSize(12);
    let currentY = startY + 30;

    this.renderRTLText(doc, `מספר הצעה: ${quoteData.quoteNumber}`, 400, currentY, { width: 150 });
    
    currentY += 20;
    this.renderRTLText(doc, `תאריך הנפקה: ${this.formatHebrewDate(quoteData.issueDate)}`, 400, currentY, { width: 150 });
    
    currentY += 20;
    this.renderRTLText(doc, `תוקף עד: ${this.formatHebrewDate(quoteData.expiryDate)}`, 400, currentY, { width: 150 });
  }

  /**
   * Add client information block with RTL alignment and Hebrew formatting
   */
  private static addClientInfo(
    doc: PDFKit.PDFDocument,
    client: ClientInfo
  ): void {
    const startX = 50;
    let currentY = 200;

    // Client section header
    doc.font('HebrewBold').fontSize(14);
    this.renderRTLText(doc, 'פרטי לקוח:', startX, currentY, { width: 250 });
    
    // Add background box for client info
    doc.rect(startX - 10, currentY + 15, 250, 80)
       .fillColor('#F8F9FA')
       .fill()
       .strokeColor('#E9ECEF')
       .stroke()
       .fillColor('#000000');
    
    currentY += 25;
    
    // Client name
    doc.font('HebrewBold').fontSize(12);
    this.renderRTLText(doc, client.name, startX, currentY, { width: 230 });
    
    currentY += 18;
    
    // Contact person (if different from client name)
    if (client.contactPerson && client.contactPerson !== client.name) {
      doc.font('HebrewRegular').fontSize(10);
      this.renderRTLText(doc, `איש קשר: ${client.contactPerson}`, startX, currentY, { width: 230 });
      currentY += 15;
    }
    
    // Phone
    doc.font('HebrewRegular').fontSize(10);
    this.renderRTLText(doc, `טלפון: ${client.phone}`, startX, currentY, { width: 230 });
    
    currentY += 15;
    
    // Address
    this.renderRTLText(doc, `כתובת: ${client.address}`, startX, currentY, { width: 230 });
  }

  /**
   * Format date in Hebrew format
   */
  private static formatHebrewDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Add items table with Hebrew headers, RTL alignment, and proper spacing
   */
  private static addItemsTable(
    doc: PDFKit.PDFDocument,
    items: QuoteItem[]
  ): void {
    const tableTop = 320;
    const tableLeft = 50;
    const tableWidth = 500;
    
    // Table headers in Hebrew (RTL order)
    const headers = ['סה"כ', 'מחיר יחידה', 'כמות', 'יחידה', 'תיאור'];
    const columnWidths = [90, 90, 70, 70, 180];
    
    // Draw table header background
    doc.rect(tableLeft, tableTop - 5, tableWidth, 25)
       .fillColor('#E3F2FD')
       .fill()
       .strokeColor('#1976D2')
       .stroke()
       .fillColor('#000000');
    
    // Draw table headers
    doc.font('HebrewBold').fontSize(11);
    let currentX = tableLeft + tableWidth;
    
    headers.forEach((header, index) => {
      currentX -= columnWidths[index];
      this.renderRTLText(doc, header, currentX + 5, tableTop + 5, { 
        width: columnWidths[index] - 10,
        align: 'center'
      });
    });

    // Draw header bottom line
    doc.moveTo(tableLeft, tableTop + 20)
       .lineTo(tableLeft + tableWidth, tableTop + 20)
       .strokeColor('#1976D2')
       .lineWidth(1)
       .stroke()
       .strokeColor('#000000');

    // Draw table rows
    doc.font('HebrewRegular').fontSize(10);
    let currentY = tableTop + 30;

    items.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 1) {
        doc.rect(tableLeft, currentY - 5, tableWidth, 20)
           .fillColor('#F5F5F5')
           .fill()
           .fillColor('#000000');
      }

      currentX = tableLeft + tableWidth;
      
      // Total (right-most column)
      currentX -= columnWidths[0];
      doc.text(`₪${item.lineTotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`, 
               currentX + 5, currentY, { 
                 width: columnWidths[0] - 10, 
                 align: 'center' 
               });
      
      // Unit price
      currentX -= columnWidths[1];
      doc.text(`₪${item.unitPrice.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`, 
               currentX + 5, currentY, { 
                 width: columnWidths[1] - 10, 
                 align: 'center' 
               });
      
      // Quantity
      currentX -= columnWidths[2];
      doc.text(item.quantity.toLocaleString('he-IL'), 
               currentX + 5, currentY, { 
                 width: columnWidths[2] - 10, 
                 align: 'center' 
               });
      
      // Unit
      currentX -= columnWidths[3];
      this.renderRTLText(doc, item.unit, currentX + 5, currentY, { 
        width: columnWidths[3] - 10,
        align: 'center'
      });
      
      // Description (left-most column)
      currentX -= columnWidths[4];
      this.renderRTLText(doc, item.description, currentX + 5, currentY, { 
        width: columnWidths[4] - 10 
      });
      
      currentY += 20;
    });

    // Draw table border
    doc.rect(tableLeft, tableTop - 5, tableWidth, currentY - tableTop + 15)
       .strokeColor('#CCCCCC')
       .stroke()
       .strokeColor('#000000');

    // Draw vertical column separators
    let separatorX = tableLeft;
    columnWidths.forEach((width, index) => {
      if (index < columnWidths.length - 1) {
        separatorX += width;
        doc.moveTo(separatorX, tableTop - 5)
           .lineTo(separatorX, currentY + 10)
           .strokeColor('#CCCCCC')
           .stroke()
           .strokeColor('#000000');
      }
    });
  }

  /**
   * Add totals section with VAT calculations (subtotal, VAT 18%, total)
   */
  private static addTotalsSection(
    doc: PDFKit.PDFDocument,
    quoteData: QuoteData
  ): void {
    const startX = 300;
    let currentY = 500;
    const boxWidth = 250;

    // Draw totals box background
    doc.rect(startX - 10, currentY - 10, boxWidth, 90)
       .fillColor('#F8F9FA')
       .fill()
       .strokeColor('#1976D2')
       .lineWidth(1)
       .stroke()
       .fillColor('#000000');

    // Subtotal
    doc.font('HebrewRegular').fontSize(12);
    this.renderRTLText(doc, 'סכום ביניים:', startX, currentY, { width: 120 });
    doc.text(`₪${quoteData.subtotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`, 
             startX + 120, currentY, { width: 110, align: 'left' });
    
    currentY += 20;
    
    // VAT calculation
    const vatPercentage = (quoteData.vatRate * 100).toFixed(0);
    this.renderRTLText(doc, `מע"מ (${vatPercentage}%):`, startX, currentY, { width: 120 });
    doc.text(`₪${quoteData.vatAmount.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`, 
             startX + 120, currentY, { width: 110, align: 'left' });
    
    // Add separator line
    currentY += 25;
    doc.moveTo(startX, currentY - 5)
       .lineTo(startX + 220, currentY - 5)
       .strokeColor('#1976D2')
       .lineWidth(1)
       .stroke()
       .strokeColor('#000000');
    
    // Total amount - highlighted
    doc.font('HebrewBold').fontSize(14);
    this.renderRTLText(doc, 'סה"כ לתשלום:', startX, currentY, { width: 120 });
    doc.fillColor('#1976D2')
       .text(`₪${quoteData.total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`, 
             startX + 120, currentY, { width: 110, align: 'left' })
       .fillColor('#000000');
  }

  /**
   * Add terms and conditions section with Hebrew text support
   */
  private static addTermsSection(
    doc: PDFKit.PDFDocument,
    terms?: string
  ): void {
    if (!terms) {
      // Add default terms if none provided
      terms = 'תנאי תשלום: 30 יום מתאריך הוצאת החשבונית. המחירים כוללים מע"מ. העבודה תבוצע בהתאם למפרט הטכני.';
    }

    const startY = 620;
    
    // Terms header
    doc.font('HebrewBold').fontSize(12);
    this.renderRTLText(doc, 'תנאים והערות:', 50, startY, { width: 500 });
    
    // Terms box background
    doc.rect(50, startY + 20, 500, 60)
       .fillColor('#FFFBF0')
       .fill()
       .strokeColor('#FFC107')
       .stroke()
       .fillColor('#000000');
    
    // Terms content
    doc.font('HebrewRegular').fontSize(10);
    this.renderRTLText(doc, terms, 60, startY + 30, { 
      width: 480,
      lineGap: 2
    });
  }

  /**
   * Add signature area and footer with business contact information
   */
  private static addSignatureAndFooter(
    doc: PDFKit.PDFDocument,
    business: BusinessInfo
  ): void {
    const pageHeight = 792; // A4 height in points
    const footerY = pageHeight - 120;
    
    // Signature area with boxes
    doc.font('HebrewRegular').fontSize(10);
    
    // Client signature
    this.renderRTLText(doc, 'חתימת הלקוח:', 50, footerY - 40, { width: 100 });
    doc.rect(150, footerY - 45, 120, 20)
       .strokeColor('#CCCCCC')
       .stroke()
       .strokeColor('#000000');
    
    // Date
    this.renderRTLText(doc, 'תאריך:', 300, footerY - 40, { width: 50 });
    doc.rect(350, footerY - 45, 80, 20)
       .strokeColor('#CCCCCC')
       .stroke()
       .strokeColor('#000000');
    
    // Business signature
    this.renderRTLText(doc, 'חתימת הקבלן:', 450, footerY - 40, { width: 100 });
    doc.rect(450, footerY - 20, 100, 20)
       .strokeColor('#CCCCCC')
       .stroke()
       .strokeColor('#000000');
    
    // Footer separator line
    doc.moveTo(50, footerY + 10)
       .lineTo(550, footerY + 10)
       .strokeColor('#CCCCCC')
       .stroke()
       .strokeColor('#000000');
    
    // Footer with business contact information
    doc.font('HebrewRegular').fontSize(9);
    const footerText = `${business.name} • טלפון: ${business.phone} • דוא"ל: ${business.email}`;
    doc.text(footerText, 50, footerY + 20, { 
      width: 500, 
      align: 'center',
      fillColor: '#666666'
    }).fillColor('#000000');
    
    // Add page number
    doc.fontSize(8);
    doc.text('עמוד 1', 520, footerY + 35, { 
      width: 30, 
      align: 'center',
      fillColor: '#999999'
    }).fillColor('#000000');
  }

  /**
   * Generate PDF quote document
   */
  public static async generateQuotePDF(quoteData: QuoteData): Promise<Buffer> {
    const doc = this.createDocument();
    
    // Initialize Hebrew fonts
    await this.initializeFonts(doc);
    
    // Add all sections
    await this.addBusinessLogo(doc, quoteData.business.logoUrl);
    this.addBusinessInfo(doc, quoteData.business);
    this.addQuoteHeader(doc, quoteData);
    this.addClientInfo(doc, quoteData.client);
    this.addItemsTable(doc, quoteData.items);
    this.addTotalsSection(doc, quoteData);
    this.addTermsSection(doc, quoteData.terms);
    this.addSignatureAndFooter(doc, quoteData.business);
    
    // Finalize the PDF
    doc.end();
    
    // Convert to buffer
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      
      doc.on('error', (error) => {
        reject(error);
      });
    });
  }
}