# 🚗 AutoElite — Car Dealership Inventory System

> **TDD Kata Submission** — A production-grade full-stack inventory management system built with strict Test-Driven Development principles, clean architecture, and enterprise-grade concurrency handling.

[![CI Pipeline](https://github.com/yourusername/car-dealer-system/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/car-dealer-system/actions)

---

## 🚀 Quick Start (One Command)

### Option A: Docker Compose (Recommended)
```bash
# Boots PostgreSQL, runs migrations + seed, starts backend & frontend
docker compose up --build
```
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

### Option B: Local Development

**Prerequisites**: Node.js 20+, PostgreSQL 16

```bash
# 1. Clone & setup backend
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL in .env to point to your local PostgreSQL

# 2. Setup database
npx prisma migrate dev
npx ts-node prisma/seed.ts

# 3. Start backend
npm run dev

# 4. In another terminal, setup frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cardealership.com | Admin@12345 |
| **Customer** | customer@example.com | Customer@12345 |

> Quick-login buttons are available on the Login page — no typing needed! ⚡

---

## 🏗️ Architecture

```
car-dealer-system/
├── backend/          # Node.js + TypeScript + Express + Prisma
│   ├── src/
│   │   ├── modules/  # Feature modules (auth, vehicles)
│   │   ├── middleware/  # JWT, RBAC, Validation, Error handling
│   │   └── lib/      # Utilities (prisma client, JWT helpers, errors)
│   ├── prisma/       # Schema, migrations, seed data
│   └── tests/        # TDD test suites (auth + vehicles + concurrency)
├── frontend/         # React 18 + Vite + TypeScript + Tailwind CSS
│   └── src/
│       ├── pages/    # LoginPage, RegisterPage, DashboardPage, LandingPage
│       ├── components/  # VehicleCard, Modals, Navbar, ProtectedRoute
│       ├── hooks/    # useVehicles, useAuth (TanStack Query)
│       └── store/    # Zustand auth store
├── .github/workflows/  # GitHub Actions CI pipeline
└── docker-compose.yml  # Full-stack Docker orchestration
```

### Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Backend | Node.js + TypeScript + Express | Type-safe, widely adopted, excellent DX |
| ORM | Prisma + PostgreSQL | ACID guarantees, type-safe queries, row-level locking |
| Auth | JWT + bcrypt | Industry-standard stateless auth |
| Validation | Zod | Runtime type safety for DTOs |
| Frontend | React 18 + Vite + TypeScript | Fast, type-safe SPA |
| Styling | Tailwind CSS | Utility-first, dark mode, responsive |
| State | TanStack Query + Zustand | Server + client state management |
| Testing | Jest + Supertest | TDD-optimized, fast test runner |
| DevOps | Docker Compose + GitHub Actions | One-command setup, automated CI |

---

## 🧪 Test-Driven Development

This project was built using strict Red-Green-Refactor TDD cycles. Every feature began as a failing test.

### Run Tests
```bash
cd backend

# Run all tests
npm test

# With coverage report
npm run test:coverage
```

### Test Coverage Includes
- ✅ User Registration (validation, duplicate email, role assignment)
- ✅ User Login (credential validation, JWT generation)
- ✅ Vehicle Catalog (pagination, filtering, auth guard)
- ✅ Vehicle CRUD (create, read, update, delete)
- ✅ **Purchase Flow** (stock decrement, out-of-stock 409 response)
- ✅ **Concurrency Test** (5 simultaneous purchases on 1 unit = exactly 1 success, 0 negative stock)
- ✅ Restock (admin-only RBAC, positive quantity enforcement)
- ✅ Delete (admin-only RBAC, 403 for customers)

---

## 🔒 Security Features

- **JWT Authentication**: Stateless bearer tokens with configurable expiry
- **bcrypt Password Hashing**: Cost factor 12 (industry-recommended)
- **RBAC Middleware**: Route-level `ADMIN` / `CUSTOMER` role enforcement
- **Zod DTO Validation**: All inputs validated before reaching services
- **Rate Limiting**: Auth routes (20 req/15min), API (200 req/15min)
- **Helmet.js**: Security headers (CSP, HSTS, X-Frame-Options, etc.)
- **CORS**: Configured for frontend origin with credentials

---

## ⚡ Concurrency & ACID Integrity

The purchase endpoint uses **PostgreSQL pessimistic row-level locking** to prevent race conditions:

```typescript
// From src/modules/vehicles/inventory.service.ts
return await prisma.$transaction(async (tx) => {
  // Locks the vehicle row — concurrent transactions wait here
  const [vehicle] = await tx.$queryRaw`
    SELECT * FROM vehicles WHERE id = ${vehicleId}::uuid FOR UPDATE
  `;
  
  if (vehicle.quantity <= 0) throw new ConflictError('Vehicle is out of stock');
  
  await tx.vehicle.update({ data: { quantity: { decrement: 1 } } });
  await tx.purchaseTransaction.create({ data: { userId, vehicleId, ... } });
  // COMMIT — atomic, consistent, isolated, durable
});
```

This ensures **zero overselling** even when hundreds of users click "Purchase" simultaneously.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new account |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/vehicles` | 🔐 Auth | List all vehicles (paginated) |
| GET | `/api/vehicles?make=Toyota&category=SUV` | 🔐 Auth | Search & filter |
| GET | `/api/vehicles/:id` | 🔐 Auth | Get vehicle details |
| POST | `/api/vehicles` | 🔐 Auth | Create new listing |
| PUT | `/api/vehicles/:id` | 🔐 Auth | Update vehicle |
| DELETE | `/api/vehicles/:id` | 🔐 Admin | Delete vehicle |
| POST | `/api/vehicles/:id/purchase` | 🔐 Auth | Purchase (ACID transaction) |
| POST | `/api/vehicles/:id/restock` | 🔐 Admin | Restock inventory |

---

## 🤖 My AI Usage (Transparency Statement)

This project was co-developed with AI assistance (Claude) following the kata's AI transparency requirements.

### How AI Was Used
1. **Architecture Planning**: Prompted AI to design the clean layered architecture (Controller → Service → Repository)
2. **TDD Test Generation**: Used AI to generate initial failing test cases, then implemented production code to pass them
3. **Concurrency Implementation**: AI suggested the `SELECT FOR UPDATE` pessimistic locking pattern for race-condition safety
4. **Boilerplate Scaffolding**: Auth middleware, Zod schemas, Express router setup
5. **Documentation**: This README and PROMPTS.md

### How AI Was NOT Used
- All architectural decisions (layer separation, error handling strategy, RBAC design) were reviewed and approved before implementation
- The concurrency test design was my own contribution to verify the AI-suggested locking strategy
- All code was read, understood, and verified by the developer

See [PROMPTS.md](./PROMPTS.md) for complete, unedited AI prompt logs.

---

## 📋 Git Commit Convention

All commits follow the TDD Red-Green-Refactor pattern with AI co-authorship trailers:

```
feat: Implement concurrency-safe vehicle purchase with row-level locking

- Added pessimistic SELECT FOR UPDATE in PostgreSQL transaction
- All 5 simultaneous purchase test cases pass with exactly 1 success
- Zero negative inventory confirmed in concurrency test

Co-authored-by: Claude <AI@users.noreply.github.com>
```
