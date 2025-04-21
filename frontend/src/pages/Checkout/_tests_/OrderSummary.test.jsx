import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { useTransport } from '../../../context/transport-context';
import OrderSummary from '../components/OrderSummary';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../../../redux/slices/orderSlice';
import cartReducer from '../../../redux/slices/cartSlice'
import authReducer from '../../../redux/slices/authSlice';

// Mock the useTransport hook
vi.mock('@/context/transport-context', () => ({
  useTransport: vi.fn(),
}));

// Mock icons for simplicity
vi.mock('lucide-react', () => ({
  Timer: () => <div>TimerIcon</div>,
  Leaf: () => <div>LeafIcon</div>,
  DollarSign: () => <div>DollarSignIcon</div>,
}));

const renderWithProviders = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      order: orderReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: "test-user-id",
          userName: "John",
          shippingAddress: "123 Test Lane",
        },
      },
      order: {},
      cart: [],
      ...preloadedState,
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}

describe('OrderSummary', () => {
  test('does not render when routeTotals is null', () => {
    vi.mocked(useTransport).mockReturnValue({ routeTotals: null });
    const { container } = renderWithProviders(<OrderSummary />);
    expect(container).toBeEmptyDOMElement();
  });

  describe('when routeTotals is provided', () => {
    const mockRouteTotals = {
      duration: 33,
      emissions: 52,
      cost: 258.99,
    };

    const mockUpdatedRouteTotals = {
      duration: 21,
      emissions: 75,
      cost: 298.99,
    };

    test('renders order summary with correct data', () => {
      vi.mocked(useTransport).mockReturnValue({
        routeTotals: mockRouteTotals,
      });
      renderWithProviders(<OrderSummary />);

      // Check headings and data
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Total Duration')).toBeInTheDocument();
      expect(
        screen.getByText(`${mockRouteTotals.duration} days`)
      ).toBeInTheDocument();
      expect(screen.getByText('Total Emissions')).toBeInTheDocument();
      expect(
        screen.getByText(`${mockRouteTotals.emissions} kg`)
      ).toBeInTheDocument();
      expect(screen.getByText('Order total')).toBeInTheDocument();
      expect(
        screen.getAllByText(`$${mockRouteTotals.cost}`).length
      ).toBeGreaterThan(0);
    });

    test('renders order summary with updated data', () => {
      vi.mocked(useTransport).mockReturnValue({
        routeTotals: mockUpdatedRouteTotals,
      });
      renderWithProviders(<OrderSummary />);

      // Check headings and data
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Total Duration')).toBeInTheDocument();
      expect(
        screen.getByText(`${mockUpdatedRouteTotals.duration} days`)
      ).toBeInTheDocument();
      expect(screen.getByText('Total Emissions')).toBeInTheDocument();
      expect(
        screen.getByText(`${mockUpdatedRouteTotals.emissions} kg`)
      ).toBeInTheDocument();
      expect(screen.getByText('Order total')).toBeInTheDocument();
      expect(
        screen.getAllByText(`$${mockUpdatedRouteTotals.cost}`).length
      ).toBeGreaterThan(0);
    });
  });
});