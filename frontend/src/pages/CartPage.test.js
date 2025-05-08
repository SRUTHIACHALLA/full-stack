// CartPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CartPage from './CartPage';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.setItem('cart', JSON.stringify([
    { _id: '1', title: 'Product A', price: 100, quantity: 2, vendorId: 'v1' },
    { _id: '2', title: 'Product B', price: 50, quantity: 1, vendorId: 'v1' }
  ]));
});

afterEach(() => {
  localStorage.clear();
});

test('renders cart items and total', () => {
  render(
    <BrowserRouter>
      <CartPage />
    </BrowserRouter>
  );

  expect(screen.getByText(/Product A/i)).toBeInTheDocument();
  expect(screen.getByText(/Product B/i)).toBeInTheDocument();
  expect(screen.getByText(/Total: ₹250.00/i)).toBeInTheDocument();
});
