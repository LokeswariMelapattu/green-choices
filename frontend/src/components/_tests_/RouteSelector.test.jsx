import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import RouteSelector from "../RouteSelector";

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
    }
  ];

  it("should select the first delivery option by default", () => {
    render(<RouteSelector routes={mockRoutes} selectedRoute={mockRoutes[0]} onRouteSelect={() => {}} />);

    // Find the route name inside the card
    const routeText = screen.getByText("Route A1");

    // Traversing up until we find the div with a class "border-green-500 bg-green-50" used for the selected route
    let routeCard = routeText;
    while (routeCard && !routeCard.className.includes("border-green-500")) {
      routeCard = routeCard.parentElement;
    }

    expect(routeCard).toHaveClass("border-green-500 bg-green-50");
  });
});
