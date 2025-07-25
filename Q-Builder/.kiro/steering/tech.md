# Technology Stack

## Frontend
- **React 18** with Vite for fast development and building
- **TypeScript** for type safety
- **Zustand** for lightweight state management
- **Tailwind CSS** with RTL support for responsive styling
- **React Router** for client-side navigation
- **PWA** capabilities with Service Worker for offline functionality

## Backend
- **Node.js** with Express.js for REST API
- **TypeScript** for backend type safety
- **JWT** for stateless authentication
- **OAuth 2.0** integration (Google, Apple)
- **PDFKit** with Hebrew font support for document generation
- **Multer** for file upload handling (logos)

## Database
- **PostgreSQL** or **MySQL** for relational data storage
- **Sequelize** or **Prisma** ORM for database operations
- Proper indexing and foreign key constraints

## Infrastructure
- **Kiro Cloud** managed hosting environment
- **HTTPS** for secure communication
- **CORS** configuration for cross-origin requests
- File storage for business logos and documents

## Common Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run type-check
```

### Database
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## Key Libraries
- **bcrypt** for password hashing
- **joi** for input validation
- **cors** for cross-origin resource sharing
- **helmet** for security headers
- **rate-limiter-flexible** for API rate limiting