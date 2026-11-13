import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/Navbar';
import authReducer from '../redux/slices/authSlice';

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Navbar Component Test Suite', () => {
  it('renders brand name and navigation links for guest user', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: null },
      },
    });

    expect(screen.getByText(/HyperScale/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('renders user details when authenticated', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { name: 'Elena Rostova', role: 'Vendor' },
        },
      },
    });

    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
  });
});

