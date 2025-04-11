import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Comparision from '../components/Comparision';

// ✅ Mock useRoutes hook
vi.mock('../../../hooks/useRoutes', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    default: vi.fn(() => ({
      totalEmissions: [],
      route: null,
      selectedRoute: null,
      setSelectedRoute: vi.fn(),
    })),
  };
});

// ✅ Mock AG Charts - AgGauge
vi.mock('ag-charts-react', () => ({
  AgGauge: ({ options }) => (
    <div
      data-testid="gauge"
      data-value={options.value}
      data-color={options.color}
    >
      GaugeMock
    </div>
  ),
}));

import useRoutes from '../../../hooks/useRoutes';

describe('Comparision Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders nothing when totalEmissions is empty', () => {
    useRoutes.mockReturnValue({ totalEmissions: [] });
  
    render(<Comparision maxValue={1000} />);
    
    // Assert that no option labels are rendered
    expect(screen.queryByText(/Option \d/)).not.toBeInTheDocument();
  });

  it('renders correct number of route emissions', () => {
    const mockEmissions = [
      { name: 'Route 1', minTotalEmissions: 200 },
      { name: 'Route 2', minTotalEmissions: 400 },
    ];

    useRoutes.mockReturnValue({ totalEmissions: mockEmissions });

    render(<Comparision maxValue={1000} />);
    const labels = screen.getAllByText(/Option \d/);
    expect(labels).toHaveLength(2);
  });

  it('formats emission values correctly', () => {
    useRoutes.mockReturnValue({
      totalEmissions: [{ name: '1', minTotalEmissions: 123.456 }],
    });

    render(<Comparision maxValue={1000} />);
    expect(screen.getByText(/123\.46\s*kgCO₂/)).toBeInTheDocument();
  });

  it.each([
    [100, 'bg-green-500'],
    [300, 'bg-lime-500'],
    [550, 'bg-yellow-500'],
    [700, 'bg-orange-500'],
    [850, 'bg-red-500'],
  ])('applies correct color for %i kgCO₂', (value, expectedColor) => {
    useRoutes.mockReturnValue({
      totalEmissions: [{ name: '1', minTotalEmissions: value }],
    });

    render(<Comparision maxValue={1000} />);
    const gauge = screen.getByTestId('gauge');
    expect(gauge).toHaveAttribute('data-color', expectedColor);
    expect(gauge).toHaveAttribute('data-value', value.toString());
  });
});
