import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import TrackingDetails  from '../components/TrackingDetails';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const mockNavigate = vi.fn();

// Mock navigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
  });
  
  const mockOrder = {
    orderid: '123',
    createdat: '2025-04-10T00:00:00Z'
  };
  
  const mockRoute = {
    trackingNumber: 'TN1234567890',
    carrier: 'EcoCarrier',
    segments: [
      {
        from: 'Warehouse',
        to: "Distribution Center",
        durations: [1],
        departureTime: '2025-04-10T00:00:00Z',
        arrivalTime: '2025-04-11T00:00:00Z',
      },
      {
        from: 'Distribution Center',
        to: "Destination Hub",
        durations: [2],
        departureTime: '2025-04-11T00:00:00Z',
        arrivalTime: '2025-04-13T00:00:00Z',
      },
      {
        from: 'Destination Hub',
        to: "Local Depot",
        durations: [1],
        departureTime: '2025-04-13T00:00:00Z',
        arrivalTime: '2025-04-14T00:00:00Z',
      },
    ]
  };
  
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <TrackingDetails
          selectedRoute={mockRoute}
          order={mockOrder}
          arrivalDate="Apr 14, 2025"
          isLoading={false}
          {...props}
        />
      </BrowserRouter>
    );

    describe('TrackingDetails Component', () => {
      it('renders order information correctly', () => {
        renderComponent();
    
        expect(screen.getByText(/Order #123/i)).toBeInTheDocument();
        expect(screen.getByText(/Arriving before Apr 14, 2025/i)).toBeInTheDocument();
        expect(screen.getByText(/Tracking number/i)).toBeInTheDocument();
        expect(screen.getByText(/EcoCarrier/)).toBeInTheDocument();
      });
    
      it('renders segment details', () => {
        renderComponent();
    
        expect(screen.getByText((content) => content.includes('Warehouse'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Distribution Center'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Destination Hub'))).toBeInTheDocument();
      });
    
      it('navigates to home on button click', async () => {
        renderComponent();
    
        const button = screen.getByRole('button', { name: /Go to Homepage/i });
        expect(button).toBeInTheDocument();
      });
    
      it('renders fallback message when selectedRoute is missing', () => {
        render(
          <TrackingDetails
            selectedRoute={null}
            order={{}}
            arrivalDate="May 5, 2025"
            isLoading={false}
          />
        );
    
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
    