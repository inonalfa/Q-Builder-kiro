# Implementation Plan

- [x] 1. Set up project foundation and development environment





  - Initialize React project with Vite and TypeScript
  - Configure Tailwind CSS with RTL support and Hebrew fonts
  - Set up Zustand for state management
  - Configure React Router for navigation
  - Set up PWA configuration with service worker
  - _Requirements: 8.1, 8.2, 7.1_

- [x] 2. Implement backend API foundation




  - [x] 2.1 Set up Node.js/Express server with TypeScript


    - Initialize Express application with CORS and security middleware
    - Configure environment variables and configuration management
    - Set up error handling middleware and logging
    - _Requirements: 9.1, 9.4_

  - [x] 2.2 Set up database schema and migrations


    - Create database connection and ORM setup (Sequelize/Prisma)
    - Implement User, Client, Quote, QuoteItem, Project, Payment, Profession, CatalogItem models
    - Create database migrations with proper foreign key relationships
    - Add database indexes for performance optimization
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

  - [x] 2.3 Implement JWT authentication system


    - Create JWT token generation and validation middleware
    - Implement password hashing with bcrypt
    - Add rate limiting for authentication endpoints
    - Create user registration and login endpoints
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 3. Implement OAuth authentication integration










  - [x] 3.1 Set up Google OAuth integration


    - Configure Google OAuth 2.0 client credentials
    - Implement Google OAuth callback handling
    - Create user account linking for OAuth users
    - _Requirements: 9.1, 9.2_



  - [x] 3.2 Set up Apple OAuth integration


    - Configure Apple Sign-In credentials and certificates
    - Implement Apple OAuth callback handling
    - Handle Apple's unique user identification flow
    - _Requirements: 9.1, 9.2_

  - [x] 3.3 Set up Microsoft OAuth integration


    - Configure Microsoft OAuth 2.0 client credentials and tenant settings
    - Implement Microsoft OAuth service with Graph API integration
    - Create Microsoft OAuth token exchange and user info retrieval
    - _Requirements: 9.1, 9.2_

  - [x] 3.4 Complete OAuth route integration









    - Implement Microsoft OAuth routes and validation schemas
    - Complete OAuth user creation and JWT token generation
    - Create frontend OAuth login components with proper redirects
    - Add email verification status tracking
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 4. Implement catalog seeding system








  - [x] 4.1 Create profession seeding functionality






    - [x] Implement database seeding for the 19 specified professions
    - [x] Create Hebrew and English name mapping for professions
    - [x] Add profession management endpoints
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 4.2 Implement CSV catalog import system


    - Create CSV parser for catalog items by profession
    - Implement batch import functionality for catalog items
    - Create sample CSV files for each profession with realistic data
    - Add admin endpoint for catalog seeding
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 5. Build core business logic APIs





  - [x] 5.1 Implement client management endpoints


    - Create CRUD endpoints for client management
    - Add client validation and data sanitization
    - Implement client search and filtering capabilities
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 5.2 Implement quote management system


    - Create quote CRUD endpoints with proper validation
    - Implement quote numbering system (Q-YYYY-NNNN format)
    - Add quote status management (draft, sent, accepted, rejected, expired)
    - Create quote item management with catalog integration
    - Implement automatic total calculations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7_

  - [x] 5.3 Implement project management system


    - Create project CRUD endpoints
    - Implement automatic project creation from accepted quotes
    - Add project status management and tracking
    - Create project numbering system (P-YYYY-NNNN format)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.4 Implement payment tracking system


    - Create payment CRUD endpoints linked to projects
    - Implement payment method validation and tracking
    - Add automatic balance calculations for projects
    - Create payment history and reporting
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6. Implement PDF generation system





  - [x] 6.1 Set up Hebrew PDF generation infrastructure


    - Install and configure Hebrew fonts (Noto Sans Hebrew) for PDFKit
    - Create PDF service class with RTL text rendering utilities
    - Implement PDF template base structure with proper Hebrew layout
    - Add PDF generation route to quotes controller
    - _Requirements: 1.5, 7.2, 7.4_

  - [x] 6.2 Build quote PDF generation functionality


    - Implement business logo integration in PDF header section
    - Create client information block with RTL alignment and Hebrew formatting
    - Build items table with Hebrew headers, RTL alignment, and proper spacing
    - Add totals section with VAT calculations (subtotal, VAT 18%, total)
    - Include terms and conditions section with Hebrew text support
    - Add signature area and footer with business contact information
    - _Requirements: 1.5, 5.4, 7.2_

  - [x] 6.3 Create PDF download and caching system


    - Implement secure PDF generation endpoint with authentication
    - Add PDF file caching mechanism for performance optimization
    - Create proper HTTP headers for PDF download (filename, content-type)
    - Add error handling for PDF generation failures
    - _Requirements: 1.5_

