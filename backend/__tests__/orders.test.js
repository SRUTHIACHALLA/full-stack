import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app.js';

const token = jwt.sign(
  { id: 'cust123', role: 'customer' },
  process.env.JWT_SECRET || 'testsecret'
);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('POST /api/orders/create', () => {
  it('should place an order and return success message', async () => {
    const orderPayload = {
      vendorId: 'vendor456',
      products: [{ productId: 'p1', quantity: 2 }],
      totalAmount: 2000,
      location: { city: 'CityX', pincode: '123456' }
    };

    const res = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send(orderPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Order placed');
  });
});
