# Profession Management API

This document describes the profession management API endpoints for the Q-Builder system.

## Overview

The profession management system handles the 19 predefined construction professions in the Q-Builder system. Each profession has both English and Hebrew names and can be associated with catalog items.

## Predefined Professions

The system includes these 19 professions:

| English Name | Hebrew Name | Description |
|-------------|-------------|-------------|
| electrical | חשמל | Electrical work |
| plumbing | אינסטלציה | Plumbing and water systems |
| painting | צבע | Painting and coating |
| drywall | גבס | Drywall installation |
| flooring | ריצוף | Flooring and tiling |
| demolition | פירוק ופינוי | Demolition and cleanup |
| aluminum | עבודות אלומיניום | Aluminum work |
| gardening | גינות | Landscaping and gardening |
| kitchens | מטבחים | Kitchen installation |
| plastering | טיח | Plastering work |
| roofing | גגות | Roofing systems |
| waterproofing | איטום | Waterproofing |
| framework | שלד | Framework construction |
| frames | מסגרות | Frame installation |
| air-conditioning | מיזוג אוויר | HVAC systems |
| solar-heaters | דודי שמש | Solar water heaters |
| gas | גז | Gas systems |
| carpentry | נגרות ודלתות | Carpentry and doors |
| handyman | הנדימן | General handyman services |

## API Endpoints

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### GET /api/v1/professions

Get all professions with their associated catalog items count.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "electrical",
      "nameHebrew": "חשמל",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "catalogItems": [
        {
          "id": 1
        }
      ]
    }
  ],
  "message": "Professions retrieved successfully"
}
```

### GET /api/v1/professions/counts

Get all professions with catalog item counts aggregated.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "electrical",
      "nameHebrew": "חשמל",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "catalogItemCount": "5"
    }
  ],
  "message": "Professions with counts retrieved successfully"
}
```

### GET /api/v1/professions/:id

Get a specific profession by ID with all associated catalog items.

**Parameters:**
- `id` (number): Profession ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "electrical",
    "nameHebrew": "חשמל",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "catalogItems": [
      {
        "id": 1,
        "name": "Wire installation",
        "nameHebrew": "התקנת חוטים",
        "description": "Standard wire installation",
        "unit": "meter",
        "unitHebrew": "מטר",
        "basePrice": 15.50
      }
    ]
  },
  "message": "Profession retrieved successfully"
}
```

**Error Responses:**
- `400`: Invalid profession ID
- `404`: Profession not found

### POST /api/v1/professions

Create a new profession (Admin only).

**Request Body:**
```json
{
  "name": "new-profession",
  "nameHebrew": "מקצוע חדש"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 20,
    "name": "new-profession",
    "nameHebrew": "מקצוע חדש",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profession created successfully"
}
```

**Error Responses:**
- `400`: Missing required fields (name, nameHebrew)
- `409`: Profession with this name already exists

### PUT /api/v1/professions/:id

Update an existing profession (Admin only).

**Parameters:**
- `id` (number): Profession ID

**Request Body:**
```json
{
  "name": "updated-profession",
  "nameHebrew": "מקצוע מעודכן"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "updated-profession",
    "nameHebrew": "מקצוע מעודכן",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Profession updated successfully"
}
```

**Error Responses:**
- `400`: Invalid profession ID
- `404`: Profession not found
- `409`: Profession with this name already exists

### DELETE /api/v1/professions/:id

Delete a profession (Admin only).

**Parameters:**
- `id` (number): Profession ID

**Response:**
```json
{
  "success": true,
  "message": "Profession deleted successfully"
}
```

**Error Responses:**
- `400`: Invalid profession ID
- `404`: Profession not found
- `409`: Cannot delete profession with existing catalog items

### POST /api/v1/professions/seed

Seed the database with the 19 predefined professions (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "Professions seeded successfully"
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `CONSTRAINT_ERROR`: Database constraint violation
- `INTERNAL_ERROR`: Server error

## Database Schema

The `professions` table has the following structure:

```sql
CREATE TABLE professions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  name_hebrew VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Seeding Professions
```bash
curl -X POST http://localhost:3001/api/v1/professions/seed \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json"
```

### Getting All Professions
```bash
curl -X GET http://localhost:3001/api/v1/professions \
  -H "Authorization: Bearer <jwt_token>"
```

### Creating a New Profession
```bash
curl -X POST http://localhost:3001/api/v1/professions \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "custom-work",
    "nameHebrew": "עבודה מותאמת"
  }'
```

## Integration with Catalog System

Professions are linked to catalog items through the `profession_id` foreign key in the `catalog_items` table. When a profession is deleted, the system checks for existing catalog items and prevents deletion if any are found.

## Admin Permissions

Currently, all profession management operations (create, update, delete, seed) require authentication but do not have specific admin role checking implemented. This should be added in future iterations for proper access control.