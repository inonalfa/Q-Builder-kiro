# 🚀 מדריך הפעלת Q-Builder במצב פיתוח

## דרישות מקדימות

1. **Node.js** (גרסה 18 ומעלה) - [הורד כאן](https://nodejs.org/)
2. **PostgreSQL** - [הורד כאן](https://www.postgresql.org/download/) או השתמש ב-Docker
3. **Git** - [הורד כאן](https://git-scm.com/)

## 🏃‍♂️ הפעלה מהירה

### שלב 1: הגדרת דאטה בייס

#### אפשרות A: PostgreSQL מקומי
1. התקן PostgreSQL
2. צור דאטה בייס בשם `qbuilder`
3. עדכן את קובץ `server/.env` עם פרטי החיבור

#### אפשרות B: Docker (מומלץ)
```bash
# הפעל PostgreSQL בקונטיינר
docker run --name qbuilder-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=qbuilder -p 5432:5432 -d postgres:15
```

### שלב 2: הפעלת הפרויקט

#### דרך 1: הפעלה אוטומטית (Windows)
```bash
# הפעל את הקובץ הבא - הוא יתקין הכל ויפעיל את השרתים
start-dev.bat
```

#### דרך 2: הפעלה ידנית

**הפעלת השרת (Backend):**
```bash
cd server
npm install
npm run db:migrate    # יצירת טבלאות
npm run db:seed       # הכנסת נתוני דוגמה
npm run dev           # הפעלת השרת
```

**הפעלת הקליינט (Frontend):**
```bash
cd client
npm install
npm run dev           # הפעלת הקליינט
```

### שלב 3: גישה לאפליקציה

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🗄️ צפייה בדאטה בייס

### כלים גרפיים (מומלץ)

1. **pgAdmin** - [הורד כאן](https://www.pgadmin.org/download/)
   - Host: `localhost`
   - Port: `5432`
   - Database: `qbuilder`
   - Username: `postgres`
   - Password: `password`

2. **DBeaver** - [הורד כאן](https://dbeaver.io/download/) (חינמי)

3. **TablePlus** - [הורד כאן](https://tableplus.com/) (בתשלום)

### כלי CLI מובנה

```bash
cd server

# הצג סטטיסטיקות כלליות
npm run db:stats

# הצג משתמשים
npm run db:users

# הצג מקצועות
npm run db:professions

# הצג פריטי קטלוג
npm run db:catalog

# הצג לקוחות
npm run db:clients

# הצג הצעות מחיר
npm run db:quotes

# הצג פרויקטים
npm run db:projects

# הצג תשלומים
npm run db:payments

# הפעל שאילתה מותאמת אישית
npx tsx src/utils/db-viewer.ts query "SELECT * FROM users LIMIT 5"
```

## 📊 טבלאות במערכת

| טבלה | תיאור | פקודת צפייה |
|------|-------|-------------|
| `users` | משתמשים ופרופילים עסקיים | `npm run db:users` |
| `professions` | מקצועות (חשמל, אינסטלציה וכו') | `npm run db:professions` |
| `catalog_items` | פריטי קטלוג לכל מקצוע | `npm run db:catalog` |
| `clients` | לקוחות | `npm run db:clients` |
| `quotes` | הצעות מחיר | `npm run db:quotes` |
| `quote_items` | פריטי הצעת מחיר | - |
| `projects` | פרויקטים | `npm run db:projects` |
| `payments` | תשלומים | `npm run db:payments` |

## 🔧 פקודות שימושיות

### ניהול דאטה בייס
```bash
cd server

# איפוס מלא של הדאטה בייס
npm run db:reset

# הפעלת מיגרציות בלבד
npm run db:migrate

# הכנסת נתוני דוגמה בלבד
npm run db:seed

# זריעת מקצועות (בפיתוח)
npm run db:seed:professions

# בדיקת חיבור לדאטה בייס
npx tsx -e "
import { sequelize } from './src/config/database';
sequelize.authenticate()
  .then(() => console.log('✅ Database connection successful'))
  .catch(err => console.error('❌ Database connection failed:', err))
  .finally(() => process.exit());
"
```

### מערכת זריעת מקצועות (בפיתוח)
המערכת כוללת פונקציונליות זריעה של 19 מקצועות מוגדרים מראש:

```bash
# זריעת מקצועות עם שמות בעברית ואנגלית
npm run db:seed:professions

# הצגת רשימת מקצועות
npm run db:professions

# API endpoints (מיושם):
# GET /api/v1/professions - רשימת כל המקצועות
# GET /api/v1/professions/counts - רשימת מקצועות עם מספר פריטי קטלוג
# GET /api/v1/professions/:id - מקצוע לפי ID
# POST /api/v1/professions - יצירת מקצוע חדש (admin)
# PUT /api/v1/professions/:id - עדכון מקצוע (admin)
# DELETE /api/v1/professions/:id - מחיקת מקצוע (admin)
# POST /api/v1/professions/seed - זריעת מקצועות (admin)
```

### פיתוח
```bash
# בדיקת טיפוסים (TypeScript)
npm run type-check

# בניית הפרויקט
npm run build

# הפעלת גרסת ייצור
npm run start
```

## 🎨 מערכת העיצוב

הפרויקט כולל מערכת עיצוב מקיפה בסגנון Apple:

- **צבעים**: פלטה בהשראת iOS
- **טיפוגרפיה**: גופנים מותאמים לעברית (Rubik, Heebo)
- **רכיבים**: כפתורים, כרטיסים, טפסים ועוד
- **RTL**: תמיכה מלאה בעברית וכיוון מימין לשמאל
- **נגישות**: תמיכה בקורא מסך וניווט במקלדת

### דוגמאות שימוש:
```tsx
import { Button, Card, Input } from './components/ui/AppleComponents';

<Card>
  <Input label="שם מלא" placeholder="הכנס שם מלא" />
  <Button variant="primary">שמור</Button>
</Card>
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - רישום משתמש חדש
- `POST /api/v1/auth/login` - התחברות
- `GET /api/v1/auth/me` - פרופיל משתמש
- `PUT /api/v1/auth/profile` - עדכון פרופיל

### Professions (מקצועות)
- `GET /api/v1/professions` - רשימת כל המקצועות
- `GET /api/v1/professions/counts` - רשימת מקצועות עם מספר פריטי קטלוג
- `GET /api/v1/professions/:id` - מקצוע לפי ID
- `POST /api/v1/professions` - יצירת מקצוע חדש (admin)
- `PUT /api/v1/professions/:id` - עדכון מקצוע (admin)
- `DELETE /api/v1/professions/:id` - מחיקת מקצוע (admin)
- `POST /api/v1/professions/seed` - זריעת מקצועות (admin)

### נתוני דוגמה
המערכת מגיעה עם 19 מקצועות מוגדרים מראש:
- חשמל, אינסטלציה, צבע, גבס, ריצוף
- פירוק ופינוי, אלומיניום, גינות, מטבחים
- טיח, גגות, איטום, שלד, מסגרות
- מיזוג אוויר, דודי שמש, גז, נגרות, הנדימן

**הערה**: מערכת זריעת המקצועות מיושמת במלואה:
- ✅ זריעת 19 המקצועות המוגדרים עם שמות בעברית ואנגלית (מיושם ב-`professionService.ts`)
- ✅ מיפוי מקצועות למשתמשים (מיושם במודל הדאטה בייס)
- ✅ API endpoints מלאים לניהול מקצועות (CRUD + seeding)

## 🐛 פתרון בעיות נפוצות

### בעיית חיבור לדאטה בייס
```bash
# בדוק שהשירות פועל
docker ps  # אם משתמש ב-Docker
# או
pg_isready -h localhost -p 5432  # אם התקנה מקומית
```

### בעיות התקנה
```bash
# נקה cache של npm
npm cache clean --force

# מחק node_modules והתקן מחדש
rm -rf node_modules package-lock.json
npm install
```

### בעיות פורט תפוס
```bash
# מצא תהליכים שמשתמשים בפורט
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# הרוג תהליך (החלף PID במספר התהליך)
taskkill /PID <PID> /F
```

## 📝 לוגים

- **Backend logs**: `server/logs/`
- **Console output**: טרמינל השרת
- **Database logs**: מופיעים בקונסול במצב פיתוח

## 🚀 פריסה לייצור

```bash
# בניית הקליינט
cd client
npm run build

# בניית השרת
cd ../server
npm run build

# הפעלת גרסת ייצור
npm run start
```

## 📞 תמיכה

אם נתקלת בבעיות:
1. בדוק את הלוגים בטרמינל
2. ודא שהדאטה בייס פועל
3. בדוק שכל התלויות מותקנות
4. נסה להפעיל `npm run db:reset` לאיפוס הדאטה בייס