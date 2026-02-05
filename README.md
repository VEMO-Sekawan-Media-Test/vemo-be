# VEMO - Vehicle Monitoring & Booking System

A vehicle monitoring and booking system for a nickel mining company with multiple regions, branches, and mining sites.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
src/
├── auth/               # Authentication module
│   ├── controllers/   # Auth controllers
│   ├── services/      # Auth business logic
│   ├── modules/        # Auth module definition
│   ├── guards/         # JWT auth guards
│   ├── strategies/     # JWT strategies
│   └── dto/            # Auth DTOs
├── bookings/           # Bookings management
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   ├── dto/
│   └── entities/
├── vehicles/           # Vehicles management
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   ├── dto/
│   └── entities/
├── maintenance/        # Maintenance scheduling
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   └── dto/
├── reports/            # Reports & statistics
│   ├── controllers/
│   ├── services/
│   └── modules/
├── root/               # Health check & info
├── prisma/             # Database schema & migrations
└── config/             # Configuration files
```

## Using Supabase for PostgreSQL

This project supports using [Supabase](https://supabase.com/) as the PostgreSQL database provider. Supabase provides a hosted PostgreSQL database with additional features like auto-generated APIs, real-time subscriptions, and a web-based SQL editor.

### Setting up Supabase

1. Create a free account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Project Settings > Database to get your connection string
4. Use the Supabase connection string in your `.env` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Requirements

- Node.js 18+
- PostgreSQL 17+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# For local development
DATABASE_URL="postgresql://user:password@localhost:5432/vemo_db"

# For Supabase (recommended)
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

JWT_SECRET="your-secret-jwt-key"
PORT=3000
```

## Health Check

The root endpoint provides health check and API information:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check - returns status, timestamp, and service name |
| `/info` | GET | API information - returns version and documentation link |

Example response for `/`:
```json
{
  "status": "ok",
  "timestamp": "2026-02-05T05:45:00.000Z",
  "service": "VEMO - Vehicle Monitoring & Booking System"
}
```

## API Documentation

After starting the server, access Swagger documentation at:
```
http://localhost:3000/api
```

## Default Users (after seeding)

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin_vemo | password123 | ADMIN | Admin VEMO |
| manager_1 | password123 | APPROVER | Manager Operasional |
| director_2 | password123 | APPROVER | Direktur Regional |

## API Endpoints

### Authentication
- `POST /auth/login` - Login to get JWT token

### Vehicles
- `GET /vehicles` - Get all vehicles
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles` - Create new vehicle (requires auth)
- `PATCH /vehicles/:id` - Update vehicle (requires auth)
- `DELETE /vehicles/:id` - Delete vehicle (requires auth)

### Bookings
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create booking (requires auth)
- `PATCH /bookings/:id/approve` - Approve booking (requires auth)
- `PATCH /bookings/:id/reject` - Reject booking (requires auth)
- `PATCH /bookings/:id/complete` - Complete booking with fuel data (requires auth)

### Reports
- `GET /reports/export-excel` - Export all bookings data to Excel file
- `GET /reports/stats` - Get vehicle usage statistics for charts

### Maintenance
- `GET /maintenance` - Get all maintenance records
- `GET /maintenance/:id` - Get maintenance by ID
- `GET /maintenance/upcoming` - Get upcoming maintenance (query param: days)
- `GET /maintenance/vehicle/:id` - Get vehicle maintenance history
- `POST /maintenance` - Schedule maintenance (requires auth)
- `PATCH /maintenance/:id/complete` - Mark maintenance as completed (requires auth)

## Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `name` - Full name
- `role` - ADMIN or APPROVER

### Vehicles
- `id` - Primary key
- `modelName` - Vehicle model name
- `plateNumber` - Unique license plate
- `type` - Personnel or Freight
- `ownership` - Company or Rental
- `location` - Kantor Pusat, Cabang, Tambang A-F
- `fuelConsumption` - Liters per km
- `lastService` - Last service date
- `currentFuel` - Current fuel percentage

### Bookings
- `id` - Primary key
- `vehicleId` - Foreign key to Vehicle
- `driverName` - Driver name
- `creatorId` - Foreign key to User (creator)
- `approver1Id` - Foreign key to User (level 1 approver)
- `approver2Id` - Foreign key to User (level 2 approver)
- `status` - 0: Pending, 1: Lvl1 Approved, 2: Final Approved, -1: Rejected
- `startDate` - Booking start date
- `endDate` - Booking end date
- `fuelStart` - Fuel level at start
- `fuelEnd` - Fuel level at end
- `distanceKm` - Distance traveled
- `fuelUsed` - Calculated fuel used

### Maintenance
- `id` - Primary key
- `vehicleId` - Foreign key to Vehicle
- `description` - Maintenance description
- `scheduledDate` - Scheduled date
- `completedDate` - Completed date
- `status` - SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- `estimatedCost` - Estimated cost
- `actualCost` - Actual cost
- `serviceType` - Type of service
- `notes` - Additional notes

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```
