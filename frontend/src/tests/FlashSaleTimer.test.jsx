import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FlashSaleTimer from '../components/FlashSaleTimer';
import authReducer from '../redux/slices/authSlice';
import productReducer from '../redux/slices/productSlice';
import orderReducer from '../redux/slices/orderSlice';

const renderComponent = (props = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      products: productReducer,
      orders: orderReducer,
    },
  });

  return render(
    <Provider store={store}>
      <FlashSaleTimer {...props} />
    </Provider>
  );
};

describe('FlashSaleTimer Component Test Suite', () => {
  it('renders countdown and default product info', () => {
    renderComponent({
      product: {
        _id: 'test-123',
        title: 'Industrial Heavy Duty Inverters',
        price: 2499,
        flashSale: {
          isEnabled: true,
          discountPrice: 1249,
          stock: 40,
        },
      },
    });

    expect(screen.getByText(/Industrial Heavy Duty Inverters/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1249/i)).toBeInTheDocument();
    expect(screen.getByText(/EXECUTE FLASH TRADE ORDER/i)).toBeInTheDocument();
  });
});

