# הגדרת דאטה בייס ל-Q-Builder

## התקנת PostgreSQL

### אפשרות 1: התקנה מקומית
1. הורד PostgreSQL מ: https://www.postgresql.org/download/windows/
2. התקן עם הגדרות ברירת מחדל
3. זכור את הסיסמה שהגדרת למשתמש `postgres`

### אפשרות 2: Docker (מומלץ למפתחים)
```bash
# הפעל PostgreSQL בקונטיינר
docker run --name qbuilder-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=qbuilder -p 5432:5432 -d postgres:15

# או עם docker-compose (צור קובץ docker-compose.yml)
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: qbuilder-postgres
    environment:
      POSTGRES_DB: qbuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## כלים לצפייה בדאטה בייס

### 1. pgAdmin (ממליץ) - כלי גרפי מקצועי
- הורד מ: https://www.pgadmin.org/download/
- התקן והתחבר עם הפרטים:
  - Host: localhost
  - Port: 5432
  - Database: qbuilder
  - Username: postgres
  - Password: password

### 2. DBeaver (חינמי ומצוין)
- הורד מ: https://dbeaver.io/download/
- תומך בהרבה סוגי דאטה בייס
- ממשק ידידותי למשתמש

### 3. TablePlus (בתשלום אבל מעולה)
- הורד מ: https://tableplus.com/
- ממשק יפה ומהיר
- תמיכה מעולה ב-PostgreSQL

### 4. VS Code Extensions
- PostgreSQL by Chris Kolkman
- SQLTools by Matheus Teixeira

## הגדרת הדאטה בייס

1. עדכן את קובץ `.env` בתיקיית server:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qbuilder
DB_USERNAME=postgres
DB_PASSWORD=password
```

2. הפעל את המיגרציות:
```bash
cd server
npm run db:migrate
```

3. הכנס נתוני דוגמה:
```bash
npm run db:seed
```

## פקודות שימושיות

```bash
# איפוס מלא של הדאטה בייס
npm run db:reset

# הפעלת מיגרציות בלבד
npm run db:migrate

# הכנסת נתוני דוגמה בלבד
npm run db:seed

# זריעת מקצועות (בפיתוח)
npm run db:seed:professions

# הצגת נתוני מקצועות
npm run db:professions
```

### פקודות זריעת מקצועות (בפיתוח)
```bash
# זריעת 19 המקצועות המוגדרים
npm run db:seed:professions

# בדיקת מקצועות קיימים
npm run db:professions

# זריעת פריטי קטלוג לפי מקצוע (עתידי)
npm run db:seed:catalog
```

## טבלאות במערכת

המערכת כוללת את הטבלאות הבאות:
- `users` - משתמשים ופרופילים עסקיים
- `professions` - מקצועות (חשמל, אינסטלציה וכו') - **בפיתוח פעיל**
- `catalog_items` - פריטי קטלוג לכל מקצוע
- `clients` - לקוחות
- `quotes` - הצעות מחיר
- `quote_items` - פריטי הצעת מחיר
- `projects` - פרויקטים
- `payments` - תשלומים

### מערכת מקצועות (בפיתוח)
טבלת `professions` תכלול 19 מקצועות מוגדרים מראש:
- שמות בעברית ואנגלית
- מיפוי למשתמשים (many-to-many)
- קישור לפריטי קטלוג ספציפיים למקצוע

## בדיקת חיבור

אתה יכול לבדוק את החיבור לדאטה בייס עם הפקודה:
```bash
cd server
npx tsx -e "
import { sequelize } from './src/config/database';
sequelize.authenticate()
  .then(() => console.log('✅ Database connection successful'))
  .catch(err => console.error('❌ Database connection failed:', err))
  .finally(() => process.exit());
"
```