- [x] 7. Build frontend authentication and layout


  - [x] 7.1 Create authentication pages and components
    - Build login page with email/password and OAuth options
    - Create registration page with business profile setup
    - Implement password reset functionality
    - Add OAuth login buttons with proper styling
    - _Requirements: 9.1, 9.2_

  - [x] 7.2 Implement main application layout
    - Create responsive header with navigation and user menu
    - Build RTL-compatible sidebar navigation
    - Implement mobile-friendly navigation with hamburger menu
    - Add Hebrew language support throughout the interface
    - _Requirements: 7.1, 7.3, 7.5, 8.1, 8.4_

  - [x] 7.3 Set up global state management

    - Configure Zustand stores for authentication state
    - Implement API service layer with error handling
    - Add loading states and error boundaries
    - Create notification system for user feedback
    - _Requirements: 9.3, 9.4_

  - [x] 7.4 Implement frontend routing and navigation


    - Set up React Router with protected routes for authenticated users
    - Create route guards for authentication and authorization
    - Implement proper navigation between dashboard, quotes, projects, clients
    - Add breadcrumb navigation and page titles
    - Connect existing layout components to routing system
    - Update App.tsx to use proper routing instead of design example
    - _Requirements: 8.1, 9.3_

- [x] 8. Build client management interface





  - [x] 8.1 Create client list and search interface


    - Build responsive client list with search and filtering
    - Implement client cards with contact information display
    - Add sorting capabilities by name, creation date
    - Create client list page component with proper routing
    - _Requirements: 2.2, 2.5_

  - [x] 8.2 Implement client form components


    - Create client creation and editing forms
    - Add form validation for required fields
    - Implement Hebrew input support and RTL form layout
    - Add client deletion with confirmation dialog
    - _Requirements: 2.1, 2.3, 2.4, 7.1, 7.5_

- [-] 9. Build quote management interface





  - [x] 9.1 Create quote list and filtering interface



    - Build quote list with status indicators and search
    - Implement filtering by status, client, and date ranges
    - Add quote cards showing key information and actions
    - _Requirements: 1.1, 10.1, 10.2_

  - [x] 9.2 Implement quote creation and editing forms



    - Create multi-step quote form with client selection
    - Build catalog item selector with search and filtering
    - Implement line item management with add/remove/edit capabilities
    - Add automatic calculations for line totals and quote total
    - Include terms and conditions text area
    - _Requirements: 1.1, 1.2, 1.3, 6.2, 6.3, 6.4_

  - [x] 9.3 Build quote viewing and PDF generation






    - Create quote detail view with all information display
    - Implement PDF preview and download functionality
    - Add quote status management buttons (send, accept, reject)
    - Create quote-to-project conversion interface
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [ ] 10. Build project management interface
  - [ ] 10.1 Create project list and dashboard
    - Build project list with status filtering and search
    - Implement project cards with progress indicators
    - Add quick actions for common project operations
    - _Requirements: 3.2, 3.3, 10.1, 10.2_

  - [ ] 10.2 Implement project detail interface
    - Create comprehensive project detail view
    - Display linked quote information and client details
    - Show project timeline and status management
    - Add project editing capabilities for status and details
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ] 10.3 Build payment management interface
    - Create payment list within project details
    - Implement payment addition form with validation
    - Add payment editing and deletion capabilities
    - Display payment totals and remaining balance calculations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 11. Implement business profile management
  - [ ] 11.1 Create business profile interface
    - Build profile editing form with all business information fields
    - Implement logo upload functionality with preview
    - Add profession selection with multiple choice support
    - Include form validation and Hebrew input support
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 11.2 Implement file upload system
    - Create secure file upload endpoint for business logos
    - Add image validation, resizing, and optimization
    - Implement file storage with proper access controls
    - Create file deletion and replacement functionality
    - _Requirements: 5.1, 5.4_

