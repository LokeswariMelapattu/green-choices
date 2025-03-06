import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TransportProvider } from '@/context/transport-context';
import RouteDetails from '../RouteDetails';

// Mock route data
const mockRoute = {
  routeNumber: 1,
  metrics: {
    duration: { minimum: 5, maximum: 10 },
    cost: { minimum: 2000, maximum: 5000 },
    distance: { minimum: 8000 },
    carbonEmissions: { minimum: 300, maximum: 700 },
  },
  segments: [
    {
      id: 'segment1',
      from: 'Toronto',
      to: 'Los Angeles',
      transportModes: ['road', 'sea', 'plane'],
      distances: [5000, 8000, 3500],
      durations: [10, 15, 5],
      costs: [2000, 1500, 5000],
      carbonEmissions: [600, 400, 300],
    },
    {
      id: 'segment2',
      from: 'Los Angeles',
      to: 'Sydney',
      transportModes: ['sea', 'plane'],
      distances: [12000, 7500],
      durations: [20, 10],
      costs: [4000, 6000],
      carbonEmissions: [500, 300],
    },
  ],
};

// Helper to wrap component with provider
const renderWithProvider = (ui) => {
  return render(
    <TransportProvider>
      {ui}
    </TransportProvider>
  );
};

describe('RouteDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders route details correctly', () => {
    renderWithProvider(<RouteDetails route={mockRoute} />);

    // Check for heading
    expect(screen.getByText('Route 1 Details')).toBeInTheDocument();

    // Check for metrics
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('5-10 days')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('$2000-5000')).toBeInTheDocument();
    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('8000 km')).toBeInTheDocument();
    expect(screen.getByText('Emissions')).toBeInTheDocument();
    expect(screen.getByText('300-700 kg')).toBeInTheDocument();

    // Check for segments
    expect(screen.getByText('Toronto → Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('3500 km')).toBeInTheDocument();  // Initial (road)

    expect(screen.getByText('Los Angeles → Sydney')).toBeInTheDocument();
    expect(screen.getByText('7500 km')).toBeInTheDocument();  // Initial (sea)
  });

  it('switches transport mode when icon is clicked', () => {
    renderWithProvider(<RouteDetails route={mockRoute} />);

    // First segment (Toronto → Los Angeles), starts as "road"
    expect(screen.getByText('3500 km')).toBeInTheDocument();
    //expect(screen.getByText('300 kg')).toBeInTheDocument();

    // Click to switch to "sea"
    const seaIcon = screen.getAllByRole('button', { name: /select sea transport/i })[0];
    fireEvent.click(seaIcon);

    // Now the values should change for "sea"
    expect(screen.getByText('8000 km')).toBeInTheDocument();
    //expect(screen.getByText('400 kg')).toBeInTheDocument();

    // Click to switch to "plane"
    const planeIcon = screen.getAllByRole('button', { name: /select plane transport/i })[0];
    fireEvent.click(planeIcon);

    // Now the values should change for "plane"
    //expect(screen.getByText('3500 km')).toBeInTheDocument();
    expect(screen.getByText('300 kg')).toBeInTheDocument();
  });

  it('handles multiple segments correctly', () => {
    renderWithProvider(<RouteDetails route={mockRoute} />);

    // Check segment 2 initial mode (sea)
    expect(screen.getByText('Los Angeles → Sydney')).toBeInTheDocument();
    expect(screen.getByText('7500 km')).toBeInTheDocument();  // Plane distance
    //expect(screen.getByText('300 kg')).toBeInTheDocument();    // Plane emissions

    // Switch to "sea"
    const planeIcon = screen.getAllByRole('button', { name: /select plane transport/i })[1];
    fireEvent.click(planeIcon);

    // // Should show plane data now
     expect(screen.getByText('12000 km')).toBeInTheDocument();  // Sea distance
     expect(screen.getByText('500 kg')).toBeInTheDocument();    // Sea emissions
  });

  it('does not render anything if no route provided', () => {
    const { container } = renderWithProvider(<RouteDetails route={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
