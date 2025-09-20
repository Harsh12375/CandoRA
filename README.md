# CandoRA Sweet Shop — Monorepo (Frontend + Backend)

A full-stack sweet shop application built with a modern Next.js frontend and a production-ready Node.js/Express backend.

- Frontend: `Sweet-frontend/` (Next.js 14 App Router, React 18, Tailwind CSS v4, shadcn/ui, Radix)
- Backend: `Sweet-backend/` (Node.js, Express, MongoDB/Mongoose, JWT auth, Validation, Jest/Supertest)

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
- The backend is complete and ready for use.
- The frontend contains both production-ready UI and some mock-driven pages. You can optionally wire authentication and data fetching to the backend using the guidance below.

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
- Some frontend pages currently use mock data (e.g., inventory). The `/auth` page can be wired to backend auth; see below.

#### Optional: Wire Frontend Auth to Backend
If you want the `/auth` page to use real backend login/register:
1. Create `Sweet-frontend/lib/api.ts`:
   ```ts
   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

   function getBaseUrl() {
     if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
     return BASE_URL.replace(/\/+$/, "");
   }

   class ApiError extends Error {
     status?: number;
     constructor(message: string, status?: number) {
       super(message);
       this.name = "ApiError";
       this.status = status;
     }
   }

   async function request<T>(path: string, init?: RequestInit): Promise<T> {
     const url = `${getBaseUrl()}${path}`;
     const res = await fetch(url, {
       method: "GET",
       headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
       credentials: "omit",
       ...init,
     });
     if (!res.ok) {
       let message = `Request failed with status ${res.status}`;
       try {
         const data = await res.json();
         if (data?.message) message = data.message;
         else if (Array.isArray(data?.errors) && data.errors.length) message = data.errors[0].msg || message;
       } catch {}
       throw new ApiError(message, res.status);
     }
     if (res.status === 204) return undefined as unknown as T;
     return (await res.json()) as T;
   }

   export const auth = {
     login(payload: { email: string; password: string }) {
       return request<{ token: string; user: unknown }>("/api/auth/login", {
         method: "POST",
         body: JSON.stringify(payload),
       });
     },
     register(payload: { name: string; email: string; password: string; role?: "user" | "admin" }) {
       return request<{ token: string; user: unknown }>("/api/auth/register", {
         method: "POST",
         body: JSON.stringify({ ...payload, role: payload.role ?? "user" }),
       });
     },
   };

   export type { ApiError };
   ```
2. In `Sweet-frontend/components/auth-page.tsx`, call `auth.login` or `auth.register`, store `token`/`user` in `localStorage`, and redirect on success.
3. Restart the frontend dev server after editing env or client code.

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

## Screenshots
Place screenshots in `docs/screenshots/` and ensure they are committed. Example references:

- Home page
  
  ![Home](docs/screenshots/home.png)

- Auth page
  
  ![Auth](docs/screenshots/auth.png)

- Showcase
  
  ![Showcase](docs/screenshots/showcase.png)

- Admin Inventory
  
  ![Admin Inventory](docs/screenshots/admin-inventory.png)

> If you don’t have screenshots yet, take them locally (e.g., `Alt+PrtScn` on Windows) and save them under `docs/screenshots/` with the above names.

---

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
