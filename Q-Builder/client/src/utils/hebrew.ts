// Hebrew date formatting
export const formatHebrewDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Hebrew currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Hebrew number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('he-IL').format(num);
};

// RTL text direction utilities
export const isRTL = (text: string): boolean => {
  const rtlChars = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/;
  return rtlChars.test(text);
};

export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  return isRTL(text) ? 'rtl' : 'ltr';
};

// Hebrew months for date picker
export const hebrewMonths = [
  'ינואר',
  'פברואר', 
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר'
];

// Hebrew days of week
export const hebrewDays = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

// Quote number formatting
export const formatQuoteNumber = (number: string): string => {
  return `הצעת מחיר ${number}`;
};

// Project number formatting  
export const formatProjectNumber = (number: string): string => {
  return `פרויקט ${number}`;
};