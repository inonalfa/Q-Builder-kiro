# Project Structure

## Root Directory Layout
```
q-builder/
├── client/                 # React frontend application
├── server/                 # Node.js backend API
├── shared/                 # Shared types and utilities
├── docs/                   # Documentation
└── .kiro/                  # Kiro configuration and specs
```

## Frontend Structure (client/)
```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI components (Button, Modal, etc.)
│   │   ├── forms/         # Form-specific components
│   │   └── layout/        # Layout components (Header, Sidebar)
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── quotes/        # Quote management pages
│   │   ├── projects/      # Project management pages
│   │   ├── clients/       # Client management pages
│   │   └── profile/       # Business profile pages
│   ├── stores/            # Zustand state management
│   ├── services/          # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets (fonts, images)
├── public/                # Public assets and PWA manifest
└── package.json
```

## Backend Structure (server/)
```
server/
├── src/
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── types/            # TypeScript type definitions
├── migrations/           # Database migrations
├── seeds/               # Database seed data
│   └── catalog/         # CSV files for catalog seeding
├── uploads/             # File upload storage
└── package.json
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `QuoteForm.tsx`)
- **Pages**: PascalCase (e.g., `Dashboard.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **API routes**: kebab-case (e.g., `quote-management.ts`)

### Component Organization
- Each component in its own file
- Index files for clean imports
- Co-locate related components in feature folders

### API Structure
- RESTful endpoints following `/api/v1/` pattern
- Consistent response format with success/error structure
- Proper HTTP status codes

### Database Conventions
- Table names: snake_case, plural (e.g., `quote_items`)
- Column names: snake_case (e.g., `created_at`)
- Foreign keys: `{table}_id` format (e.g., `client_id`)

### Hebrew/RTL Support
- RTL-specific CSS classes in `src/styles/rtl.css`
- Hebrew fonts in `src/assets/fonts/`
- RTL layout components in `src/components/layout/rtl/`