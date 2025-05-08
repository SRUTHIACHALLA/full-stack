import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

beforeEach(() => {
  localStorage.setItem('token', 'dummy-token');
  localStorage.setItem('role', 'customer');
  localStorage.setItem('cart', JSON.stringify([]));
});

test('renders Shopiverse logo for customer', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  screen.debug(); // Optional: view output

  const logo = screen.getByText(/Shopiverse/i);
  expect(logo).toBeInTheDocument();
});
