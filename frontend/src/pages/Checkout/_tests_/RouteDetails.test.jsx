import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TransportProvider } from '@/context/transport-context';
import RouteDetails from '@/components/RouteDetails';

// Mock route data
const mockRoute = {
  routeNumber: 1,
  metrics: {
    duration: { minimum: 9, maximum: 33 },
    cost: { minimum: 177, maximum: 427 },
    distance: { minimum: 8100 },
    carbonEmissions: { minimum: 52, maximum: 217 },
  },
  segments: [
    {
      id: 'segment1',
      from: 'New York, USA',
      to: 'Madrid, Spain',
      transportModes: ['sea', 'plane'],
      distances: [5900, 5700],
      durations: [15, 5],
      costs: [59, 179],
      carbonEmissions: [30, 148],
      fuel_types: ["Bio Fuel", "Jet Fuel"]
    },
    {
      id: 'segment2',
      from: 'Madrid, Spain',
      to: 'Berlin, Germany',
      transportModes: ['road', 'plane'],
      distances: [2000, 1900],
      durations: [12, 3],
      costs: [59, 149],
      carbonEmissions: [14, 52],
      fuel_types: ["Electric (Renewable)", "Jet Fuel"]
    },
    {
      id: 'segment3',
      from: 'Berlin, Germany',
      to: 'Warsaw, Poland',
      transportModes: ['road', 'plane'],
      distances: [500, 500],
      durations: [6, 1],
      costs: [59, 99],
      carbonEmissions: [8, 17],
      fuel_types: ["Diesel", "Jet Fuel"]
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

  it('renders default route details correctly', () => {
    renderWithProvider(<RouteDetails route={mockRoute} greenestRoute={mockRoute} showGif={true} />);

    // Check for heading
    expect(screen.getByText('Option 1 Details')).toBeInTheDocument();

    // Check for metrics
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('33 days')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('$177-427')).toBeInTheDocument();
    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('8100 km')).toBeInTheDocument();
    expect(screen.getByText('Emissions')).toBeInTheDocument();
    expect(screen.getByText('52-217 kg')).toBeInTheDocument();

    // Check for transport mode buttons
    expect(screen.getAllByLabelText('Select sea transport')).toHaveLength(1);
    expect(screen.getAllByLabelText('Select road transport')).toHaveLength(2);

    // Check for Segment 1
    const routeDetailsCard = screen.getByTestId('routeDetails');

    expect(screen.getByText('New York, USA → Madrid, Spain')).toBeInTheDocument();
    expect(screen.getByText('5900 km')).toBeInTheDocument();
    expect(screen.getByText('15 days')).toBeInTheDocument();
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$59');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('30 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Bio Fuel');

    // Check for Segment 2
    expect(screen.getByText('Madrid, Spain → Berlin, Germany')).toBeInTheDocument();
    expect(screen.getByText('2000 km')).toBeInTheDocument();
    expect(screen.getByText('12 days')).toBeInTheDocument();
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$59');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('14 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Electric (Renewable)');

    // Check for Segment 3
    expect(screen.getByText('Berlin, Germany → Warsaw, Poland')).toBeInTheDocument();
    expect(screen.getByText('500 km')).toBeInTheDocument();
    expect(screen.getByText('6 days')).toBeInTheDocument();
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$59');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('8 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Diesel');
  });

  it('does not render anything if no route is provided', () => {
    const { container } = renderWithProvider(<RouteDetails route={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
