# 🚗 VEMO - Vehicle Monitoring & Booking System

<div align="center">

![VEMO Logo](https://raw.githubusercontent.com/your-repo/vemo/main/vemo-fe/public/images/vemo_ic.png)

**Sistem monitoring dan pemesanan kendaraan untuk perusahaan penambangan nikel**  
dengan multiple regions, branches, dan mining sites.

[![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

[![Deploy on Railway](https://img.shields.io/badge/🚂-Deploy_on_Railway-0B0B0B?style=for-the-badge&logo=railway)](https://railway.app/)

</div>

---

## 📋 Table of Contents

1. [🎯 Overview](#-overview)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [📁 Project Structure](#-project-structure)
4. [🏗️ Architecture Diagram](#️-architecture-diagram)
5. [📊 Activity Diagram](#-activity-diagram)
6. [🔄 Sequence Diagram](#-sequence-diagram)
7. [🗄️ Physical Data Model](#️-physical-data-model)
8. [🚀 Getting Started](#-getting-started)
9. [📚 API Documentation](#-api-documentation)
10. [🔐 Default Users](#-default-users)
11. [📝 Database Schema](#-database-schema)

---

## 🎯 Overview

VEMO adalah sistem informasi untuk mengelola:
- 🚗 **Kendaraan** - CRUD kendaraan perusahaan dan rental
- 📅 **Pemesanan** - Booking kendaraan dengan sistem persetujuan multi-level
- 🔧 **Pemeliharaan** - Jadwal service dan maintenance kendaraan
- 📈 **Laporan** - Export data dan statistik penggunaan

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| � Framework | NestJS (Node.js) |
| 🗄️ Database | PostgreSQL dengan Prisma ORM |
| 🔐 Auth | JWT (JSON Web Token) |
| 📖 Docs | Swagger/OpenAPI |
| 🚂 Deploy | Railway |

---

## 📁 Project Structure

```
src/
├── 🔐 auth/              # Modul Autentikasi
│   ├── controllers/      # Endpoint auth
│   ├── services/         # Logika bisnis
│   ├── modules/          # Konfigurasi modul
│   ├── guards/           # Proteksi route
│   ├── strategies/       # Strategi JWT
│   └── dto/              # Data Transfer Objects
│
├── 📅 bookings/          # Pemesanan Kendaraan
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   ├── dto/
│   └── entities/
│
├── 🚗 vehicles/          # Manajemen Kendaraan
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   ├── dto/
│   └── entities/
│
├── 🔧 maintenance/       # Pemeliharaan
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   └── dto/
│
├── 📈 reports/          # Laporan & Statistik
│   ├── controllers/
│   ├── services/
│   └── modules/
│
├── 👤 users/            # Manajemen User
│   ├── controllers/
│   ├── services/
│   └── modules/
│
├── 📊 logging/          # Logging Service
├── 🏥 root/             # Health Check
└── 🗄️ prisma/           # Schema Database
```

---

## 📊 Activity Diagram

![Activity Diagram](docs/diagrams/activity-diagram.png)

**Keterangan:**
- Diagram alur aktivitas user dari login hingga proses pemesanan kendaraan
- Menunjukkan keputusan berdasarkan role (ADMIN/APPROVER)
- Flow persetujuan booking dengan dua level

---

## 🔄 Sequence Diagram

![Sequence Diagram](docs/diagrams/sequence-diagram.png)

**Keterangan:**
- Interaksi antara Frontend, Backend, dan Database
- Proses login dengan JWT token generation
- Flow complete booking dengan data BBM

---

## 🗄️ Physical Data Model

![ERD](docs/diagrams/erd-diagram.png)

**Keterangan:**
- Relasi antar tabel dalam database PostgreSQL
- Primary Key dan Foreign Key relationships
- Status enum untuk bookings dan maintenance

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|------------|---------|
| 🟢 Node.js | 18+ |
| 🐘 PostgreSQL | 17+ |
| 📦 npm/yarn | Latest |

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-repo/vemo.git
cd vemo/vemo-be

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed initial data (optional)
npx prisma db seed

# 6. Start development server
npm run start:dev
```

### Environment Variables

Buat file `.env` dengan variabel berikut:

```env
# 🔧 Database
DATABASE_URL="postgresql://user:password@localhost:5432/vemo_db"

# 🚂 Railway Production
# DATABASE_URL="postgresql://user:password@containers-us-west-xxx.railway.app:xxx/railway"

# 🔐 JWT Secret
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# 🌐 Server Port
PORT=3000
```

### Deployment ke Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. **Connect GitHub repository** ke Railway
2. **Add PostgreSQL** database dari Railway dashboard
3. **Set environment variables** di Railway:
   - `DATABASE_URL` (auto-generated)
   - `JWT_SECRET`
4. **Deploy** - Railway

---

## 📚 API Documentation

### 🔗 Base URL

| Environment | URL |
|------------|-----|
| 🏠 Local | `http://localhost:3000` |
| 🚂 Production | `https://vemo-be-production.up.railway.app` |
| 📖 Swagger Docs | `/api/docs` |

### 📋 Endpoint List

#### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login untuk mendapatkan JWT token |
| `GET` | `/auth/me` | Get current user info |

#### 🚗 Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/vehicles` | Get all vehicles |
| `GET` | `/vehicles/:id` | Get vehicle by ID |
| `POST` | `/vehicles` | Create new vehicle |
| `PATCH` | `/vehicles/:id` | Update vehicle |
| `DELETE` | `/vehicles/:id` | Delete vehicle |

#### 📅 Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bookings` | Get all bookings |
| `POST` | `/bookings` | Create booking |
| `GET` | `/bookings/pending-approvals` | Get pending approvals |
| `PATCH` | `/bookings/:id/approve` | Approve booking |
| `PATCH` | `/bookings/:id/reject` | Reject booking |
| `PATCH` | `/bookings/:id/complete` | Complete with fuel data |

#### 🔧 Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/maintenance` | Get all maintenance |
| `GET` | `/maintenance/:id` | Get by ID |
| `POST` | `/maintenance` | Schedule maintenance |
| `PATCH` | `/maintenance/:id/status` | Update status |
| `PATCH` | `/maintenance/:id/complete` | Mark completed |
| `GET` | `/maintenance/upcoming` | Upcoming maintenance |

#### 📈 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reports/dashboard` | Dashboard statistics |
| `GET` | `/reports/export` | Export bookings to Excel |

---

## 🔐 Default Users

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin_vemo` | `V3m0@dm1n#2024!` | 👑 ADMIN | Full system access |
| `manager_1` | `M4n@gerV3m0#Sec!` | 👤 APPROVER | Level 1 approval |
| `director_2` | `D1r3ct0rP3rm!t#Key` | 👤 APPROVER | Level 2 approval |

---

## 📝 Database Schema

### 👤 Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary Key |
| `username` | VARCHAR(50) | Unique username |
| `password` | VARCHAR(255) | Hashed password |
| `name` | VARCHAR(100) | Full name |
| `role` | VARCHAR(20) | `ADMIN` or `APPROVER` |
| `created_at` | TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | Last update |

### 🚗 Vehicles Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary Key |
| `plateNumber` | VARCHAR(20) | Unique license plate |
| `modelName` | VARCHAR(100) | Vehicle model |
| `type` | VARCHAR(50) | Personnel/Freight |
| `ownership` | VARCHAR(50) | Company/Rental |
| `location` | VARCHAR(100) | Site location |
| `status` | VARCHAR(20) | AVAILABLE/IN_USE/MAINTENANCE |

### 📅 Bookings Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary Key |
| `vehicleId` | INT | FK → vehicles |
| `userId` | INT | FK → users (creator) |
| `purpose` | TEXT | Booking purpose |
| `startDate` | TIMESTAMP | Start date/time |
| `endDate` | TIMESTAMP | End date/time |
| `status` | VARCHAR(20) | PENDING/APPROVED/REJECTED/COMPLETED |
| `approvedBy` | INT | FK → users (approver) |
| `approvedAt` | TIMESTAMP | Approval time |

### 🔧 Maintenance Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary Key |
| `vehicleId` | INT | FK → vehicles |
| `description` | TEXT | Maintenance description |
| `serviceType` | VARCHAR(100) | Type of service |
| `scheduledDate` | TIMESTAMP | Scheduled date |
| `completedDate` | TIMESTAMP | Completion date |
| `estimatedCost` | DECIMAL(12,2) | Estimated cost |
| `actualCost` | DECIMAL(12,2) | Actual cost |
| `status` | VARCHAR(20) | SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED |

---

## 🏥 Health Check

```
GET /
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T06:00:00.000Z",
  "service": "VEMO - Vehicle Monitoring & Booking System",
  "version": "1.0.0"
}
```

---

</div>
