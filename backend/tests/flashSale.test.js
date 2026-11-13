const request = require('supertest');
const app = require('../src/app');

describe('Flash Sale Architecture Test Suite', () => {
  it('GET /api/v1/flash-sale/status/:invalidId without DB should handle gracefully', async () => {
    const res = await request(app).get('/api/v1/flash-sale/status/507f1f77bcf86cd799439011');
    // If not found or DB disconnected, should return either 404 or 500 error structure
    expect([404, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', false);
  });

  it('POST /api/v1/flash-sale/purchase without auth token should reject with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/flash-sale/purchase')
      .send({ productId: '507f1f77bcf86cd799439011', quantity: 1 });
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});

