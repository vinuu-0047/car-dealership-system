import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Indian Cars...');

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

  // Clear existing vehicles to replace with Indian fleet
  await prisma.purchaseTransaction.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.vehicle.deleteMany();

  // 16 Iconic Indian Cars
  const indianCars = [
    {
      make: 'Mahindra',
      model: 'Thar 4x4',
      category: '4x4 Off-Road',
      year: 2024,
      price: 1625000,
      quantity: 6,
      vin: 'IND-MAH-THAR-001',
      imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tata',
      model: 'Nexon EV',
      category: 'Electric',
      year: 2024,
      price: 1749000,
      quantity: 8,
      vin: 'IND-TAT-NEX-002',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Mahindra',
      model: 'XUV700 AX7',
      category: 'SUV',
      year: 2024,
      price: 2150000,
      quantity: 5,
      vin: 'IND-MAH-XUV-003',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tata',
      model: 'Harrier Dark Edition',
      category: 'SUV',
      year: 2024,
      price: 1980000,
      quantity: 4,
      vin: 'IND-TAT-HAR-004',
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Hyundai',
      model: 'Creta SX(O)',
      category: 'SUV',
      year: 2024,
      price: 1490000,
      quantity: 10,
      vin: 'IND-HYU-CRE-005',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Kia',
      model: 'Seltos X-Line',
      category: 'SUV',
      year: 2024,
      price: 1540000,
      quantity: 7,
      vin: 'IND-KIA-SEL-006',
      imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Swift ZXi+',
      category: 'Hatchback',
      year: 2024,
      price: 725000,
      quantity: 12,
      vin: 'IND-MSZ-SWI-007',
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tata',
      model: 'Safari Accomplished',
      category: 'SUV',
      year: 2024,
      price: 2390000,
      quantity: 3,
      vin: 'IND-TAT-SAF-008',
      imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Mahindra',
      model: 'Scorpio-N Z8L',
      category: 'SUV',
      year: 2024,
      price: 1840000,
      quantity: 6,
      vin: 'IND-MAH-SCO-009',
      imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Honda',
      model: 'City e:HEV Hybrid',
      category: 'Sedan',
      year: 2024,
      price: 1390000,
      quantity: 5,
      vin: 'IND-HON-CIT-010',
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Brezza ZXi',
      category: 'SUV',
      year: 2024,
      price: 1130000,
      quantity: 9,
      vin: 'IND-MSZ-BRE-011',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tata',
      model: 'Punch Creative',
      category: 'SUV',
      year: 2024,
      price: 860000,
      quantity: 11,
      vin: 'IND-TAT-PUN-012',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Toyota',
      model: 'Fortuner Legender',
      category: 'SUV',
      year: 2024,
      price: 3850000,
      quantity: 2,
      vin: 'IND-TOY-FOR-013',
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Maruti Suzuki',
      model: 'Dzire ZXi+',
      category: 'Sedan',
      year: 2024,
      price: 820000,
      quantity: 8,
      vin: 'IND-MSZ-DZI-014',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tata',
      model: 'Tiago EV',
      category: 'Electric',
      year: 2024,
      price: 980000,
      quantity: 5,
      vin: 'IND-TAT-TIA-015',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Mahindra',
      model: 'Bolero Neo N10',
      category: 'SUV',
      year: 2024,
      price: 1040000,
      quantity: 0,
      vin: 'IND-MAH-BOL-016',
      imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const v of indianCars) {
    await prisma.vehicle.create({
      data: v,
    });
  }

  console.log(`✅ Seed complete with ${indianCars.length} Indian vehicles!`);
  console.log('👤 Admin: admin@cardealership.com / Admin@12345');
  console.log('👤 Customer: customer@example.com / Customer@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
