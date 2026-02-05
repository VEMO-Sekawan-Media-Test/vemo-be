import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Password yang berbeda untuk setiap user (best practice keamanan)
  const adminPassword = await bcrypt.hash('V3m0@dm1n#2024!', 10);
  const managerPassword = await bcrypt.hash('M4n@gerV3m0#Sec!', 10);
  const directorPassword = await bcrypt.hash('D1r3ct0rP3rm!t#Key', 10);

  // seed users
  const admin = await prisma.user.upsert({
    where: { username: 'admin_vemo' },
    update: {},
    create: {
      username: 'admin_vemo',
      password: adminPassword,
      name: 'Vemomin',
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { username: 'manager_1' },
    update: {},
    create: {
      username: 'manager_1',
      password: managerPassword,
      name: 'Manager Operasional',
      role: Role.APPROVER,
    },
  });

  const director = await prisma.user.upsert({
    where: { username: 'director_2' },
    update: {},
    create: {
      username: 'director_2',
      password: directorPassword,
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
