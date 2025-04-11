import { fireEvent, prettyDOM, render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import RouteSelector from "@/components/RouteSelector";
import { TransportProvider } from '@/context/transport-context';
import RouteDetails from "../../../components/RouteDetails";

// Helper to wrap component with provider

const renderWithProvider = (ui) => {
  return render(
    <TransportProvider>
      {ui}
    </TransportProvider>
  );
};

describe("RouteSelector Component", () => {
  const mockRoutes = [
    {
      routeNumber: "A1",
      segments: [{ transportModes: ["road"] }],
      metrics: {
        duration: { minimum: 2, maximum: 5 },
        distance: { minimum: 500 },
        cost: { minimum: 100, maximum: 200 },
        carbonEmissions: { minimum: 50, maximum: 80 }
      }
    },
    {
      routeNumber: "A2",
      segments: [{ transportModes: ["road"] }],
      metrics: {
        duration: { minimum: 2, maximum: 21 },
        distance: { minimum: 7000 },
        cost: { minimum: 197, maximum: 417 },
        carbonEmissions: { minimum: 75, maximum: 190 }
      }
    }
  ];

  const mockRouteDetails = {
    routeNumber: 2,
    metrics: {
      duration: { minimum: 6, maximum: 21 },
      cost: { minimum: 197, maximum: 417 },
      distance: { minimum: 7000 },
      carbonEmissions: { minimum: 75, maximum: 190 },
    },
    segments: [
      {
        id: 'segment1',
        from: 'New York, USA',
        to: 'London, UK',
        transportModes: ['sea', 'plane'],
        distances: [5600, 5500],
        durations: [7, 3],
        costs: [59, 169],
        carbonEmissions: [50, 143],
        fuel_types: ["Diesel", "Jet Fuel"]
      },
      {
        id: 'segment2',
        from: 'London, UK',
        to: 'Berlin, Germany',
        transportModes: ['road', 'plane'],
        distances: [1100, 1000],
        durations: [8, 2],
        costs: [79, 149],
        carbonEmissions: [17, 30],
        fuel_types: ["Diesel", "Jet Fuel"]
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


  it("should select the first delivery option by default", () => {
    render(<RouteSelector routes={mockRoutes} selectedRoute={mockRoutes[0]} onRouteSelect={() => { }} />);

    // Find the route name inside the card
    const routeText = screen.getByText("Option 1");

    // Traversing up until we find the div with a class "border-green-500 bg-green-50" used for the selected route
    let routeCard = routeText;
    while (routeCard && !routeCard.className.includes("border-green-500")) {
      routeCard = routeCard.parentElement;
    }

    expect(routeCard).toHaveClass("border-green-500 bg-green-50");
  });

  it("should highlight the new selected delivery option", () => {
    const { rerender } = render(
      <RouteSelector
        routes={mockRoutes}
        selectedRoute={mockRoutes[0]}
        onRouteSelect={() => { }}
      />
    );

    const option2Text = screen.getByText("Option 2");

    let routeCard = option2Text;
    while (routeCard && !routeCard.classList?.contains("min-w-[300px]")) {
      routeCard = routeCard.parentElement;
    }

    expect(routeCard).not.toHaveClass("border-green-500", "bg-green-50");

    fireEvent.click(routeCard);

    rerender(
      <RouteSelector
        routes={mockRoutes}
        selectedRoute={mockRoutes[1]}
        onRouteSelect={() => { }}
      />
    );

    const updatedOption2 = screen.getByText("Option 2");
    let updatedCard = updatedOption2;
    while (updatedCard && !updatedCard.classList?.contains("min-w-[300px]")) {
      updatedCard = updatedCard.parentElement;
    }

    expect(updatedCard).toHaveClass("border-green-500", "bg-green-50");
  })

  it("should update delivery route information when a new delivery option is selected", () => {
    const { rerender } = render(
      <RouteSelector
        routes={mockRoutes}
        selectedRoute={mockRoutes[0]}
        onRouteSelect={() => { }}
      />
    );

    const option2Text = screen.getByText("Option 2");

    let routeCard = option2Text;
    while (routeCard && !routeCard.classList?.contains("min-w-[300px]")) {
      routeCard = routeCard.parentElement;
    }

    fireEvent.click(routeCard);

    rerender(
      <RouteSelector
        routes={mockRoutes}
        selectedRoute={mockRoutes[1]}
        onRouteSelect={() => { }}
      />
    );

    renderWithProvider(<RouteDetails route={mockRouteDetails} greenestRoute={mockRouteDetails} showGif={true} />);

    // Check for heading
    const routeDetailsCard = screen.getByTestId('routeDetails');
    expect(routeDetailsCard).toHaveTextContent('Option 2 Details');

    // Check for metrics
    expect(routeDetailsCard).toHaveTextContent('Duration');
    expect(routeDetailsCard).toHaveTextContent('21 days');
    expect(routeDetailsCard).toHaveTextContent('Cost');
    expect(routeDetailsCard).toHaveTextContent('$197-417');
    expect(routeDetailsCard).toHaveTextContent('Distance');
    expect(routeDetailsCard).toHaveTextContent('7000 km');
    expect(routeDetailsCard).toHaveTextContent('Emissions');
    expect(routeDetailsCard).toHaveTextContent('75-190 kg');

    // Check for transport mode buttons in all segments

    const seaTransportButtons = within(routeDetailsCard).getAllByLabelText('Select sea transport');
    expect(seaTransportButtons).toHaveLength(1);

    const roadTransportButtons = within(routeDetailsCard).getAllByLabelText('Select road transport');
    expect(roadTransportButtons).toHaveLength(2);

    // Check for Segment 1
    expect(routeDetailsCard).toHaveTextContent('New York, USA → London, UK');
    expect(routeDetailsCard).toHaveTextContent('5600 km');
    expect(routeDetailsCard).toHaveTextContent('7 days');
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$59');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('50 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Diesel');

    // Check for Segment 2
    expect(routeDetailsCard).toHaveTextContent('London, UK → Berlin, Germany');
    expect(routeDetailsCard).toHaveTextContent('1100 km');
    expect(routeDetailsCard).toHaveTextContent('8 days');
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$79');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('17 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Diesel');

    // Check for Segment 3
    expect(routeDetailsCard).toHaveTextContent('Berlin, Germany → Warsaw, Poland');
    expect(routeDetailsCard).toHaveTextContent('500 km');
    expect(routeDetailsCard).toHaveTextContent('6 days');
    expect(routeDetailsCard).toHaveTextContent('Cost Range:');
    expect(routeDetailsCard).toHaveTextContent('$59');
    expect(routeDetailsCard).toHaveTextContent('Emissions:');
    expect(routeDetailsCard).toHaveTextContent('8 kg');
    expect(routeDetailsCard).toHaveTextContent('Fuel Type:');
    expect(routeDetailsCard).toHaveTextContent('Diesel');
  })
});
