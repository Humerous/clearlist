import React from 'react';
import { test, expect } from 'vitest';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { createAppStore } from './app/store';
import App from './App';

test('renders the signed-out Clearlist workspace', () => {
  localStorage.clear();

  const store = createAppStore({
    auth: {
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
    tasks: {
      items: [],
      loading: false,
      error: null,
    },
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(
    screen.getByRole('heading', { name: 'Today' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /your tasks stay with your account/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('textbox', { name: /email/i })
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText(/password/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: /enter clearlist/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: /create account/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: /open account menu/i })
  ).toBeInTheDocument();
});
