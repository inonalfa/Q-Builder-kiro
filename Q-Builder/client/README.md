# Q-Builder Frontend - מערכת ניהול הצעות מחיר

This is the React frontend application for Q-Builder, a comprehensive web application designed for construction professionals and contractors in Israel.

> 📖 **For complete project overview and setup instructions, see the [main README](../README.md)**

## Current Status: Apple Design System Demo

The application is currently configured to showcase the comprehensive Apple-inspired design system. This demo displays all the UI components, patterns, and interactions that will be used throughout the Q-Builder application.

### What's Currently Available
- **Complete Design System**: Apple Human Interface Guidelines adapted for Hebrew/RTL
- **Interactive Components**: Buttons, cards, forms, modals, tables, and navigation
- **Hebrew/RTL Layout**: Proper right-to-left support with Hebrew typography
- **Responsive Design**: Mobile-first approach with Apple device breakpoints
- **Dark Mode Support**: Automatic color scheme adaptation
- **Accessibility Features**: Focus management, screen reader support, high contrast

### Switching Between Demo and Full Application

The application is currently showing the design system demo. To switch to the full application:

1. **For Design System Demo** (current):
   ```tsx
   // src/App.tsx
   import AppleDesignExample from './components/examples/AppleDesignExample';
   
   function App() {
     return <AppleDesignExample />;
   }
   ```

2. **For Full Application** (when backend is ready):
   ```tsx
   // src/App.tsx - Uncomment this code when ready
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Layout from './components/layout/Layout';
   import Dashboard from './pages/dashboard/Dashboard';
   // ... other imports
   
   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<Layout />}>
             <Route index element={<Dashboard />} />
             {/* Other routes */}
           </Route>
         </Routes>
       </Router>
     );
   }
   ```

## Frontend Features

- **Modern React Stack**: React 18 with TypeScript for type safety
- **Apple Design Language**: Comprehensive design system with iOS-inspired components
- **Hebrew/RTL Support**: Complete right-to-left layout and Hebrew language support
- **Responsive Design**: Mobile-first design with Tailwind CSS and Apple breakpoints
- **State Management**: Zustand for lightweight, efficient state management (ready for integration)
- **Authentication**: JWT-based authentication system (ready for integration)
- **PWA Ready**: Progressive Web App capabilities for mobile installation

## Technology Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Zustand** for lightweight state management
- **Tailwind CSS** with RTL support
- **React Router** for navigation
- **PWA** capabilities with Service Worker

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   
   The development server will start on port 5173 and show the Apple Design System demo.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard
│   ├── quotes/        # Quote management
│   ├── projects/      # Project management
│   └── clients/       # Client management
├── stores/            # Zustand state management
├── services/          # API service layer
├── utils/             # Utility functions
├── types/             # TypeScript definitions
└── assets/            # Static assets
```

## Authentication

The application includes a login system with:
- Email/password authentication
- JWT token management
- OAuth integration (Google, Apple) - coming soon
- Persistent authentication state

## Hebrew/RTL Support

- Full RTL layout support
- Hebrew date and currency formatting
- Hebrew fonts (Noto Sans Hebrew)
- RTL-aware components and styling

## Development Status

This project is currently in active development. Key completed features:

### ✅ Completed
- **Frontend Foundation**: React 18 + TypeScript + Vite setup with Tailwind CSS and RTL support
- **Backend API Foundation**: Express.js server with TypeScript, security middleware, and error handling
- **Database Schema**: Complete database models and migrations for all entities (Users, Clients, Quotes, Projects, Payments, etc.)
- **JWT Authentication**: Secure authentication system with password hashing and token management
- **Main Layout**: Responsive header, sidebar navigation, and dashboard with Hebrew/RTL support

### 🚧 In Progress
- **Backend API Foundation**: Finalizing remaining API endpoints and business logic

### 📋 Upcoming
- OAuth integration (Google, Apple)
- Catalog seeding system
- Core business logic APIs (clients, quotes, projects, payments)
- PDF generation with Hebrew support
- Notification system
- PWA functionality

See `.kiro/specs/q-builder-system/tasks.md` for detailed implementation progress and task breakdown.
