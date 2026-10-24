import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cardealership.com' },
    update: {},
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
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: custHash,
      fullName: 'John Doe',
      role: 'CUSTOMER',
    },
  });

  // Create 15 demo vehicles with photos
  const vehicles = [
    {
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      year: 2024,
      price: 28500,
      quantity: 8,
      vin: 'TOY-CAM-2024-001',
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Toyota',
      model: 'RAV4',
      category: 'SUV',
      year: 2024,
      price: 35000,
      quantity: 5,
      vin: 'TOY-RAV-2024-002',
      imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Toyota',
      model: 'Prius',
      category: 'Hybrid',
      year: 2024,
      price: 32000,
      quantity: 3,
      vin: 'TOY-PRI-2024-003',
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Ford',
      model: 'F-150',
      category: 'Truck',
      year: 2024,
      price: 45000,
      quantity: 6,
      vin: 'FOR-F15-2024-004',
      imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Ford',
      model: 'Mustang',
      category: 'Sports',
      year: 2024,
      price: 58000,
      quantity: 2,
      vin: 'FOR-MUS-2024-005',
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Ford',
      model: 'Explorer',
      category: 'SUV',
      year: 2023,
      price: 42000,
      quantity: 4,
      vin: 'FOR-EXP-2023-006',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'BMW',
      model: '3 Series',
      category: 'Sedan',
      year: 2024,
      price: 55000,
      quantity: 3,
      vin: 'BMW-3SR-2024-007',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'BMW',
      model: 'X5',
      category: 'SUV',
      year: 2024,
      price: 82000,
      quantity: 2,
      vin: 'BMW-X5S-2024-008',
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      category: 'Electric',
      year: 2024,
      price: 48000,
      quantity: 7,
      vin: 'TES-M3S-2024-009',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Tesla',
      model: 'Model Y',
      category: 'Electric',
      year: 2024,
      price: 55000,
      quantity: 5,
      vin: 'TES-MYS-2024-010',
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      year: 2024,
      price: 26000,
      quantity: 10,
      vin: 'HON-CIV-2024-011',
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Honda',
      model: 'CR-V',
      category: 'SUV',
      year: 2024,
      price: 38000,
      quantity: 6,
      vin: 'HON-CRV-2024-012',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Chevrolet',
      model: 'Silverado',
      category: 'Truck',
      year: 2024,
      price: 48000,
      quantity: 4,
      vin: 'CHV-SIL-2024-013',
      imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Mercedes',
      model: 'C-Class',
      category: 'Sedan',
      year: 2024,
      price: 65000,
      quantity: 2,
      vin: 'MER-CCS-2024-014',
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      make: 'Hyundai',
      model: 'Ioniq 6',
      category: 'Electric',
      year: 2024,
      price: 43000,
      quantity: 0,
      vin: 'HYU-I6S-2024-015',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { vin: v.vin },
      update: {
        imageUrl: v.imageUrl,
      },
      create: v,
    });
  }

  console.log('✅ Seed complete!');
  console.log('👤 Admin: admin@cardealership.com / Admin@12345');
  console.log('👤 Customer: customer@example.com / Customer@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
