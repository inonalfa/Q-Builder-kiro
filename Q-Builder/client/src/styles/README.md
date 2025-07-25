# מערכת עיצוב Apple לQ-Builder

מערכת עיצוב מקיפה בהשראת Apple Human Interface Guidelines, מותאמת לעברית ו-RTL עם דגש על בהירות, עקביות ונגישות.

## עקרונות עיצוב

### 🎯 עקרונות Apple המותאמים לעברית
- **בהירות (Clarity)**: טיפוגרפיה נקייה, רווחים נדיבים והיררכיה ויזואלית ברורה
- **כבוד לתוכן (Deference)**: התוכן עומד במרכז, לא אלמנטי הממשק
- **עומק (Depth)**: צללים עדינים ושכבות יוצרים עומק ויזואלי ללא הסחת דעת
- **עקביות (Consistency)**: דפוסי עיצוב אחידים בכל הרכיבים
- **נגישות (Accessibility)**: יחסי ניגודיות גבוהים ומטרות מגע ברורות

## מערכת הצבעים המלאה

### 🎨 פלטת צבעים מורחבת
```css
/* צבעים ראשיים בהשראת iOS */
--color-primary: #007AFF;        /* כחול iOS */
--color-primary-dark: #0056CC;   /* כחול כהה למצבי hover */
--color-primary-light: #CCE7FF;  /* כחול בהיר לרקעים */

/* צבעים משניים */
--color-secondary: #5856D6;      /* סגול iOS */
--color-success: #34C759;        /* ירוק iOS */
--color-warning: #FF9500;        /* כתום iOS */
--color-error: #FF3B30;          /* אדום iOS */

/* צבעים נייטרליים - סולם מלא */
--color-gray-50: #F9FAFB;        /* אפור בהיר ביותר */
--color-gray-100: #F3F4F6;       /* אפור בהיר מאוד */
--color-gray-200: #E5E7EB;       /* אפור בהיר */
--color-gray-300: #D1D5DB;       /* אפור בהיר-בינוני */
--color-gray-400: #9CA3AF;       /* אפור בינוני */
--color-gray-500: #6B7280;       /* אפור בינוני-כהה */
--color-gray-600: #4B5563;       /* אפור כהה */
--color-gray-700: #374151;       /* אפור כהה מאוד */
--color-gray-800: #1F2937;       /* כמעט שחור */
--color-gray-900: #111827;       /* שחור */
```

### 🌙 תמיכה במצב כהה
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #000000;
    --color-background-secondary: #1C1C1E;
    --color-background-tertiary: #2C2C2E;
    --color-text-primary: #FFFFFF;
    --color-text-secondary: #AEAEB2;
    --color-text-tertiary: #8E8E93;
  }
}
```

## מערכת טיפוגרפיה מתקדמת

### 🔤 גופנים מותאמים לעברית
```css
/* מחסנית גופנים מותאמת לעברית */
--font-family-primary: 'SF Pro Display', 'Rubik', 'Heebo', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-secondary: 'SF Pro Text', 'Rubik', 'Heebo', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'SF Mono', 'Fira Code', 'Courier New', monospace;
```

### 📐 סולם טיפוגרפי של Apple
```css
/* גדלי גופן לפי סולם Apple */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
```

### ✍️ מחלקות טיפוגרפיה
```css
/* כותרות */
.text-display    /* כותרת ראשית - 48px, bold */
.text-title-1    /* כותרת רמה 1 - 36px, bold */
.text-title-2    /* כותרת רמה 2 - 30px, semibold */
.text-title-3    /* כותרת רמה 3 - 24px, semibold */

/* טקסט גוף */
.text-body       /* טקסט רגיל - 16px, normal */
.text-body-emphasis /* טקסט מודגש - 16px, semibold */
.text-caption    /* טקסט משני - 14px, normal */
```

## מערכת רווחים מתקדמת

### 📏 רשת 8 פיקסלים של Apple
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

## רכיבי UI מתקדמים

### 🔘 כפתורים בסגנון Apple
```css
/* כפתור ראשי */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  min-height: 44px; /* מטרת מגע מינימלית של Apple */
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}
```

```tsx
import { Button } from '../ui/AppleComponents';

// כפתור ראשי
<Button variant="primary">שמור</Button>

// כפתור משני
<Button variant="secondary">ביטול</Button>

// כפתור הרסני
<Button variant="destructive">מחק</Button>

// כפתור עם טעינה
<Button loading={true}>שומר...</Button>
```

### 🃏 כרטיסים
```css
.card {
  background: var(--color-background);
  border-radius: 16px;
  padding: var(--spacing-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}
```
```tsx
import { Card, CardHeader, CardTitle, CardSubtitle } from '../ui/AppleComponents';

<Card>
  <CardHeader>
    <CardTitle>כותרת הכרטיס</CardTitle>
    <CardSubtitle>תת כותרת</CardSubtitle>
  </CardHeader>
  <p>תוכן הכרטיס</p>
</Card>
```

### 📝 שדות קלט
```css
.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: 12px;
  min-height: 44px;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}
