# PROMPTS.md — AI Collaboration Log

> Unedited record of AI prompts, design decisions, and architectural iterations during the development of the AutoElite (CarWale Edition) Car Dealership Inventory System TDD Kata.

---

## Session 1: Architecture & System Design

**Prompt:**
> "Study this, project, see all use cases tools reqd, and system design, workflow and ways to make this a high level project, see uml, etc as well"

**AI Actions & Output:**
* Researched the TDD Kata specification (`media_1792878146019_9f5f68ec.pdf`).
* Produced an exhaustive engineering blueprint in [`car_dealership_system_design.md`](./car_dealership_system_design.md) containing:
  * 11 core use cases with pre-conditions, triggers, main success scenarios, and error paths.
  * Mermaid diagrams: Actor Use Case Diagram, Clean Architecture Diagram, Entity-Relationship Diagram (ERD), Class Diagram, Concurrency Sequence Diagram (`SELECT ... FOR UPDATE`), and State Machine Diagram.
  * Technical stack evaluation: Node.js + Express + TypeScript, Prisma ORM, PostgreSQL (with zero-config SQLite local option), React 18 + Tailwind CSS, Jest + Supertest.
  * TDD Red-Green-Refactor roadmap and AI transparency requirements.

---

## Session 2: Full Project Implementation & TDD Test Suite

**Prompt:**
> "So start building project using all use cases, remember above points"

**AI Actions & Output:**
* Built the backend foundation (`backend/src/`):
  * Domain error classes (`AppError`, `NotFoundError`, `ConflictError`, `ForbiddenError`, `UnauthorizedError`).
  * Middleware for JWT verification, Admin RBAC guards, and Zod DTO validation.
  * `AuthService` (bcrypt hashing with cost 12, JWT signing).
  * `VehicleService` (CRUD, filtering, pagination).
  * `InventoryService` with pessimistic concurrency-safe locking (`SELECT ... FOR UPDATE` on PostgreSQL and serialized atomic transactions on SQLite) to prevent overselling.
  * Interactive Swagger OpenAPI 3.0 documentation mounted at `/api/docs`.
* Built the frontend application (`frontend/src/`):
  * React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod.
  * Admin vehicle management modals (Add, Edit, Restock, Delete).
  * Zustand auth store with localStorage persistence.
* Authored the TDD test suite (`backend/tests/`):
  * `auth.test.ts` (UC-01 Registration, UC-02 Login, DTO validation).
  * `vehicles.test.ts` (UC-04 Catalog, UC-05 Search, UC-07 Purchase, UC-08 Restock, UC-09 Create, UC-10 Update, UC-11 Delete).
  * Concurrency test firing 5 simultaneous purchases against stock = 1 (1 succeeds, 4 fail with 409, 0 negative stock).

---

## Session 3: Indian Fleet Transition & Theme System

**Prompt:**
> "Now remove the blue colour from front end and make it a light mode and dark mode theme, replace the cars from indian cars only and one more thing, you should see cars in main screen, not after logging in or sign, in only during purchase, it should ask to login, or create account"

**AI Actions & Output:**
* Removed all blue color schemes from Tailwind CSS and components, transitioning to an authentic CarWale dark navy (`#070b12`) / zinc palette with teal, amber, and red accents.
* Created `themeStore.ts` with light/dark theme toggle and HTML root class persistence.
* Seeded 16 iconic Indian vehicles (Mahindra Thar 4x4, Tata Nexon EV, Mahindra XUV700, Tata Harrier, Hyundai Creta, Kia Seltos, Maruti Suzuki Swift, Tata Safari, Mahindra Scorpio-N, Honda City Hybrid, Maruti Suzuki Brezza, Tata Punch, Toyota Fortuner Legender, Maruti Suzuki Dzire, Tata Tiago EV, Mahindra Bolero Neo) with INR pricing (`₹`).
* Refactored `vehicles.router.ts` to make `GET /api/vehicles` and `GET /api/vehicles/:id` public so cars appear on the home screen immediately for guest visitors.
* Implemented `AuthPromptModal.tsx` triggering only when an unauthenticated guest attempts a purchase.

---

## Session 4: CarWale UI Reference Alignment

**Prompt:**
> "I want front end similar to this, like cars shown, in my front end no cars are being shown"

**AI Actions & Output:**
* Analyzed uploaded CarWale screenshot (`media_1792883546242_708be31b.png`).
* Resolved the "no cars being shown" bug:
  1. Isolated the Jest test database in `tests/setup.ts` to `file:./test.db` so test suite teardowns no longer wipe the development database.
  2. Added universal keyword `search` in backend schema and service matching across `make`, `model`, and `category`.
