const request = require('supertest');
const app = require('../src/app');

describe('Auth & Health Integration Test Suite', () => {
  it('GET /health should return 200 OK with services status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('services');
  });

  it('POST /api/v1/auth/login with missing credentials should return 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('errors');
  });

  it('POST /api/v1/auth/refresh-token with no token should return 401 Unauthorized', async () => {
    const res = await request(app).post('/api/v1/auth/refresh-token').send({});
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});

