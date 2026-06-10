import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';

describe('Authentication flow', () => {
  const testUser = {
    name: 'Test Café User',
    email: 'testuser@example.com',
    password: 'Password1234'
  };

  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await mongoose.connection.close();
  });

  it('should register, login, fetch profile and logout with cookie auth', async () => {
    await User.deleteMany({ email: testUser.email });

    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201);

    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.user.email).toBe(testUser.email);
    expect(registerRes.headers['set-cookie']).toBeDefined();

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.user.email).toBe(testUser.email);
    expect(loginRes.headers['set-cookie']).toBeDefined();

    const cookie = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe(testUser.email);

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(logoutRes.body.success).toBe(true);
  });
});