* Rebuilt `DashboardPage.tsx` and `Navbar.tsx` to match the reference layout:
  * Top Navbar with `carwale` brandmark, uppercase menu items, search input, city selector (`Delhi NCR`), theme toggle, and user account button.
  * "Find Your Right Car" hero with single search capsule (`[New] [Used]` pill + text search + magnifying glass) and quick filter chips (Budget, Body Type, Fuel Type, Transmission).
  * "📈 Trending Cars" shelf with horizontal cards, car photo, `Ad` tag, and smooth `<` `>` scrolling.
  * "Popular Cars By Budget" with amber indicator bar (`▎ Cars Under 10 Lakh`) and cyan-highlighted sub-filters (`Sub Compact SUV`, `Hatchback`, `Sedan & Others`).

---

## Session 5: Authentic 1:1 Indian Car Photography

**Prompt:**
> "Everything's better now, but I wanted Indian cars, you put foreign car images, car name and car image should be same, all cars should be Indian"

**AI Actions & Output:**
* Replaced generic Unsplash placeholders with authentic, verified photos for all 16 Indian car models.
* Downloaded high-resolution genuine photos to `frontend/public/cars/` for instant local serving (0ms latency, zero broken links).
* Configured Express static asset middleware (`app.use('/cars', express.static(...))`) and Vite static assets.
* Re-seeded database with exact 1:1 `/cars/...` mapping.

---

## Session 6: Interactive Car Folder Dossier & Payment Options

**Prompt:**
> "Next, when I click on any car, it should open a folder of car, where I can add the car, and in the end I want to see payment options"

**AI Actions & Output:**
* Built [`CarDossierModal.tsx`](frontend/src/components/vehicles/CarDossierModal.tsx) and [`carSpecs.ts`](frontend/src/lib/carSpecs.ts):
  * **Step 1: Car Dossier (Folder)**:
    * Performance specs table (Engine, Power, Torque, Transmission, Mileage/Range, NCAP Safety Stars, Seating, Boot space, Ground clearance).
    * Exterior color swatches (Red Rage, Napoli Black, Everest White, etc.) with active ring indicator.
    * Accessories & protection package checklist (Extended Warranty, 3M Ceramic Coating, 7D Mats, Dashcam) with real-time price updates.
    * Detailed on-road price calculation table (Ex-Showroom + RTO + Insurance + FASTag + Selected Add-ons).
  * **Step 2: Indian Payment Options Suite**:
    * 📱 UPI / Dynamic QR Code (Google Pay, PhonePe, Paytm, BHIM with interactive UPI ID).
    * 🏦 Bank Car Loan EMI Calculator (SBI, HDFC, ICICI, Axis with 36/60/84 month tenures and live EMI).
    * 💳 Cards (RuPay, Visa, MasterCard).
    * 🏛️ Net Banking (top Indian banks).
    * 🏷️ ₹25,000 Token Advance to reserve inventory immediately.
    * Guest checkout with 1-Click Login as Vikram Sharma (Customer).
  * **Step 3: Booking Confirmed & Official Receipt**:
    * Executes ACID-safe backend transaction decrementing inventory.
    * Displays verified Booking ID (`CW-IND-XXXXXX`) and printable receipt.

---

## Session 7: Root API Gateway Dashboard (Port 3001)

**Prompt:**
> "Backend host, shows this [Image showing `{"error":"NOT_FOUND","message":"Route not found"}` on `localhost:3001`]"

**AI Actions & Output:**
* Implemented a root `GET /` route in [`backend/src/app.ts`](backend/src/app.ts).
* For browser visits, renders a dark-themed API Gateway Dashboard with:
  * Server status badge (🟢 Online).
  * One-click navigation cards to the Frontend Showroom (`localhost:5173`), Swagger UI (`/api/docs`), and Vehicle Inventory (`/api/vehicles`).
  * Active REST routes table and demo reviewer credentials.
* For programmatic API clients (`Accept: application/json`), returns structured server status JSON.

---

## Verification Summary

| Check | Result |
|:---|:---|
| Backend Test Suite | **26 passed, 26 total (100% pass rate)** |
| Frontend Build | **`tsc && vite build` passed with 0 errors** |
| Local Database | **Seeded with 16 authentic Indian cars & local photos** |
| Concurrency Test | **Verified: 0 negative stock, zero overselling** |
| AI Commit Trailers | **`Co-authored-by: Gemini <AI@users.noreply.github.com>`** |
