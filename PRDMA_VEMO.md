# Physical Data Model (PDM) - VEMO Vehicle Monitoring System

## Database: PostgreSQL

---

## Table: Users
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| name | VARCHAR(100) | NOT NULL | Full name |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'APPROVER' | ADMIN or APPROVER |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | - | Last update time |

**Indexes:**
- `users_pkey` ON (id)
- `users_username_key` ON (username)

---

## Table: Vehicles
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Vehicle ID |
| model_name | VARCHAR(100) | NOT NULL | Vehicle model/name |
| plate_number | VARCHAR(20) | UNIQUE, NOT NULL | License plate |
| type | VARCHAR(50) | NOT NULL | Personnel / Freight |
| ownership | VARCHAR(50) | NOT NULL | Company / Rental |
| location | VARCHAR(100) | NOT NULL | Kantor Pusat, Cabang, Tambang 1-6 |
| fuel_consumption | DECIMAL(5,2) | DEFAULT 0.00 | Liters per km |
| last_service | TIMESTAMP | NULL | Last maintenance date |
| current_fuel | DECIMAL(5,2) | DEFAULT 100.00 | Current fuel percentage |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | - | Last update time |

**Indexes:**
- `vehicles_pkey` ON (id)
- `vehicles_plate_number_key` ON (plate_number)

---

## Table: Bookings
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Booking ID |
| vehicle_id | INTEGER | FOREIGN KEY -> vehicles(id), NOT NULL | Reference to vehicle |
| driver_name | VARCHAR(100) | NOT NULL | Driver name |
| creator_id | INTEGER | FOREIGN KEY -> users(id), NOT NULL | Admin who created booking |
| approver1_id | INTEGER | FOREIGN KEY -> users(id), NOT NULL | Level 1 approver |
| approver2_id | INTEGER | FOREIGN KEY -> users(id), NOT NULL | Level 2 approver |
| status | INTEGER | DEFAULT 0 | 0:Pending, 1:Lvl1 Approved, 2:Final Approved, -1:Rejected |
| start_date | TIMESTAMP | NOT NULL | Booking start datetime |
| end_date | TIMESTAMP | NOT NULL | Booking end datetime |
| fuel_start | DECIMAL(5,2) | NULL | Fuel level at start |
| fuel_end | DECIMAL(5,2) | NULL | Fuel level at end |
| distance_km | DECIMAL(8,2) | NULL | Distance traveled (km) |
| fuel_used | DECIMAL(6,2) | NULL | Total fuel used |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `bookings_pkey` ON (id)
- `bookings_vehicle_id_fkey` ON (vehicle_id)
- `bookings_creator_id_fkey` ON (creator_id)
- `bookings_approver1_id_fkey` ON (approver1_id)
- `bookings_approver2_id_fkey` ON (approver2_id)

**Triggers:**
- Auto-update `updated_at` on row modification

---

## Table: Maintenance
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Maintenance ID |
| vehicle_id | INTEGER | FOREIGN KEY -> vehicles(id), NOT NULL | Reference to vehicle |
| description | VARCHAR(255) | NOT NULL | Maintenance description |
| scheduled_date | TIMESTAMP | NOT NULL | Scheduled maintenance date |
| completed_date | TIMESTAMP | NULL | Actual completion date |
| status | VARCHAR(20) | DEFAULT 'SCHEDULED' | SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED |
| estimated_cost | DECIMAL(12,2) | NOT NULL | Estimated cost (Rp) |
| actual_cost | DECIMAL(12,2) | NULL | Actual cost (Rp) |
| service_type | VARCHAR(100) | NULL | Type of service |
| notes | TEXT | NULL | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `maintenance_pkey` ON (id)
- `maintenance_vehicle_id_fkey` ON (vehicle_id)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │   Vehicles  │       │  Bookings   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ PK id       │       │ PK id       │       │ PK id       │
│ username    │1    N│ model_name  │1    N│ vehicle_id  │N
│ password    │──────│ plate_number│──────│ driver_name │
│ name        │       │ type        │       │ creator_id  │
│ role        │       │ ownership   │       │ approver1_id│
└─────────────┘       │ location    │       │ approver2_id│
                     │ fuel_consumption│   │ status      │
                     └─────────────┘       │ start_date  │
                     1    N              │ end_date    │
                     │                   │ fuel_start  │
                     │                   │ fuel_end    │
                     │                   │ distance_km │
                     │                   └─────────────┘
                     │                          1
                     │                          │
                     └──────────────────────────┘
                          N
                          │
                     ┌─────────────┐
                     │ Maintenance │
                     ├─────────────┤
                     │ PK id       │
                     │ FK vehicle_id│
                     │ description │
                     │ scheduled_date│
                     │ status      │
                     │ estimated_cost│
                     └─────────────┘
```

---

## Database Specifications

| Property | Value |
|----------|-------|
| **Database Engine** | PostgreSQL 15+ |
| **ORM** | Prisma 5.x |
| **Character Set** | UTF8 (utf8mb4) |
| **Collation** | en_US.utf8 |

---

## Notes

1. **Two-Level Approval**: 
   - Level 1: First approver (approver1_id) - Status 0 → 1
   - Level 2: Final approver (approver2_id) - Status 1 → 2

2. **Vehicle Ownership**:
   - Company: Owned by the mining company
   - Rental: Leased from rental company

3. **Locations**:
   - Kantor Pusat (Head Office)
   - Kantor Cabang (Branch Office)
   - Tambang 1-6 (Mining Sites 1-6)
