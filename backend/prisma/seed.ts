import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with authentic Indian Cars & Genuine Photos...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@12345', 12);
  await prisma.user.upsert({
    where: { email: 'admin@cardealership.com' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@cardealership.com',
      passwordHash: adminHash,
      fullName: 'Dealership Admin',
      role: 'ADMIN',
    },
  });

  // Create customer user
  const custHash = await bcrypt.hash('Customer@12345', 12);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { passwordHash: custHash },
    create: {
      email: 'customer@example.com',
      passwordHash: custHash,
      fullName: 'Vikram Sharma',
      role: 'CUSTOMER',
    },
  });

  // Clear existing vehicles to re-seed with authentic Indian photos
  await prisma.purchaseTransaction.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.vehicle.deleteMany();

  // 16 Iconic Indian Cars with 100% Matching Authentic Local Photos
  const indianCars = [
    {
      make: 'Mahindra',
      model: 'Thar 4x4',
      category: '4x4 Off-Road',
      year: 2024,
      price: 1625000,
      quantity: 6,
      vin: 'IND-MAH-THAR-001',
      imageUrl: '/cars/thar.jpg',
    },
    {
      make: 'Tata',
      model: 'Nexon EV',
      category: 'Electric',
      year: 2024,
      price: 1749000,
      quantity: 8,
      vin: 'IND-TAT-NEX-002',
      imageUrl: '/cars/nexon.jpg',
    },
    {
      make: 'Mahindra',
      model: 'XUV700 AX7',
      category: 'SUV',
      year: 2024,
      price: 2150000,
      quantity: 5,
      vin: 'IND-MAH-XUV-003',
      imageUrl: '/cars/xuv700.png',
    },
    {
      make: 'Tata',
      model: 'Harrier Dark Edition',
      category: 'SUV',
      year: 2024,
      price: 1980000,
      quantity: 4,
      vin: 'IND-TAT-HAR-004',
      imageUrl: '/cars/harrier.jpg',
    },
    {
      make: 'Hyundai',
      model: 'Creta SX(O)',
      category: 'SUV',
      year: 2024,
      price: 1490000,
      quantity: 10,
      vin: 'IND-HYU-CRE-005',
      imageUrl: '/cars/creta.png',
    },
    {
      make: 'Kia',
      model: 'Seltos X-Line',
      category: 'SUV',
      year: 2024,
      price: 1540000,
      quantity: 7,
      vin: 'IND-KIA-SEL-006',
      imageUrl: '/cars/seltos.jpg',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Swift ZXi+',
      category: 'Hatchback',
      year: 2024,
      price: 725000,
      quantity: 12,
      vin: 'IND-MSZ-SWI-007',
      imageUrl: '/cars/swift.jpg',
    },
    {
      make: 'Tata',
      model: 'Safari Accomplished',
      category: 'SUV',
      year: 2024,
      price: 2390000,
      quantity: 3,
      vin: 'IND-TAT-SAF-008',
      imageUrl: '/cars/safari.jpg',
    },
    {
      make: 'Mahindra',
      model: 'Scorpio-N Z8L',
      category: 'SUV',
      year: 2024,
      price: 1840000,
      quantity: 6,
      vin: 'IND-MAH-SCO-009',
      imageUrl: '/cars/scorpio.jpg',
    },
    {
      make: 'Honda',
      model: 'City e:HEV Hybrid',
      category: 'Sedan',
      year: 2024,
      price: 1390000,
      quantity: 5,
      vin: 'IND-HON-CIT-010',
      imageUrl: '/cars/city.jpg',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Brezza ZXi',
      category: 'SUV',
      year: 2024,
      price: 1130000,
      quantity: 9,
      vin: 'IND-MSZ-BRE-011',
      imageUrl: '/cars/brezza.png',
    },
    {
      make: 'Tata',
      model: 'Punch Creative',
      category: 'SUV',
      year: 2024,
      price: 860000,
      quantity: 11,
      vin: 'IND-TAT-PUN-012',
      imageUrl: '/cars/punch.png',
    },
    {
      make: 'Toyota',
      model: 'Fortuner Legender',
      category: 'SUV',
      year: 2024,
      price: 3850000,
      quantity: 2,
      vin: 'IND-TOY-FOR-013',
      imageUrl: '/cars/fortuner.jpg',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Dzire ZXi+',
      category: 'Sedan',
      year: 2024,
      price: 820000,
      quantity: 8,
      vin: 'IND-MSZ-DZI-014',
      imageUrl: '/cars/dzire.jpg',
    },
    {
      make: 'Tata',
      model: 'Tiago EV',
      category: 'Electric',
      year: 2024,
      price: 980000,
      quantity: 5,
      vin: 'IND-TAT-TIA-015',
      imageUrl: '/cars/tiago.jpg',
    },
    {
      make: 'Mahindra',
      model: 'Bolero Neo N10',
      category: 'SUV',
      year: 2024,
      price: 1040000,
      quantity: 0,
      vin: 'IND-MAH-BOL-016',
      imageUrl: '/cars/bolero.jpg',
    },
  ];

  for (const v of indianCars) {
    await prisma.vehicle.create({
      data: v,
    });
  }

  console.log(`✅ Seed complete with ${indianCars.length} authentic Indian vehicles & matching photos!`);
  console.log('👤 Admin: admin@cardealership.com / Admin@12345');
  console.log('👤 Customer: customer@example.com / Customer@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
