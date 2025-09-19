process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongo;
let userToken;
let adminToken;

async function registerAndLogin(name, email, password, role = 'user') {
  await request(app).post('/api/auth/register').send({ name, email, password, role });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  userToken = await registerAndLogin('User', 'user@example.com', 'password123', 'user');
  adminToken = await registerAndLogin('Admin', 'admin@example.com', 'password123', 'admin');
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
  // Recreate tokens because users were deleted
  userToken = await registerAndLogin('User', 'user@example.com', 'password123', 'user');
  adminToken = await registerAndLogin('Admin', 'admin@example.com', 'password123', 'admin');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

describe('Sweets protected routes and CRUD', () => {
  it('denies access without token', async () => {
    await request(app).get('/api/sweets').expect(401);
  });

  it('creates, lists, searches, updates, and deletes sweets with proper auth', async () => {
    // Create (user allowed)
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 10.5, quantity: 20 })
      .expect(201);

    const id = createRes.body._id;

    // List
    const listRes = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(listRes.body.length).toBe(1);

    // Search by name
    const searchRes = await request(app)
      .get('/api/sweets/search?name=ladoo')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(searchRes.body.length).toBe(1);

    // Update (user allowed)
    const updateRes = await request(app)
      .put(`/api/sweets/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 12.0 })
      .expect(200);
    expect(updateRes.body.price).toBe(12.0);

    // Delete denied for normal user
    await request(app)
      .delete(`/api/sweets/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    // Delete allowed for admin
    await request(app)
      .delete(`/api/sweets/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});

describe('Inventory purchase and restock', () => {
  it('purchases reduces quantity and prevents over-purchase; restock admin-only', async () => {
    // Create a sweet
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Barfi', category: 'Indian', price: 8.0, quantity: 2 })
      .expect(201);

    const id = createRes.body._id;

    // Purchase 1
    const p1 = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 1 })
      .expect(200);
    expect(p1.body.quantity).toBe(1);

    // Purchase 2 (should fail, insufficient)
    await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 2 })
      .expect(400);

    // Restock denied for normal user
    await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 })
      .expect(403);

    // Restock allowed for admin
    const r1 = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 })
      .expect(200);
    expect(r1.body.quantity).toBe(6); // 1 remaining + 5 restocked
  });
});
