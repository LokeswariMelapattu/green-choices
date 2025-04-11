import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import RouteSelector from "@/components/RouteSelector";

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
});
