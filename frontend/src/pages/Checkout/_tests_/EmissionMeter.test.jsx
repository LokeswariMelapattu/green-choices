import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import EmissionMeter from '../components/EmissionMeter';

// ✅ Mock useTransport
vi.mock('@/context/transport-context', () => ({
  useTransport: () => ({
    routeTotals: null, // Let currentValue fallback work
  }),
}));

// ✅ Mock Gauge to avoid dependency issues
vi.mock('../components/Gauge', () => ({
  __esModule: true,
  default: ({ value, maxValue }) => (
    <div data-testid="mock-gauge">{`Gauge Value: ${value}, Max: ${maxValue}`}</div>
  ),
}));

describe('EmissionMeter Component', () => {
  const noop = () => {};

  beforeEach(() => {
    // Nothing special for now
  });

  it('renders heading', () => {
    render(
      <EmissionMeter currentValue={0} maxValue={100} setLowSustainable={noop} />
    );
    expect(screen.getByText('Carbon Emission')).toBeInTheDocument();
  });

  it('displays "Low" label for low emission', () => {
    render(
      <EmissionMeter currentValue={10} maxValue={100} setLowSustainable={noop} />
    );
    expect(screen.getByText(/Low:\s*10\s*Kg/)).toBeInTheDocument();
  });

  it('displays "Moderate" label for moderate emission', () => {
    render(
      <EmissionMeter currentValue={30} maxValue={100} setLowSustainable={noop} />
    );
    expect(screen.getByText(/Moderate:\s*30\s*Kg/)).toBeInTheDocument();
  });

  it('displays "High" label for 60 kg emissions out of 100 kg max', () => {
    render(<EmissionMeter currentValue={60} maxValue={100} setLowSustainable={() => {}} />);
    expect(
      screen.getByText((text) => text.includes('High') && text.includes('60'))
    ).toBeInTheDocument();
  });

  it('displays "Critical" for very high emissions', () => {
    render(
      <EmissionMeter currentValue={90} maxValue={100} setLowSustainable={noop} />
    );
    expect(screen.getByText(/Critical:\s*90\s*Kg/)).toBeInTheDocument();
  });

  it('displays sustainability modal when emissions are high', () => {
    render(
      <EmissionMeter currentValue={60} maxValue={100} setLowSustainable={noop} />
    );
    expect(
      screen.getByText(/A Little More CO₂ Than We'd Like/)
    ).toBeInTheDocument();
  });
});
