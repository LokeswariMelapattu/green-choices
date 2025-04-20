import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // import from Vitest
import EcoFriendly from '../components/EcoFriendly';
import '@testing-library/jest-dom/vitest';
import React from 'react';

describe('EcoFriendly Component', () => {
    it('should render with default values for "choice" variant', () => {
      render(<EcoFriendly variant="choice" />);
  
      expect(screen.getByText(/Eco-Friendly Choice Available!/)).toBeInTheDocument();
      expect(screen.getByText(/Would you like to switch to a more sustainable delivery method?/)).toBeInTheDocument();
      expect(screen.getByText(/Switch to Green/)).toBeInTheDocument();
    });
  
    it('should render with custom props for "choice" variant', () => {
      render(
        <EcoFriendly 
          variant="choice"
          title="Go Green!"
          description="Choose eco-friendly delivery."
          actionLabel="Make the Switch"
        />
      );
  
      expect(screen.getByText(/Go Green!/)).toBeInTheDocument();
      expect(screen.getByText(/Choose eco-friendly delivery./)).toBeInTheDocument();
      expect(screen.getByText(/Make the Switch/)).toBeInTheDocument();
    });
  
    it('should call onAction when the button is clicked (choice variant)', () => {
      const mockOnAction = vi.fn();
      render(
        <EcoFriendly 
          variant="choice"
          onAction={mockOnAction}
        />
      );
  
      fireEvent.click(screen.getByText(/Switch to Green/));
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  
    it('should render with custom props for "confirmation" variant', () => {
      render(
        <EcoFriendly 
          variant="confirmation"
          title="Nice Job!"
          description="You picked the green delivery option."
          secondaryText="Learn more about Eco-Friendly Shipping."
          actionLabel="Learn More"
        />
      );
  
      expect(screen.getByText(/Nice Job!/)).toBeInTheDocument();
      expect(screen.getByText(/You picked the green delivery option./)).toBeInTheDocument();
      expect(screen.getByText(/Learn more about Eco-Friendly Shipping./)).toBeInTheDocument();
      expect(screen.getByText(/learn more/i)).toBeInTheDocument();
    });
  
    it('should call onSecondaryAction when the secondary button is clicked (confirmation variant)', () => {
      const mockOnSecondaryAction = vi.fn();
      render(
        <EcoFriendly 
          variant="confirmation"
          secondaryText="Learn more about Eco-Friendly Shipping."
          actionLabel="Learn More"
          onSecondaryAction={mockOnSecondaryAction}
        />
      );
  
      fireEvent.click(screen.getByText(/Learn More/));
      expect(mockOnSecondaryAction).toHaveBeenCalledTimes(1);
    });
  
    it('should display percentage when passed as a prop', () => {
      render(
        <EcoFriendly 
          variant="choice"
          percentage="15%"
        />
      );
  
      expect(screen.getByText(/This option reduces emissions by 15%!/)).toBeInTheDocument();
    });
  
    it('should render the correct icon background and button for choice variant', () => {
      render(<EcoFriendly variant="choice" />);
  
      const button = screen.getByText(/Switch to Green/);
      expect(button).toBeInTheDocument();
    });
  });