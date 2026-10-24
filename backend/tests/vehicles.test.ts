import supertest from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

const app = createApp();
const request = supertest(app);

let adminToken: string;
let customerToken: string;
let testVehicleId: string;

const registerAndLogin = async (role: 'ADMIN' | 'CUSTOMER', email: string) => {
  await request.post('/api/auth/register').send({ email, password: 'Password123', fullName: 'Test', role });
  const res = await request.post('/api/auth/login').send({ email, password: 'Password123' });
  return res.body.data.token as string;
};

const createVehicle = (token: string, overrides = {}) =>
  request.post('/api/vehicles').set('Authorization', `Bearer ${token}`).send({
    make: 'Toyota', model: 'Camry', category: 'Sedan', year: 2024,
    price: 28500, quantity: 5, vin: `VIN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    ...overrides,
  });

describe('Vehicles API — TDD Suite', () => {
  beforeAll(async () => {
    await prisma.purchaseTransaction.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
    adminToken = await registerAndLogin('ADMIN', 'admin@vehicles.test');
    customerToken = await registerAndLogin('CUSTOMER', 'customer@vehicles.test');
  });

  afterAll(async () => {
    await prisma.purchaseTransaction.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  // UC-04: View Catalog
  describe('GET /api/vehicles', () => {
    it('RED->GREEN: should return paginated vehicle list for authenticated users', async () => {
      const res = await request.get('/api/vehicles').set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('vehicles');
      expect(res.body.data).toHaveProperty('total');
      expect(Array.isArray(res.body.data.vehicles)).toBe(true);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const res = await request.get('/api/vehicles');
      expect(res.status).toBe(401);
    });
  });

  // UC-09: Create Vehicle
  describe('POST /api/vehicles', () => {
    it('RED->GREEN: Admin should create a vehicle listing', async () => {
      const res = await createVehicle(adminToken, { quantity: 5 });
      expect(res.status).toBe(201);
      expect(res.body.data.vehicle.make).toBe('Toyota');
      testVehicleId = res.body.data.vehicle.id;
    });

    it('Customer should also be able to create a vehicle listing', async () => {
      const res = await createVehicle(customerToken, { vin: `VIN-CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
      expect(res.status).toBe(201);
    });

    it('should return 422 for missing required fields', async () => {
      const res = await request.post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send({ make: 'Ford' });
      expect(res.status).toBe(422);
    });
  });

  // UC-06: View Vehicle Details
  describe('GET /api/vehicles/:id', () => {
    it('should return specific vehicle details', async () => {
      const res = await request.get(`/api/vehicles/${testVehicleId}`).set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.vehicle.id).toBe(testVehicleId);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const res = await request.get('/api/vehicles/00000000-0000-0000-0000-000000000000').set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(404);
    });
  });

  // UC-10: Update Vehicle
  describe('PUT /api/vehicles/:id', () => {
    it('RED->GREEN: should update vehicle price', async () => {
      const res = await request.put(`/api/vehicles/${testVehicleId}`).set('Authorization', `Bearer ${adminToken}`).send({ price: 30000 });
      expect(res.status).toBe(200);
      expect(parseFloat(res.body.data.vehicle.price)).toBe(30000);
    });
  });

  // UC-07: Purchase Vehicle (CRITICAL)
  describe('POST /api/vehicles/:id/purchase', () => {
    let purchaseVehicleId: string;

    beforeEach(async () => {
      const res = await createVehicle(adminToken, { quantity: 2, vin: `VIN-PURCH-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
      purchaseVehicleId = res.body.data.vehicle.id;
    });

    it('RED->GREEN: should decrement quantity by 1 on purchase', async () => {
      const res = await request.post(`/api/vehicles/${purchaseVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.remainingQuantity).toBe(1);
    });

    it('should return 409 when stock reaches 0', async () => {
      await request.post(`/api/vehicles/${purchaseVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`);
      await request.post(`/api/vehicles/${purchaseVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`);
      const res = await request.post(`/api/vehicles/${purchaseVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('CONFLICT');
    });

    it('CONCURRENCY TEST: Should handle simultaneous purchases without negative stock', async () => {
      const singleStockVin = `VIN-CONC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const singleRes = await createVehicle(adminToken, { quantity: 1, vin: singleStockVin });
      const singleVehicleId = singleRes.body.data.vehicle.id;

      // Fire 5 simultaneous purchase requests
      const results = await Promise.allSettled([
        request.post(`/api/vehicles/${singleVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`),
        request.post(`/api/vehicles/${singleVehicleId}/purchase`).set('Authorization', `Bearer ${adminToken}`),
        request.post(`/api/vehicles/${singleVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`),
        request.post(`/api/vehicles/${singleVehicleId}/purchase`).set('Authorization', `Bearer ${adminToken}`),
        request.post(`/api/vehicles/${singleVehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`),
      ]);

      const successes = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 200);
      const failures = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 409);

      // Exactly 1 should succeed, rest should fail with 409
      expect(successes).toHaveLength(1);
      expect(failures.length).toBeGreaterThanOrEqual(1);

      // DB must never have negative quantity
      const finalVehicle = await prisma.vehicle.findUnique({ where: { id: singleVehicleId } });
      expect(finalVehicle!.quantity).toBeGreaterThanOrEqual(0);
    });
  });

  // UC-08: Restock Inventory
  describe('POST /api/vehicles/:id/restock', () => {
    it('RED->GREEN: Admin should restock vehicle inventory', async () => {
      const res = await request.post(`/api/vehicles/${testVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10, notes: 'Monthly restock' });
      expect(res.status).toBe(200);
      expect(res.body.data.message).toContain('Restocked');
    });

    it('Customer should receive 403 when attempting to restock', async () => {
      const res = await request.post(`/api/vehicles/${testVehicleId}/restock`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 5 });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('FORBIDDEN');
    });

    it('should return 422 for negative restock quantity', async () => {
      const res = await request.post(`/api/vehicles/${testVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });
      expect(res.status).toBe(422);
    });
  });

  // UC-11: Delete Vehicle
  describe('DELETE /api/vehicles/:id', () => {
    it('RED->GREEN: Admin should delete a vehicle', async () => {
      const res = await createVehicle(adminToken, { vin: `VIN-DEL-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
      const delId = res.body.data.vehicle.id;
      const delRes = await request.delete(`/api/vehicles/${delId}`).set('Authorization', `Bearer ${adminToken}`);
      expect(delRes.status).toBe(200);
    });

    it('Customer should receive 403 on delete attempt', async () => {
      const delRes = await request.delete(`/api/vehicles/${testVehicleId}`).set('Authorization', `Bearer ${customerToken}`);
      expect(delRes.status).toBe(403);
    });
  });

  // UC-05: Search & Filter
  describe('GET /api/vehicles with search filters', () => {
    beforeAll(async () => {
      await createVehicle(adminToken, { make: 'Tesla', model: 'Model S', category: 'Electric', price: 90000, vin: `VIN-SRCH-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
    });

    it('should filter vehicles by make', async () => {
      const res = await request.get('/api/vehicles?make=Tesla').set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.vehicles.every((v: any) => v.make.toLowerCase().includes('tesla'))).toBe(true);
    });

    it('should filter vehicles by category', async () => {
      const res = await request.get('/api/vehicles?category=Electric').set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
    });
  });
});
