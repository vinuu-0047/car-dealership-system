import { JsonObject } from 'swagger-ui-express';

export const swaggerDocument: JsonObject = {
  openapi: '3.0.0',
  info: {
    title: 'AutoElite Car Dealership Inventory API',
    version: '1.0.0',
    description:
      'Production-grade RESTful API for the Car Dealership Inventory System TDD Kata. Features JWT authentication, role-based access control (RBAC), and concurrency-safe transactions with pessimistic row-level locking.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login or /api/auth/register',
      },
    },
    schemas: {
      RegisterDto: {
        type: 'object',
        required: ['email', 'password', 'fullName'],
        properties: {
          email: { type: 'string', format: 'email', example: 'customer@example.com' },
          password: { type: 'string', minLength: 8, example: 'Password123' },
          fullName: { type: 'string', minLength: 2, example: 'John Doe' },
          role: { type: 'string', enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
        },
      },
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@cardealership.com' },
          password: { type: 'string', example: 'Admin@12345' },
        },
      },
      CreateVehicleDto: {
        type: 'object',
        required: ['make', 'model', 'category', 'year', 'price', 'quantity', 'vin'],
        properties: {
          make: { type: 'string', example: 'Toyota' },
          model: { type: 'string', example: 'Camry' },
          category: { type: 'string', example: 'Sedan' },
          year: { type: 'integer', example: 2024 },
          price: { type: 'number', format: 'float', example: 28500 },
          quantity: { type: 'integer', minimum: 0, example: 5 },
          vin: { type: 'string', example: 'TOY-CAM-2024-001' },
          imageUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
      UpdateVehicleDto: {
        type: 'object',
        properties: {
          make: { type: 'string' },
          model: { type: 'string' },
          category: { type: 'string' },
          year: { type: 'integer' },
          price: { type: 'number' },
          quantity: { type: 'integer', minimum: 0 },
          imageUrl: { type: 'string' },
        },
      },
      RestockDto: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'integer', minimum: 1, example: 10 },
          notes: { type: 'string', example: 'Monthly inventory restock' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          make: { type: 'string' },
          model: { type: 'string' },
          category: { type: 'string' },
          year: { type: 'integer' },
          price: { type: 'string' },
          quantity: { type: 'integer' },
          vin: { type: 'string' },
          imageUrl: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'VALIDATION_ERROR' },
          message: { type: 'string', example: 'Invalid request payload' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        responses: {
          200: {
            description: 'API is running healthy',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new account (Customer or Admin)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterDto' } } },
        },
        responses: {
          201: { description: 'User registered successfully and token returned' },
          409: { description: 'Email already registered' },
          422: { description: 'Validation failed' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Authenticate and receive JWT Bearer Token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginDto' } } },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/vehicles': {
      get: {
        summary: 'View and search vehicle catalog (Paginated)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'make', in: 'query', schema: { type: 'string' }, description: 'Filter by make' },
          { name: 'model', in: 'query', schema: { type: 'string' }, description: 'Filter by model' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category (Sedan, SUV, etc.)' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimum price filter' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maximum price filter' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Vehicle catalog page retrieved' },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Add a new vehicle to catalog',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVehicleDto' } } },
        },
        responses: {
          201: { description: 'Vehicle created' },
          401: { description: 'Unauthorized' },
          422: { description: 'Validation error' },
        },
      },
    },
    '/api/vehicles/{id}': {
      get: {
        summary: 'Get vehicle by ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Vehicle details' },
          404: { description: 'Vehicle not found' },
        },
      },
      put: {
        summary: 'Update vehicle details',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateVehicleDto' } } },
        },
        responses: {
          200: { description: 'Vehicle updated' },
          404: { description: 'Vehicle not found' },
        },
      },
      delete: {
        summary: 'Delete vehicle (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Vehicle deleted' },
          403: { description: 'Forbidden — requires ADMIN role' },
          404: { description: 'Vehicle not found' },
        },
      },
    },
    '/api/vehicles/{id}/purchase': {
      post: {
        summary: 'Purchase vehicle (Decrements quantity atomically)',
        description:
          'ACID transaction with PostgreSQL row-level pessimistic locking (`SELECT FOR UPDATE`). Prevents race conditions and overselling.',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Vehicle purchased successfully' },
          404: { description: 'Vehicle not found' },
          409: { description: 'Conflict: Vehicle is out of stock' },
        },
      },
    },
    '/api/vehicles/{id}/restock': {
      post: {
        summary: 'Restock vehicle inventory (Admin only)',
        description: 'Increments vehicle quantity by N units and logs an immutable audit entry.',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RestockDto' } } },
        },
        responses: {
          200: { description: 'Inventory restocked successfully' },
          403: { description: 'Forbidden — requires ADMIN role' },
          404: { description: 'Vehicle not found' },
        },
      },
    },
  },
};
