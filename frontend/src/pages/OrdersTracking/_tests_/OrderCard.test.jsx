import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import OrderCard from '../components/OrderCard';

describe('OrderCard', () => {
  const defaultProps = {
    orderId: 123,
    arrivalDate: 'Apr 25, 2025',
    emissions: '52 kg CO₂',
    isSustainable: false,
    isGreenDelivery: true,
    isSelected: false,
    isLoading: false,
    onClick: vi.fn()
  };

  it('renders the order ID and arrival date', () => {
    render(<OrderCard {...defaultProps} />);
    expect(screen.getByText(/Order 123/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrives before Apr 25, 2025/i)).toBeInTheDocument();
  });

  it('shows emissions info', () => {
    render(<OrderCard {...defaultProps} />);
    expect(screen.getByText(/Emits 52 kg CO₂/i)).toBeInTheDocument();
  });

  it('shows "Greener delivery available" if isGreenDelivery is true', () => {
    render(<OrderCard {...defaultProps} />);
    expect(screen.getByText(/Greener delivery available/i)).toBeInTheDocument();
  });

  it('shows "Most sustainable selected" if isSustainable is true', () => {
    render(<OrderCard {...defaultProps} isSustainable={true} isGreenDelivery={false} />);
    expect(screen.getByText(/Most sustainable selected/i)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<OrderCard {...defaultProps} />);
    fireEvent.click(screen.getByText(/Order 123/i));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<OrderCard {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
