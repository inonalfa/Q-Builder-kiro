# Q-Builder - מערכת ניהול הצעות מחיר

Q-Builder is a comprehensive web application designed for construction professionals and contractors in Israel. The system provides a unified platform for managing price quotes, projects, clients, and payments with full Hebrew and RTL support.

## 🎯 Purpose

Streamline contractor workflows by providing:
- Professional quote generation with catalog-based pricing
- Client relationship management
- Project tracking from quote to completion
- Payment tracking with balance calculations
- Professional PDF generation with Hebrew branding
- Mobile-friendly PWA functionality

## 🏗️ Architecture

This is a full-stack TypeScript application with:

- **Frontend**: React 18 + Vite + Apple-inspired design system with RTL support
- **Backend**: Node.js + Express.js REST API
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with Google, Apple, and Microsoft OAuth integration
- **Design System**: Comprehensive Apple Human Interface Guidelines adaptation
- **Deployment**: Kiro Cloud managed hosting

## 📁 Project Structure

```
q-builder/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand state management
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── middleware/    # Express middleware
│   ├── migrations/        # Database migrations
│   └── package.json
└── .kiro/                 # Kiro configuration and specs
    └── specs/             # Project specifications
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (for full application)
- npm or yarn

### Development Setup

#### Option 1: Design System Demo (Current)
The application is currently configured to show the Apple Design System demo:

```bash
cd client
npm install
npm run dev
```

Access the design system demo at: http://localhost:5173

#### Option 2: Full Application Setup
For the complete application with backend:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd q-builder
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configure database connection in .env
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd client
   npm install
   cp .env.example .env
   # Configure API URL in .env
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

#### Quick Start Script
Use the provided batch script for Windows:
```bash
start-dev.bat
```

## 🔧 Available Scripts

### Backend (server/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and reseed database

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📊 Development Status

### ✅ Completed Features
- **Project Foundation**: Full TypeScript setup for both frontend and backend
- **Database Schema**: Complete models and migrations for all entities
- **Authentication System**: JWT-based auth with password hashing, rate limiting, and OAuth integration (Google, Apple, Microsoft)
- **Frontend Layout**: Responsive header, sidebar, and dashboard with Hebrew/RTL support
- **API Infrastructure**: Express server with security middleware and error handling

### 🚧 Currently In Progress
- **Backend API Endpoints**: Implementing remaining CRUD operations for business logic
- **Frontend Integration**: Connecting UI components to backend APIs
- **Profession Management**: Complete implementation with database seeding for 19 specified professions and full CRUD API endpoints

### 📋 Upcoming Features
- Catalog seeding system for profession-specific items (CSV import functionality)
- PDF generation with Hebrew fonts and business branding
- Email notification system
- PWA functionality with offline support
- Comprehensive testing suite

## 🎨 Apple-Inspired Design System

Q-Builder features a comprehensive design system based on Apple's Human Interface Guidelines, adapted for Hebrew/RTL interfaces:

### Design Principles
- **Clarity**: Clean typography, ample whitespace, and clear visual hierarchy
- **Deference**: Content takes precedence over interface elements
- **Depth**: Subtle shadows and layering create visual depth without distraction
- **Consistency**: Unified design patterns across all components
- **Accessibility**: High contrast ratios and clear touch targets

### Key Features
- **Color System**: iOS-inspired color palette with full dark mode support
- **Typography**: Hebrew-optimized font stack with Apple's type scale
- **Spacing**: 8-point grid system for consistent layouts
- **Components**: Complete set of Apple-style UI components
- **Animations**: Smooth micro-interactions and transitions
- **Responsive**: Mobile-first design with Apple device breakpoints

### Component Library
- Buttons with hover effects and loading states
- Cards with subtle shadows and hover animations
- Forms with focus management and validation
- Modals with backdrop blur effects
- Navigation with glass morphism
- Tables with RTL-aware layouts
- Status indicators and badges
- Loading states and skeletons

For detailed design system documentation, see `client/src/styles/README.md`.

## 🌐 Hebrew/RTL Support

The application is built with full Hebrew and RTL support:
- RTL layout and navigation
- Hebrew date and currency formatting
- Hebrew fonts (Rubik, Heebo, Noto Sans Hebrew)
- RTL-aware form components
- Professional Hebrew PDF generation
- Apple-style components adapted for RTL

## 🎯 Target Users

Construction professionals in Israel including:
- Electricians
- Plumbers
- Painters
- General contractors
- Other skilled trades

## 📖 Documentation

- **Implementation Plan**: `.kiro/specs/q-builder-system/tasks.md`
- **Frontend README**: `client/README.md`
- **API Documentation**: `server/docs/README.md`
  - **Authentication**: `server/docs/API_AUTHENTICATION.md` (JWT + OAuth: Google, Apple, Microsoft)
  - **Profession Management**: `server/docs/API_PROFESSIONS.md` (19 construction professions)
  - **Other endpoints**: Coming soon
- **Deployment Guide**: Coming soon

## 🔒 Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS and security headers
- Input validation and sanitization
- SQL injection protection via ORM

## 🚀 Deployment

The application is designed for deployment on Kiro Cloud with:
- Managed PostgreSQL database
- SSL certificates
- File storage for business logos
- SMTP configuration for notifications
- Environment-based configuration

## 📄 License

This project is proprietary software developed for construction professionals in Israel.

---

For detailed implementation progress and task breakdown, see `.kiro/specs/q-builder-system/tasks.md`.