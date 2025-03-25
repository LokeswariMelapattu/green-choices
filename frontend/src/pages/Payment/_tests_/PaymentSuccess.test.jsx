import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentSuccess from "../components/PaymentSuccess";
import "@testing-library/jest-dom";

// ✅ Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PaymentSuccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the success message correctly", () => {
    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText("Payment Was")).toBeInTheDocument(); // ✅ Works now!
    expect(screen.getByText("Successful")).toBeInTheDocument();
    expect(screen.getByText("!")).toBeInTheDocument();
  });

  it("renders the action buttons", () => {
    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText("Go to Homepage")).toBeInTheDocument(); // ✅ Works now!
    expect(screen.getByText("Track your Order")).toBeInTheDocument();
  });

  it("calls the correct handlers when buttons are clicked", () => {
    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Go to Homepage"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");

    const consoleSpy = vi.spyOn(console, "log");
    fireEvent.click(screen.getByText("Track your Order"));
    expect(consoleSpy).toHaveBeenCalledWith("Navigating to order tracking");

    consoleSpy.mockRestore();
  });
});
