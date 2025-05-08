import request from 'supertest';
import app from '../app.js';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';

jest.mock('razorpay');

const mockCreate = jest.fn().mockResolvedValue({ id: 'order_123', amount: 1000, currency: 'INR' });

beforeEach(() => {
  Razorpay.mockImplementation(() => ({
    orders: {
      create: mockCreate
    }
  }));
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('POST /api/payment/create-order', () => {
  it('should create a Razorpay order successfully', async () => {
    const res = await request(app)
      .post('/api/payment/create-order')
      .send({ amount: 1000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('order_123');
  });
});
    