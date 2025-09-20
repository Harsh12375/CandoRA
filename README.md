# CandoRA Sweet Shop — Monorepo (Frontend + Backend)

A full-stack sweet shop application built with a modern Next.js frontend and a production-ready Node.js/Express backend.

- Frontend: `Sweet-frontend/` (Next.js 14 App Router, React 18, Tailwind CSS v4, shadcn/ui, Radix)
- Backend: `Sweet-backend/` (Node.js, Express, MongoDB/Mongoose, JWT auth, Validation, Jest/Supertest)

## Screenshots
Place screenshots in `docs/screenshots/` and ensure they are committed. Example references:

- Landing page 
  
  <img width="1892" height="905" alt="image" src="https://github.com/user-attachments/assets/e811bead-13ee-40bb-973c-7977617acca3" />
<img width="1895" height="904" alt="image" src="https://github.com/user-attachments/assets/358bd70e-8b5d-4cd4-b75a-ad7e6512622d" />
<img width="1899" height="912" alt="image" src="https://github.com/user-attachments/assets/9814f35d-ccc3-4665-9661-7eadba361781" />




- Auth page
  
  <img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/5fb7e000-3fb4-4418-9685-5603c11ee555" />
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/e598a273-9d56-424e-be51-c6ceca1345c9" />



- Showcase
  
 <img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/1ebcc8da-69f6-4dcc-bacb-0a1abc897c05" />
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/0782d88b-9a38-4dae-beef-c4fc373c2dfe" />



- Admin Inventory
  
  ![Admin Inventory](docs/screenshots/admin-inventory.png)

