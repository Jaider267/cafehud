import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Cafe catalog', () => {
  it('should return a list of cafes', async () => {
    const response = await request(app)
      .get('/api/v1/cafes')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
  });
});
