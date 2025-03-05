import React from 'react';
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import EmissionMeter from "../EmissionsMeter";

describe("EmissionMeter Component", () => {
  it("should render the heading", () => {
    render(<EmissionMeter currentValue={0} maxValue={100} />);
    expect(screen.getByText("Carbon Emission")).toBeInTheDocument();
  });

  it("should display 'Low' label for low emission levels", () => {
    render(<EmissionMeter currentValue={10} maxValue={100} />);
    expect(screen.getByText(/Low\s*:\s*0\s*kg/)).toBeInTheDocument();
  });

  it("should display 'Moderate' label for moderate emission levels", () => {
    render(<EmissionMeter currentValue={30} maxValue={100} />);
    expect(screen.getByText("Moderate: 30 kg")).toBeInTheDocument();
  });

  it("should display 'Medium' label for medium emission levels", () => {
    render(<EmissionMeter currentValue={60} maxValue={100} />);
    expect(screen.getByText("Medium: 60 kg")).toBeInTheDocument();
  });

});
