import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // seed users
  const admin = await prisma.user.upsert({
    where: { username: 'admin_vemo' },
    update: {},
    create: {
      username: 'admin_vemo',
      password,
      name: 'Vemomin',
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { username: 'manager_1' },
    update: {},
    create: {
      username: 'manager_1',
      password,
      name: 'Manager Operasional',
      role: Role.APPROVER,
    },
  });

  const director = await prisma.user.upsert({
    where: { username: 'director_2' },
    update: {},
    create: {
      username: 'director_2',
      password,
      name: 'Direktur Regional',
      role: Role.APPROVER,
    },
  });

  // seed lokasi & kendaraan
  const locations = [
    'Kantor Pusat', 'Kantor Cabang', 
    'Tambang A', 'Tambang B', 'Tambang C', 
    'Tambang D', 'Tambang E', 'Tambang F'
  ];
  
  for (const loc of locations) {
    await prisma.vehicle.create({
      data: {
        modelName: 'Toyota Hilux 4x4',
        plateNumber: `DT ${Math.floor(1000 + Math.random() * 9000)} NI`,
        type: 'PERSONNEL',
        ownership: 'COMPANY',
        location: loc,
        fuelConsumption: 10.5,
        lastService: new Date(),
      },
    });
  }

  console.log('Seeding VEMO data success! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });