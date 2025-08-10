import { User, Client, Quote, QuoteItem } from '../models';

export async function seedSampleQuotes(userId: number) {
  try {
    // Create sample clients first
    const client1 = await Client.create({
      userId,
      name: 'חברת הבנייה המובילה',
      contactPerson: 'יוסי כהן',
      phone: '050-1234567',
      email: 'yossi@building.co.il',
      address: 'רחוב הרצל 123, תל אביב'
    });

    const client2 = await Client.create({
      userId,
      name: 'פרויקטים ירוקים בע"מ',
      contactPerson: 'שרה לוי',
      phone: '052-9876543',
      email: 'sara@green-projects.co.il',
      address: 'שדרות רוטשילד 45, תל אביב'
    });

    // Create sample quotes
    const quote1 = await Quote.create({
      userId,
      clientId: client1.id,
      quoteNumber: 'Q-2025-001',
      title: 'שיפוץ משרדים קומה 3',
      issueDate: new Date('2025-01-01'),
      expiryDate: new Date('2025-02-01'),
      status: 'sent',
      totalAmount: 45000,
      currency: 'ILS',
      terms: 'תשלום בשני שלבים: 50% בתחילת העבודה, 50% בסיום'
    });

    const quote2 = await Quote.create({
      userId,
      clientId: client2.id,
      quoteNumber: 'Q-2025-002',
      title: 'התקנת מערכת סולארית',
      issueDate: new Date('2025-01-05'),
      expiryDate: new Date('2025-02-05'),
      status: 'draft',
      totalAmount: 78000,
      currency: 'ILS',
      terms: 'כולל אחריות לשנתיים'
    });

    const quote3 = await Quote.create({
      userId,
      clientId: client1.id,
      quoteNumber: 'Q-2025-003',
      title: 'צביעת חזית בניין',
      issueDate: new Date('2024-12-20'),
      expiryDate: new Date('2025-01-20'),
      status: 'accepted',
      totalAmount: 25000,
      currency: 'ILS',
      terms: 'תשלום במזומן בסיום העבודה'
    });

    // Create sample quote items
    await QuoteItem.create({
      quoteId: quote1.id,
      description: 'עבודות צבע פנים',
      unit: 'מ"ר',
      quantity: 150,
      unitPrice: 120,
      lineTotal: 18000
    });

    await QuoteItem.create({
      quoteId: quote1.id,
      description: 'החלפת רצפה',
      unit: 'מ"ר',
      quantity: 80,
      unitPrice: 200,
      lineTotal: 16000
    });

    await QuoteItem.create({
      quoteId: quote2.id,
      description: 'פאנלים סולאריים',
      unit: 'יחידה',
      quantity: 20,
      unitPrice: 3000,
      lineTotal: 60000
    });

    await QuoteItem.create({
      quoteId: quote3.id,
      description: 'צבע חוץ איכותי',
      unit: 'מ"ר',
      quantity: 200,
      unitPrice: 80,
      lineTotal: 16000
    });

    console.log('Sample quotes created successfully!');
    return { client1, client2, quote1, quote2, quote3 };
  } catch (error) {
    console.error('Error creating sample quotes:', error);
    throw error;
  }
}