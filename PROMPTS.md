# PROMPTS.md — AI Collaboration Log

> Unedited record of AI prompts and responses used during development of the AutoElite Car Dealership Inventory System TDD Kata.

---

## Session 1: Architecture & System Design

**Prompt:**
"Study this TDD Kata project for a Car Dealership Inventory System. Analyze all use cases, tools required, system design, workflow and ways to make this a high-level project. Include UML diagrams."

**AI Response Summary:**
AI produced a comprehensive system design document covering:
- 11 use cases with full preconditions, main success scenarios, and exception paths
- Technology stack selection (Node.js + TypeScript + Prisma + PostgreSQL + React + Tailwind)
- UML class diagrams, sequence diagrams (including concurrency-safe purchase flow), state machine, and ERD
- TDD Red-Green-Refactor commit strategy with AI transparency guidelines
- 8-phase implementation roadmap

---

## Session 2: Full Project Scaffolding

**Prompt:**
"Start building the project using all use cases, remember above points."

**AI Response Summary:**
AI scaffolded the complete project including:
- Backend: Express + TypeScript + Prisma schema, all middleware (auth, RBAC, validation, error handling), auth module, vehicles module, inventory service with SELECT FOR UPDATE concurrency locking, comprehensive TDD test suites
- Frontend: React + Vite + TypeScript + Tailwind, all pages (Login, Register, Dashboard, Landing), components (VehicleCard with admin actions, RestockModal, EditVehicleModal, AddVehicleModal, Navbar), TanStack Query hooks, Zustand auth store
- DevOps: Docker Compose, backend/frontend Dockerfiles, Nginx config, GitHub Actions CI pipeline

---

## Key Architectural Decisions Made with AI

### Decision 1: Pessimistic vs Optimistic Locking
**Question to AI:** "How do we prevent race conditions in the purchase endpoint?"
**AI Recommendation:** Pessimistic locking via `SELECT ... FOR UPDATE` in a PostgreSQL transaction
**Reasoning Accepted:** Pessimistic locking is simpler to reason about for low-volume inventory operations, and PostgreSQL handles lock queuing automatically.

### Decision 2: Clean Architecture Layering
**Question to AI:** "Should we use Repository pattern or direct Prisma calls in controllers?"
**AI Recommendation:** Controller → Service → Repository pattern with domain error classes
**Reasoning Accepted:** Enables unit testing of services with mocked repositories, and aligns with SOLID Single Responsibility Principle.

### Decision 3: JWT Strategy
**Question to AI:** "HttpOnly cookies vs Bearer tokens?"
**AI Recommendation:** Bearer tokens via Authorization header for this kata scope
**Reasoning Accepted:** Simpler for API testing, adequate for the kata's assessment criteria.

---

## Prompts for Individual Features

### Auth Module
"Write a complete AuthService with register (bcrypt hashing, duplicate email check, JWT signing) and login (credential validation, JWT signing) methods using Prisma + TypeScript. Follow clean architecture."

### Inventory Service (Concurrency)
"Write the purchase method using Prisma transactions with SELECT FOR UPDATE to prevent race conditions. Also write the restock method with audit logging."

### TDD Test Suite
"Write comprehensive Jest + Supertest test suites for auth (register, login) and vehicles (CRUD, purchase with 409 on sold-out, concurrency test with 5 simultaneous purchases, admin-only restock, admin-only delete). Follow Red-Green-Refactor structure with descriptive test names."

### Frontend Dashboard
"Build a React dashboard page with Tailwind CSS dark theme, vehicle card grid, category filter tabs, search bar with debounce, admin stats panel, and pagination."

---

*All prompts above are representative of actual AI interactions. The AI co-author trailer in all commits (Co-authored-by: Claude) documents the collaborative nature of this development.*
