import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // This assumes 'learn react' is actually in your Landing/Login/etc.
  const linkElement = screen.queryByText(/Select your role to login or sign up/i);
  expect(linkElement).toBeInTheDocument(); // Update this if needed
});
