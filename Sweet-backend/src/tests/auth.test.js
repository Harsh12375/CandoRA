process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongo;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

describe('Auth: register & login', () => {
  it('registers a user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('prevents duplicate email registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'duplicate@example.com', password: 'password123' })
      .expect(201);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice 2', email: 'duplicate@example.com', password: 'password123' })
      .expect(409);

    expect(res.body.message).toMatch(/already/);
  });

  it('logs in a user and returns a token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'password123' })
      .expect(201);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'password123' })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('bob@example.com');
  });

  it('rejects login with invalid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Eve', email: 'eve@example.com', password: 'password123' })
      .expect(201);

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'eve@example.com', password: 'wrongpass' })
      .expect(401);
  });
});