```

```tsx
import { Input } from '../ui/AppleComponents';

<Input
  label="שם מלא"
  placeholder="הכנס שם מלא"
  error="שדה חובה"
  helperText="טקסט עזרה"
/>
```

### 🪟 מודלים
```css
.modal {
  background: var(--color-background);
  border-radius: 20px;
  padding: var(--spacing-8);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}
```

```tsx
import { Modal } from '../ui/AppleComponents';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="כותרת המודל"
  actions={
    <>
      <Button variant="secondary">ביטול</Button>
      <Button variant="primary">אישור</Button>
    </>
  }
>
  תוכן המודל
</Modal>
```

### 🏷️ תגי סטטוס
```css
.status-indicator {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.sent {
  background: rgba(0, 122, 255, 0.1);
  color: var(--color-primary);
}
```

```tsx
import { StatusBadge } from '../ui/AppleComponents';

<StatusBadge status="sent">נשלחה</StatusBadge>
<StatusBadge status="accepted">אושרה</StatusBadge>
<StatusBadge status="draft">טיוטה</StatusBadge>
```

### 🔄 מתגים (Switches)
```css
.switch {
  position: relative;
  width: 52px;
  height: 32px;
}

.switch-slider {
  background-color: var(--color-gray-300);
  border-radius: 16px;
  transition: var(--transition-normal);
}

.switch input:checked + .switch-slider {
  background-color: var(--color-success);
}
```

```tsx
import { Switch } from '../ui/AppleComponents';

<Switch
  checked={isEnabled}
  onChange={setIsEnabled}
  label="הפעל התראות"
/>
```

### 📊 בקרת מקטעים (Segmented Control)
```css
.segmented-control {
  display: inline-flex;
  background: var(--color-gray-100);
  border-radius: var(--border-radius-md);
  padding: 2px;
}

.segmented-control-item.active {
  background: var(--color-background);
  box-shadow: var(--shadow-sm);
}
```

```tsx
import { SegmentedControl } from '../ui/AppleComponents';

<SegmentedControl
  options={[
    { value: 'all', label: 'הכל' },
    { value: 'active', label: 'פעיל' },
    { value: 'completed', label: 'הושלם' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

### 🧭 ניווט
```css
.navbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
}

.sidebar {
  background: var(--color-background);
  border-left: 1px solid var(--color-gray-200); /* RTL */
  width: 280px;
  position: fixed;
  right: 0; /* RTL */
}
```

### 📋 טבלאות
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
}

.table th {
  background: var(--color-gray-50);
  text-align: right; /* RTL */
  font-weight: var(--font-weight-semibold);
}
```

### 🌐 תמיכה ב-RTL

המערכת מותאמת במלואה לעברית ו-RTL:

```css
/* הגדרת כיוון RTL */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* התאמת רכיבים ל-RTL */
[dir="rtl"] .sidebar {
  right: 0;
  left: auto;
}
```

### 🎭 אנימציות ומעברים

```css
/* מעברים חלקים */
.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

.slide-in-right {
  animation: slideInRight 0.3s ease forwards;
}

/* אפקט זכוכית */
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}
```

### 📱 עיצוב רספונסיבי

```css
/* נקודות שבירה */
@media (min-width: 390px) { /* iPhone 12 Pro */ }
@media (min-width: 768px) { /* iPad Mini */ }
@media (min-width: 1024px) { /* iPad Pro */ }
@media (min-width: 1280px) { /* Desktop */ }
```

### ♿ נגישות

- ניגודיות גבוהה
- תמיכה בקורא מסך
- ניווט במקלדת
- תמיכה במצב ניגודיות גבוהה
- תמיכה בהפחתת תנועה

```css
/* סגנונות פוקוס */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
}

/* תוכן לקורא מסך בלבד */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 🌙 מצב כהה

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #000000;
    --color-background-secondary: #1C1C1E;
    --color-text-primary: #FFFFFF;
    --color-text-secondary: #AEAEB2;
  }
}
```

### 🖨️ הדפסה

```css
@media print {
  .no-print {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid var(--color-gray-300);
  }
}
```

## שימוש

1. ייבא את קובץ ה-CSS הראשי:
```tsx
import './styles/apple-design.css';
```

2. השתמש ברכיבים:
```tsx
import { Button, Card, Input } from './components/ui/AppleComponents';
```

3. הוסף את התכונה `dir="rtl"` לאלמנט הבסיס:
```tsx
<div dir="rtl" className="min-h-screen bg-background-secondary">
  {/* התוכן שלך */}
</div>
```

## דוגמאות

ראה את הקובץ `AppleDesignExample.tsx` לדוגמאות מקיפות של השימוש במערכת העיצוב.

## התאמה אישית

ניתן להתאים את המשתנים ב-CSS:

```css
:root {
  --color-primary: #007AFF; /* שנה את הצבע הראשי */
  --font-family-primary: 'Rubik', sans-serif; /* שנה את הגופן */
  --spacing-4: 1rem; /* שנה את הרווחים */
}
```