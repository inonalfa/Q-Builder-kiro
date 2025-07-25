# Requirements Document

## Introduction

Q-Builder is a comprehensive web application designed for construction professionals and contractors in Israel. The system provides a unified platform for managing price quotes, projects, clients, and payments in one place. The application aims to streamline the work of contractors and professionals, save time, prevent errors, and enable organized tracking of client work.

The system will enable the generation of professional documents (such as PDF price quotes with logos and business details) and provide full support for Hebrew and right-to-left (RTL) direction. Development will be carried out using modern technologies: React with Vite for the client-side, Zustand for state management, Tailwind CSS for UI design, and a REST API server with a relational SQL database.

## Requirements

### Requirement 1

**User Story:** As a construction professional, I want to create and manage price quotes for my clients, so that I can provide professional proposals and track their status.

#### Acceptance Criteria

1. WHEN I create a new quote THEN the system SHALL allow me to select an existing client or create a new one
2. WHEN I create a quote THEN the system SHALL allow me to add line items from a profession-specific catalog
3. WHEN I add line items THEN the system SHALL automatically calculate line totals and quote totals
4. WHEN I save a quote THEN the system SHALL generate a unique quote number and store it with "draft" status
5. WHEN I complete a quote THEN the system SHALL allow me to export it as a professional PDF with my business branding and calculate 18% VAT displaying total amount including VAT
6. WHEN I send a quote to a client THEN the system SHALL update the quote status to "sent"
7. WHEN a client accepts a quote THEN the system SHALL allow me to mark it as "accepted" and create a project

### Requirement 2

**User Story:** As a construction professional, I want to manage my clients' information, so that I can maintain organized contact records and project history.

#### Acceptance Criteria

1. WHEN I add a new client THEN the system SHALL store their contact information (name, phone, email, address)
2. WHEN I view a client THEN the system SHALL display all quotes and projects associated with that client
3. WHEN I update client information THEN the system SHALL reflect changes in all related quotes and projects
4. WHEN I delete a client THEN the system SHALL only allow deletion if no quotes or projects exist for that client
5. WHEN I create a quote THEN the system SHALL allow me to select from my existing client list

### Requirement 3

**User Story:** As a construction professional, I want to manage active projects, so that I can track work progress and payments.

#### Acceptance Criteria

1. WHEN a quote is accepted THEN the system SHALL automatically create a project linked to that quote
2. WHEN I view a project THEN the system SHALL display client details, original quote, and project status
3. WHEN I update project status THEN the system SHALL allow me to mark projects as "in progress", "completed", or "cancelled"
4. WHEN I manage a project THEN the system SHALL maintain the connection to the original accepted quote
5. WHEN I complete a project THEN the system SHALL preserve all project data for historical reference

### Requirement 4

**User Story:** As a construction professional, I want to track payments received from clients, so that I can monitor cash flow and outstanding balances.

#### Acceptance Criteria

1. WHEN I receive a payment THEN the system SHALL allow me to record it against a specific project
2. WHEN I add a payment THEN the system SHALL require date, amount, payment method, and optional notes
3. WHEN I view project payments THEN the system SHALL display all payments with running totals
4. WHEN I view payment summary THEN the system SHALL calculate total received and remaining balance including 18% VAT
5. WHEN I modify payments THEN the system SHALL update project balance calculations automatically
6. WHEN I delete a payment THEN the system SHALL recalculate project totals accordingly

### Requirement 5

**User Story:** As a construction professional, I want to maintain my business profile, so that my quotes and documents reflect current business information.

#### Acceptance Criteria

1. WHEN I set up my profile THEN the system SHALL store my business name, contact details, and logo
2. WHEN I select my profession THEN the system SHALL provide relevant catalog items for quotes
3. WHEN I update my profile THEN the system SHALL use updated information in new PDF documents
4. WHEN I generate quotes THEN the system SHALL include my business branding and contact information
5. WHEN I change my profession settings THEN the system SHALL update available catalog items accordingly

### Requirement 6

**User Story:** As a construction professional, I want to use a profession-specific catalog of work items, so that I can quickly build accurate quotes.

#### Acceptance Criteria

1. WHEN I create quote line items THEN the system SHALL provide a searchable catalog of profession-specific work items
2. WHEN I select a catalog item THEN the system SHALL populate description, unit of measure, and suggested pricing
3. WHEN I use catalog items THEN the system SHALL allow me to modify descriptions and pricing as needed
4. WHEN I add custom items THEN the system SHALL allow manual entry of description, unit, and pricing
5. WHEN I filter catalog items THEN the system SHALL show only items relevant to my selected professions

### Requirement 7

**User Story:** As a Hebrew-speaking user, I want full Hebrew and RTL support, so that I can use the system naturally in my language.

#### Acceptance Criteria

1. WHEN I use the interface THEN the system SHALL display all text in Hebrew with proper RTL layout
2. WHEN I generate PDF documents THEN the system SHALL format them in Hebrew with RTL text alignment
3. WHEN I enter dates THEN the system SHALL use Israeli date formats
4. WHEN I work with currency THEN the system SHALL default to Israeli Shekels (₪)
5. WHEN I view tables and forms THEN the system SHALL align content appropriately for RTL reading

### Requirement 8

**User Story:** As a mobile user, I want PWA functionality, so that I can access the system from any device with offline capabilities.

#### Acceptance Criteria

1. WHEN I access the application THEN the system SHALL work responsively on desktop and mobile devices
2. WHEN I install the PWA THEN the system SHALL function like a native app on my device
3. WHEN I lose internet connection THEN the system SHALL cache recent data for offline viewing
4. WHEN connection is restored THEN the system SHALL sync any pending changes automatically
5. WHEN I use the mobile interface THEN the system SHALL provide touch-friendly navigation and forms

### Requirement 9

**User Story:** As a business owner, I want secure single-user access, so that my business data remains private and organized.

#### Acceptance Criteria

1. WHEN I register THEN the system SHALL create a secure account with encrypted password storage
2. WHEN I log in THEN the system SHALL authenticate me and provide access only to my data
3. WHEN I access any feature THEN the system SHALL ensure I can only view and modify my own records
4. WHEN I perform actions THEN the system SHALL maintain data isolation between different user accounts
5. WHEN I log out THEN the system SHALL securely end my session and protect my data

### Requirement 10

**User Story:** As a construction professional, I want comprehensive dashboard overview, so that I can quickly assess my business status.

#### Acceptance Criteria

1. WHEN I access the dashboard THEN the system SHALL display summary of pending quotes and active projects
2. WHEN I view the dashboard THEN the system SHALL show recent payments and important notifications
3. WHEN quotes are expiring THEN the system SHALL alert me with appropriate warnings
4. WHEN I need quick actions THEN the system SHALL provide shortcuts to create new quotes and clients
5. WHEN I review business status THEN the system SHALL present key metrics in an easily digestible format
6. WHEN I view financial summary THEN the system SHALL display outstanding debts including 18% VAT

### Requirement 11

**User Story:** As a construction professional, I want the system to send me (and clients) real-time notifications, so that I don't miss quotes or payments.

#### Acceptance Criteria

1. WHEN a quote is marked as "sent" THEN the system SHALL send email notifications to both user and client
2. WHEN a quote is expiring in 3 days THEN the system SHALL send reminder notification to the user
3. WHEN payment is approaching (balance > 0 and project "completed") THEN the system SHALL send debt reminder
4. WHEN notifications are configured THEN the system SHALL use Email as default channel with WhatsApp support planned for future
5. WHEN I access notification settings THEN the system SHALL allow me to enable/disable notification types in "Settings > Notifications"