# VEMO - Vehicle Monitoring & Booking System

A vehicle monitoring and booking system for a nickel mining company with multiple regions, branches, and mining sites.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger/OpenAPI

## Requirements

- Node.js 18+
- PostgreSQL 14+
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
DATABASE_URL="postgresql://user:password@localhost:5432/vemo_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
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
- `` - Create new vehicle (requires authPOST /vehicles)
- `PATCH /vehicles/:id` - Update vehicle (requires auth)
- `DELETE /vehicles/:id` - Delete vehicle (requires auth)

### Bookings
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create booking (requires auth)
- `PATCH /bookings/:id/approve` - Approve booking (requires auth)
- `PATCH /bookings/:id/reject` - Reject booking (requires auth)
- `PATCH /bookings/:id/complete` - Complete booking with fuel data (requires auth)

### Reports
- `GET /reports/export-excel` - Export bookings to Excel
- `GET /reports/vehicle-usage` - Get vehicle usage statistics

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

## License

MIT
