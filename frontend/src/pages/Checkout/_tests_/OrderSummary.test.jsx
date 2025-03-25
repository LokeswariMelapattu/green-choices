import '@testing-library/jest-dom';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { useTransport } from '../../../context/transport-context';
import OrderSummary from '../components/OrderSummary';


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

describe('OrderSummary', () => {
  test('does not render when routeTotals is null', () => {
    vi.mocked(useTransport).mockReturnValue({ routeTotals: null });
    const { container } = render(<OrderSummary />);
    expect(container).toBeEmptyDOMElement();
  });

  describe('when routeTotals is provided', () => {
    const mockRouteTotals = {
      duration: 5,
      emissions: 20,
      cost: 100,
    };

    beforeEach(() => {
      // Mock the context with valid routeTotals
      //(useTransport as vi.Mock).mockReturnValue({
        vi.mocked(useTransport).mockReturnValue({
        routeTotals: mockRouteTotals,
      });
    });

    test('renders order summary with correct data', () => {
      render(<OrderSummary />);

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
      expect(screen.getByText('Total Cost')).toBeInTheDocument();
      expect(
        screen.getByText(`$${mockRouteTotals.cost.toFixed(2)}`)
      ).toBeInTheDocument();
    });

    test('renders promo code input and apply button', () => {
      render(<OrderSummary />);

      expect(
        screen.getByPlaceholderText('Enter promo code')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /apply/i })
      ).toBeInTheDocument();
    });

    test('updates promo code input when typed', async () => {
      const user = userEvent.setup();
      render(<OrderSummary />);

      const input = screen.getByPlaceholderText('Enter promo code');
      await user.type(input, 'TEST123');
      expect(input).toHaveValue('TEST123');
    });
  });
});