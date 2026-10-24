import supertest from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

const app = createApp();
const request = supertest(app);

describe('Auth API — TDD Suite', () => {
  beforeEach(async () => {
    await prisma.purchaseTransaction.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  // UC-01: Register
  describe('POST /api/auth/register', () => {
    it('RED->GREEN: should register a new CUSTOMER user and return token', async () => {
      const res = await request.post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('CUSTOMER');
    });

    it('should register a user with ADMIN role', async () => {
      const res = await request.post('/api/auth/register').send({
        email: 'admin@test.com',
        password: 'Password123',
        fullName: 'Admin User',
        role: 'ADMIN',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('ADMIN');
    });

    it('should return 409 if email already registered', async () => {
      await request.post('/api/auth/register').send({ email: 'dup@test.com', password: 'Password123', fullName: 'First' });
      const res = await request.post('/api/auth/register').send({ email: 'dup@test.com', password: 'Password123', fullName: 'Second' });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('CONFLICT');
    });

    it('should return 422 for invalid email format', async () => {
      const res = await request.post('/api/auth/register').send({ email: 'not-an-email', password: 'Password123', fullName: 'User' });
      expect(res.status).toBe(422);
    });

    it('should return 422 for password shorter than 8 characters', async () => {
      const res = await request.post('/api/auth/register').send({ email: 'user@test.com', password: 'short', fullName: 'User' });
      expect(res.status).toBe(422);
    });
  });

  // UC-02: Login
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request.post('/api/auth/register').send({ email: 'login@test.com', password: 'Password123', fullName: 'Login User' });
    });

    it('RED->GREEN: should login and return JWT token', async () => {
      const res = await request.post('/api/auth/login').send({ email: 'login@test.com', password: 'Password123' });
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@test.com');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request.post('/api/auth/login').send({ email: 'login@test.com', password: 'WrongPassword' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('UNAUTHORIZED');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request.post('/api/auth/login').send({ email: 'ghost@test.com', password: 'Password123' });
      expect(res.status).toBe(401);
    });
  });
});