- [ ] 12. Implement VAT calculation system
  - [ ] 12.1 Add VAT rate configuration to user profile
    - Add vatRate field to User model with default 18% (0.18)
    - Create VAT calculation utility functions
    - Implement VAT calculations in quote totals
    - Add VAT display in quote forms and views
    - _Requirements: 1.5, 4.4, 10.6_

  - [ ] 12.2 Update PDF generation with VAT calculations
    - Modify PDF template to include VAT breakdown section
    - Display subtotal, VAT amount (18%), and total including VAT
    - Ensure proper Hebrew formatting for VAT section
    - Update quote PDF generation to use VAT calculations
    - _Requirements: 1.5, 7.2_

  - [ ] 12.3 Update payment and project balance calculations
    - Modify project balance calculations to include VAT
    - Update payment tracking to work with VAT-inclusive amounts
    - Ensure dashboard displays VAT-inclusive debt amounts
    - Update all financial summaries to include VAT
    - _Requirements: 4.4, 10.6_

- [ ] 13. Implement notification system
  - [ ] 13.1 Set up email notification infrastructure
    - Configure Nodemailer with SMTP settings
    - Create email templates for different notification types
    - Implement notification service class with email sending
    - Add notification settings to user profile model
    - _Requirements: 11.1, 11.4, 11.5_

  - [ ] 13.2 Implement quote-related notifications
    - Send email notifications when quotes are marked as sent
    - Create quote expiry reminder system (3 days before expiration)
    - Send notifications to both business owner and client
    - Add quote status change notification triggers
    - _Requirements: 11.1, 11.2_

  - [ ] 13.3 Implement payment reminder notifications
    - Create payment reminder system for completed projects with outstanding balance
    - Schedule weekly payment reminder checks
    - Send debt reminder emails with VAT-inclusive amounts
    - Include project and client details in payment reminders
    - _Requirements: 11.3_

  - [ ] 13.4 Create notification settings interface
    - Build notification preferences page in user settings
    - Allow users to enable/disable different notification types
    - Implement notification settings API endpoints
    - Add notification test functionality for users
    - _Requirements: 11.5_

  - [ ] 13.5 Set up scheduled notification jobs
    - Implement cron jobs for automated notification checks
    - Schedule daily quote expiry checks at 9 AM
    - Schedule weekly payment reminder checks
    - Add error handling and logging for notification jobs
    - _Requirements: 11.2, 11.3_

- [ ] 14. Build dashboard and overview interface
  - [ ] 14.1 Create main dashboard with business metrics
    - Display summary cards for quotes, projects, and payments
    - Implement recent activity feed with important updates
    - Add quick action buttons for common tasks
    - Show expiring quotes and overdue payments alerts
    - Include VAT-inclusive debt summary card
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 14.2 Add notification and alert system to dashboard
    - Display recent notifications and alerts on dashboard
    - Show quote expiration warnings with countdown
    - Create payment reminder alerts for overdue amounts
    - Add notification status indicators and management
    - _Requirements: 10.3, 10.4, 11.2, 11.3_

- [ ] 15. Implement PWA functionality and offline support
  - [ ] 15.1 Configure service worker and caching
    - Set up service worker for app shell caching
    - Implement offline data caching for recent quotes and projects
    - Add background sync for pending operations
    - Create offline indicator and user feedback
    - _Requirements: 8.2, 8.3, 8.4_

  - [ ] 15.2 Add PWA installation and mobile optimization
    - Configure web app manifest for installation
    - Optimize touch interactions and mobile navigation
    - Add splash screen and app icons
    - Test installation flow on various devices
    - _Requirements: 8.1, 8.2, 8.5_

- [ ] 16. Implement comprehensive testing
  - [ ] 16.1 Create backend API tests
    - Write unit tests for all API endpoints
    - Implement integration tests for authentication flow
    - Add database testing for data integrity
    - Create tests for PDF generation functionality
    - Test VAT calculations and notification system
    - _Requirements: All backend requirements_

  - [ ] 16.2 Create frontend component tests
    - Write unit tests for all React components
    - Implement integration tests for user workflows
    - Add E2E tests for critical user journeys
    - Test PWA functionality and offline capabilities
    - Test notification settings and VAT display
    - _Requirements: All frontend requirements_

- [ ] 17. Deploy and configure production environment
  - [ ] 17.1 Set up Kiro Cloud deployment
    - Configure production environment variables
    - Set up database with proper security and backups
    - Configure file storage for logos and documents
    - Implement SSL certificates and security headers
    - Configure SMTP settings for email notifications
    - _Requirements: 9.1, 9.4, 11.4_

  - [ ] 17.2 Perform production testing and optimization
    - Run full test suite in production environment
    - Test OAuth flows with production credentials
    - Verify PDF generation with Hebrew fonts and VAT calculations
    - Test email notification delivery and scheduling
    - Optimize performance and monitor system health
    - _Requirements: All requirements_