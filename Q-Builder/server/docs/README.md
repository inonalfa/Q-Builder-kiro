# Q-Builder API Documentation

This directory contains comprehensive API documentation for the Q-Builder backend services.

## Available Documentation

### 🔐 Authentication
- **[API_AUTHENTICATION.md](./API_AUTHENTICATION.md)** - Complete authentication system documentation
  - JWT-based authentication
  - Email/password registration and login
  - OAuth integration (Google, Apple, Microsoft)
  - User profile management
  - Password reset and change functionality
  - Token management and security features

### 👷 Profession Management
- **[API_PROFESSIONS.md](./API_PROFESSIONS.md)** - Profession management system
  - 19 predefined construction professions
  - CRUD operations for professions
  - Hebrew and English name support
  - Catalog item count aggregation
  - Database seeding functionality

### 📋 Catalog Management (Coming Soon)
- Catalog item management by profession
- CSV import functionality
- Pricing and unit management
- Search and filtering capabilities

### 👥 Client Management (Coming Soon)
- Client CRUD operations
- Contact information management
- Client search and filtering
- Client history tracking

### 💰 Quote Management (Coming Soon)
- Quote creation and management
- Line item management with catalog integration
- Quote status tracking (draft, sent, accepted, rejected, expired)
- Automatic numbering system (Q-YYYY-NNNN)
- PDF generation with Hebrew support

### 🏗️ Project Management (Coming Soon)
- Project lifecycle management
- Automatic project creation from accepted quotes
- Project status tracking
- Project numbering system (P-YYYY-NNNN)
- Integration with payment tracking

### 💳 Payment Management (Coming Soon)
- Payment tracking and history
- Multiple payment method support
- Automatic balance calculations
- Payment reminders and notifications
- VAT calculations (18% default)

### 📄 PDF Generation (Coming Soon)
- Hebrew-enabled PDF generation
- Business branding integration
- Quote and invoice templates
- RTL text rendering
- Professional document formatting

### 📧 Notification System (Coming Soon)
- Email notification infrastructure
- Quote expiry reminders
- Payment reminders
- Notification preferences management
- Scheduled notification jobs

## API Base URL

All API endpoints are available at:
```
http://localhost:3001/api/v1/
```

## Common Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Authentication

Most API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

See [API_AUTHENTICATION.md](./API_AUTHENTICATION.md) for detailed authentication documentation.

## Error Codes

Common error codes across all endpoints:

- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `CONSTRAINT_ERROR`: Database constraint violation
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints have rate limiting applied:
- Authentication endpoints: 5 attempts per 15 minutes per IP
- General API endpoints: 100 requests per 15 minutes per user
- File upload endpoints: 10 uploads per hour per user

## Development Environment

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Starting the Server
```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:3001`

### Health Check
Verify the server is running:
```bash
curl http://localhost:3001/health
```

## Database Schema

The application uses PostgreSQL with Sequelize ORM. Key models include:

- **User**: User accounts and business profiles
- **Client**: Customer information
- **Profession**: Construction profession categories
- **CatalogItem**: Service/product catalog by profession
- **Quote**: Price quotations with line items
- **Project**: Active construction projects
- **Payment**: Payment tracking and history

## Testing

API endpoints can be tested using:
- **Postman**: Import the collection from `/docs/postman/`
- **curl**: Examples provided in each documentation file
- **Jest**: Run `npm test` for automated tests

## Contributing

When adding new API endpoints:
1. Update the relevant documentation file
2. Add request/response examples
3. Include error scenarios
4. Update this README if adding new sections
5. Add Postman collection examples

## Support

For questions about the API documentation:
- Check the specific endpoint documentation
- Review the implementation in `/src/controllers/`
- Consult the database models in `/src/models/`
- Check the validation schemas in `/src/validation/`

---

Last updated: January 2025