- Admin Dashboard
  
  ![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
  - [Backend Setup (Sweet-backend/)](#backend-setup-sweet-backend)
  - [Frontend Setup (Sweet-frontend/)](#frontend-setup-sweet-frontend)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [My AI Usage](#my-ai-usage)

---

## Project Overview
CandoRA is a sweet shop application showcasing a polished marketing site and an admin interface. The backend provides a secure REST API with JWT-based authentication, validation, and testing. The frontend delivers a modern UI/UX with animations and responsive design.

Current status:
- Backend is complete and ready.
- Frontend is connected to the backend for:
  - User auth (login/register)
  - Showcase listing and purchase flow
  - Admin Dashboard (create, restock, delete sweets)
  - Admin Inventory (load & update stock)
  Some secondary widgets remain mock (e.g., Recent Orders/Top Products lists).

---

## Tech Stack
- Frontend
  - Next.js 14 (App Router), React 18
  - Tailwind CSS v4 (via PostCSS)
  - shadcn/ui, Radix UI, lucide-react, framer-motion
- Backend
  - Node.js + Express.js
  - MongoDB with Mongoose
  - JWT Auth (`jsonwebtoken`), Validation (`express-validator`)
  - Testing: Jest + Supertest, `mongodb-memory-server`

---

## Repository Structure
```
CandoRA/
├─ Sweet-frontend/              # Next.js app
│  ├─ app/                      # App router pages (/, /auth, /showcase, /admin/*)
│  ├─ components/               # UI components
│  ├─ public/                   # Public assets
│  ├─ styles/                   # Global styles (Tailwind)
│  ├─ postcss.config.mjs
│  ├─ next.config.mjs
│  ├─ tsconfig.json
│  └─ package.json
│
├─ Sweet-backend/               # Express API
│  ├─ src/
│  │  ├─ app.js                 # Express app
│  │  ├─ server.js              # Server bootstrap + DB connect
│  │  ├─ config/db.js           # Mongoose connect
│  │  ├─ models/                # Mongoose models (User, Sweet)
│  │  ├─ controllers/           # Controllers (auth, sweet, inventory)
│  │  ├─ routes/                # API routes
│  │  ├─ middleware/            # auth, validate, error handlers
│  │  ├─ seed/                  # Seed scripts (admin + sample data)
│  │  └─ tests/                 # Jest/Supertest tests
│  ├─ BACKEND.md                # Backend-specific docs
│  └─ package.json
│
├─ docs/
│  └─ screenshots/              
│
└─ .gitignore                   # Unified ignore for frontend & backend
```

---

## Prerequisites
- Node.js (LTS recommended)
- npm (or your preferred package manager)
- MongoDB instance (local or MongoDB Atlas)

---

## Local Setup

### Backend Setup (Sweet-backend)
1. Install dependencies:
   ```bash
   cd Sweet-backend
   npm install
   ```
2. Create `.env` with at least:
   ```env
   MONGO_URI=mongodb://localhost:27017/candora
   JWT_SECRET=replace_with_a_long_random_secret
   PORT=5000
   # Optional admin seed override
   # ADMIN_EMAIL=admin@sweetshop.com
   # ADMIN_PASSWORD=Admin@12345
   ```
3. Start MongoDB locally (or ensure your Atlas URI is reachable).
4. Seed an initial admin (optional):
   ```bash
   npm run seed         # seeds Admin user
   npm run seed:sample  # seeds sample sweets and a demo user
   ```
5. Run the backend in dev mode:
   ```bash
   npm run dev
   ```
6. Health check:
   - Open http://localhost:5000/health → `{ "status": "ok" }`

7. Run tests (optional):
   ```bash
   npm test
   ```

### Frontend Setup (Sweet-frontend)
1. Install dependencies:
   ```bash
   cd Sweet-frontend
   npm install
   ```
2. Create `.env.local` with the backend URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```
3. Run the frontend:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

Notes:
- Frontend is already wired to the backend through a typed API client and guarded admin routes.
- Key integration files and paths:
  - `Sweet-frontend/lib/api.ts` — central API client (auth, sweets, inventory)
  - `Sweet-frontend/components/auth-page.tsx` — login/register using backend
  - `Sweet-frontend/components/sweet-showcase.tsx` — loads sweets, purchase flow
  - `Sweet-frontend/app/admin/page.tsx` — admin login (requires admin role)
  - `Sweet-frontend/components/admin-layout.tsx` — admin guard + logout
  - `Sweet-frontend/app/admin/dashboard/page.tsx` — create/restock/delete sweets
  - `Sweet-frontend/app/admin/inventory/page.tsx` — list and update stock

No extra wiring needed beyond setting the env vars and running the dev servers.

---

## API Overview
Base URL: `/` (default `http://localhost:5000`)

- Auth
  - `POST /api/auth/register` → `{ token, user }`
  - `POST /api/auth/login` → `{ token, user }`
- Sweets (Protected)
  - `POST /api/sweets` — create
  - `GET /api/sweets` — list
  - `GET /api/sweets/search?name=&category=&minPrice=&maxPrice=`
  - `PUT /api/sweets/:id` — update
  - `DELETE /api/sweets/:id` — admin only
  - Inventory
    - `POST /api/sweets/:id/purchase`
    - `POST /api/sweets/:id/restock` — admin only

All protected endpoints require `Authorization: Bearer <JWT>`.

---

## Frontend Features
- Auth
  - `components/auth-page.tsx` uses backend `POST /api/auth/register` and `POST /api/auth/login`.
  - On success, stores `token` and `user` in `localStorage` and redirects to `/showcase`.

- Showcase
  - `components/sweet-showcase.tsx` loads sweets from `GET /api/sweets`.
  - Cart purchases call `POST /api/sweets/:id/purchase` for each cart item and refresh the list.
  - Falls back to demo data if not authenticated, so the UI remains usable.

- Admin Dashboard
  - `app/admin/dashboard/page.tsx` (guarded by `components/admin-layout.tsx`).
  - Create Sweet → `POST /api/sweets`.
  - Restock → `POST /api/sweets/:id/restock`.
  - Delete → `DELETE /api/sweets/:id`.
  - Summary cards computed from live sweets data.

- Admin Inventory
  - `app/admin/inventory/page.tsx` (guarded).
  - Loads sweets via `GET /api/sweets` and maps to inventory rows.
  - Update stock via `PUT /api/sweets/:id` (quantity).
  - Client-side filtering, sorting, pagination.



## Troubleshooting
- "NEXT_PUBLIC_API_BASE_URL is not set" on frontend
  - Create `Sweet-frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000` and restart `npm run dev`.
- Mongo connection errors
  - Verify `MONGO_URI` in `Sweet-backend/.env`.
  - Ensure MongoDB service is running or Atlas IP is allowed.
- CORS issues
  - Backend uses `cors()` globally. If you lock origins later, include `http://localhost:3000` in allowed origins.
- JWT invalid/expired
  - Clear `localStorage` and log in again.

---

## My AI Usage
- **Task breakdown and planning**: Used ChatGPT 5 Mini (Reasoning) to break down requirements, outline steps, and draft the overall plan and documentation structure.
- **Design inspiration**: Referred to Webflow, Figma, and v0 for design ideas, component patterns, and visual inspiration. No proprietary designs or paid assets were copied.
- **Code generation assistance**: Used Claude to accelerate drafting boilerplate, iterate on UI interactions, and refine code snippets.
- **Human review**: All AI-assisted outputs were reviewed, adapted, and verified by me. No secrets or private credentials were shared with AI tools.
