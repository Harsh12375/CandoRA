# Sweet Shop Management System (Backend)

Production-ready Node.js + Express + MongoDB backend with JWT auth, validation, testing, and seed script.

## Tech Stack
- Node.js (LTS)
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Validation (express-validator)
- Jest + Supertest for tests
- dotenv for env vars

## Project Structure
```
src/
  server.js
  app.js
  config/
    db.js
  models/
    User.js
    Sweet.js
  controllers/
    authController.js
    sweetController.js
    inventoryController.js
  middleware/
    auth.js
    error.js
    validate.js
  routes/
    authRoutes.js
    sweetRoutes.js
  seed/
    adminSeed.js
  tests/
    auth.test.js
    sweets.test.js
jest.config.js
.env.example
package.json
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and set values (PORT, MONGO_URI, JWT_SECRET, optional ADMIN_EMAIL/ADMIN_PASSWORD for seeding).
3. Start MongoDB locally or set `MONGO_URI` to a hosted cluster.
4. Seed an initial admin user (optional):
   ```bash
   npm run seed
   ```
5. Run in development:
   ```bash
   npm run dev
   ```
6. Run tests:
   ```bash
   npm test
   ```

## API
Base URL: `/`

### Auth
- POST `/api/auth/register`
  - body: `{ name, email, password, role? }`
  - returns: `{ token, user }`
- POST `/api/auth/login`
  - body: `{ email, password }`
  - returns: `{ token, user }`

### Sweets (Protected)
- POST `/api/sweets` — create
  - body: `{ name, category, price, quantity }`
- GET `/api/sweets` — list all
- GET `/api/sweets/search?name=&category=&minPrice=&maxPrice=` — search/filter
- PUT `/api/sweets/:id` — update
- DELETE `/api/sweets/:id` — delete (Admin only)
- POST `/api/sweets/:id/purchase` — purchase reduce quantity by `amount` (default 1)
  - body: `{ amount? }`
- POST `/api/sweets/:id/restock` — restock by `amount` (Admin only)
  - body: `{ amount }`

All protected endpoints require `Authorization: Bearer <JWT>` header.

## Notes
- Passwords are hashed with bcryptjs.
- Centralized error handling returns JSON with appropriate HTTP codes.
- Tests use `mongodb-memory-server` (no real DB needed).
- For simplicity, the register endpoint accepts `role` (user/admin). In a real production setting, restrict admin role assignment to privileged flows.

## Scripts
- `npm run dev` — start with nodemon
- `npm start` — start server
- `npm test` — run Jest tests
- `npm run seed` — seed initial admin user

