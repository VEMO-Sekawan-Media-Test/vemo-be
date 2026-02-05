import { PrismaClient, Role, MaintenanceStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting VEMO database seeding...');

  const adminPassword = await bcrypt.hash('V3m0@dm1n#2024!', 10);
  const approver1Password = await bcrypt.hash('Apr0v3rL3v3l1#2024!', 10);
  const approver2Password = await bcrypt.hash('Apr0v3rL3v3l2#2024!', 10);

  // users
  console.log('Creating users...');

  const users = [
    {
      username: 'admin_vemo',
      password: adminPassword,
      name: 'Vemomin',
      role: Role.ADMIN,
    },
    {
      username: 'manager_ops',
      password: approver1Password,
      name: 'Ahmad Santoso',
      role: Role.APPROVER,
    },
    {
      username: 'director_regional',
      password: approver2Password,
      name: 'Budi Prasetyo',
      role: Role.APPROVER,
    },
    {
      username: 'supervisor_hse',
      password: approver1Password,
      name: 'Citra Dewi',
      role: Role.APPROVER,
    },
    {
      username: 'manager_logistik',
      password: approver2Password,
      name: 'Dedi Kurniawan',
      role: Role.APPROVER,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: userData,
    });
  }

  console.log('Created 5 users');

  // ========== VEHICLES ==========
  console.log('Creating vehicles...');

  const locations = [
    'Kantor Pusat', 'Kantor Cabang Morowali', 
    'Tambang A', 'Tambang B', 'Tambang C', 
    'Tambang D', 'Tambang E', 'Tambang F'
  ];

  const vehicleModels = [
    { model: 'Toyota Hilux 4x4', type: 'PERSONNEL' },
    { model: 'Mitsubishi L200 Triton', type: 'PERSONNEL' },
    { model: 'Ford Ranger Raptor', type: 'PERSONNEL' },
    { model: 'Isuzu D-Max', type: 'PERSONNEL' },
    { model: 'Hino 500 FG 8JK', type: 'CARGO' },
    { model: 'Mitsubishi Fuso Fighter', type: 'CARGO' },
    { model: 'Toyota Dyna 150', type: 'CARGO' },
    { model: 'Suzuki Carry Pick Up', type: 'CARGO' },
    { model: 'Kia Pregio', type: 'PERSONNEL' },
    { model: 'Nissan Terra', type: 'PERSONNEL' },
  ];

  const platePrefixes = ['DT', 'KH', 'KB', 'Z', 'B', 'AD'];
  const createdVehicles: any[] = [];
  let vehicleIndex = 0;

  for (const location of locations) {
    const numVehicles = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numVehicles; i++) {
      const vehicleModel = vehicleModels[vehicleIndex % vehicleModels.length];
      const plateNum = platePrefixes[vehicleIndex % platePrefixes.length] + ' ' + (1000 + (vehicleIndex * 17) % 9000) + ' NI';
      const ownership = Math.random() > 0.3 ? 'COMPANY' : 'RENTED';
      const fuelConsumption = 8 + Math.random() * 8;
      
      const vehicle = await prisma.vehicle.create({
        data: {
          modelName: vehicleModel.model,
          plateNumber: plateNum,
          type: vehicleModel.type,
          ownership: ownership,
          location: location,
          fuelConsumption: parseFloat(fuelConsumption.toFixed(2)),
          currentFuel: Math.floor(Math.random() * 100),
          lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        },
      });
      createdVehicles.push(vehicle);
      vehicleIndex++;
    }
  }

  console.log('Created ' + createdVehicles.length + ' vehicles');

  // ========== DRIVERS ==========
  const driverNames = [
    'Eko Susilo', 'Fajar Nugroho', 'Gina Amelia', 'Hendra Wijaya',
    'Indah Permata', 'Joko Pranoto', 'Kartika Sari', 'Lukman Hakim',
    'Maya Devi', 'Nanda Putra', 'Olivia Santoso', 'Prabowo Dimas'
  ];

  // ========== BOOKINGS ==========
  console.log('Creating bookings...');

  const approvers = await prisma.user.findMany({ where: { role: Role.APPROVER } });
  const regularUsers = await prisma.user.findMany({ where: { role: { not: Role.ADMIN } } });

  const createdBookings: any[] = [];
  const now = new Date();

  // Create 80 bookings over the past 6 months
  for (let i = 0; i < 80; i++) {
    const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
    const driverName = driverNames[Math.floor(Math.random() * driverNames.length)];
    const approver1 = approvers[Math.floor(Math.random() * approvers.length)];
    let approver2 = approvers[Math.floor(Math.random() * approvers.length)];
    while (approver2.id === approver1.id) {
      approver2 = approvers[Math.floor(Math.random() * approvers.length)];
    }
    const creator = regularUsers[Math.floor(Math.random() * regularUsers.length)];
    
    const daysAgo = Math.floor(Math.random() * 180);
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 8) + 2;
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
    
    const statusWeights = [0.1, 0.15, 0.5, 0.2, 0.05];
    const rand = Math.random();
    let cumulative = 0;
    let status = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (rand < cumulative) {
        status = j === 0 ? 0 : j === 1 ? 1 : j === 2 ? 2 : j === 3 ? 2 : -1;
        break;
      }
    }

    const booking = await prisma.booking.create({
      data: {
        vehicleId: vehicle.id,
        driverName: driverName,
        approver1Id: approver1.id,
        approver2Id: approver2.id,
        creatorId: creator.id,
        startDate,
        endDate,
        status: status,
        distanceKm: status === 2 && Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 50 : undefined,
        fuelUsed: status === 2 && Math.random() > 0.3 ? parseFloat((Math.random() * 50 + 10).toFixed(2)) : undefined,
      },
    });
    createdBookings.push(booking);
  }

  // Add some pending bookings for demo
  for (let i = 0; i < 5; i++) {
    const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
    const driverName = driverNames[Math.floor(Math.random() * driverNames.length)];
    const approver1 = approvers[0];
    const approver2 = approvers[1];
    const creator = regularUsers[Math.floor(Math.random() * regularUsers.length)];
    
    const startDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 6) + 3;
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
    
    await prisma.booking.create({
      data: {
        vehicleId: vehicle.id,
        driverName: driverName,
        approver1Id: approver1.id,
        approver2Id: approver2.id,
        creatorId: creator.id,
        startDate,
        endDate,
        status: Math.random() > 0.5 ? 0 : 1,
      },
    });
  }

  console.log('Created ' + (createdBookings.length + 5) + ' bookings');

  // ========== MAINTENANCE RECORDS ==========
  console.log('Creating maintenance records...');

  const maintenanceTypes = ['Service Berkala', 'Perbaikan Mesin', 'Ganti Oli', 'Ganti Ban', 'Tune Up', 'Pemeriksaan rutin', 'Perbaikan Rem', 'Ganti Filter'];

  const createdMaintenance: any[] = [];

  for (const vehicle of createdVehicles) {
    const numMaintenance = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numMaintenance; i++) {
      const type = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
      const status = [MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.COMPLETED, MaintenanceStatus.CANCELLED][Math.floor(Math.random() * 4)];
      const daysAgo = Math.floor(Math.random() * 120);
      const scheduledDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const completedDate = status === MaintenanceStatus.COMPLETED ? new Date(scheduledDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : undefined;
      const cost = Math.floor(Math.random() * 5000000) + 500000;
      
      const maintenance = await prisma.maintenance.create({
        data: {
          vehicleId: vehicle.id,
          description: type + ' untuk ' + vehicle.modelName,
          scheduledDate,
          completedDate,
          status: status,
          estimatedCost: parseFloat(cost.toFixed(2)),
          actualCost: status === MaintenanceStatus.COMPLETED ? parseFloat((cost * (0.8 + Math.random() * 0.4)).toFixed(2)) : undefined,
          serviceType: type,
          notes: 'Maintenance rutin',
        },
      });
      createdMaintenance.push(maintenance);
    }
  }

  console.log('Created ' + createdMaintenance.length + ' maintenance records');

  // ========== SUMMARY ==========
  console.log('');
  console.log('VEMO Database Seeding Complete!');
  console.log('Users: 5');
  console.log('Vehicles: ' + createdVehicles.length);
  console.log('Bookings: ' + (createdBookings.length + 5));
  console.log('Maintenance: ' + createdMaintenance.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
