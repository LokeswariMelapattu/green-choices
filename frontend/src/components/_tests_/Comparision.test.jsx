import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom/vitest";
import Comparision from '../Comparision';

// Proper mock setup with importOriginal
vi.mock('../../hooks/useRoutes', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        default: vi.fn(() => ({
            totalEmissions: [],
            route: null,
            selectedRoute: null,
            setSelectedRoute: vi.fn(),
        })),
    };
});

describe('Comparision Component', () => {
    beforeEach(async () => {
        // Reset all mocks before each test
        const useRoutes = (await import('../../hooks/useRoutes')).default;
        useRoutes.mockClear();
        cleanup();
    });

    it('renders nothing when totalEmissions is empty', async () => {
        const { container } = render(<Comparision />);
        expect(container.querySelectorAll('.mb-4')).toHaveLength(0);
    });

    it('renders correct number of route emissions', async () => {
        const useRoutes = (await import('../../hooks/useRoutes')).default;
        const mockEmissions = [
            { name: '1', minTotalEmissions: 200 },
            { name: '2', minTotalEmissions: 400 },
        ];

        useRoutes.mockImplementation(() => ({
            totalEmissions: mockEmissions,
        }));

        render(<Comparision />);
        const routeElements = screen.getAllByText(/Route \d/);
        expect(routeElements).toHaveLength(2);
    });

    it('formats emission values correctly', async () => {
        const useRoutes = (await import('../../hooks/useRoutes')).default;
        useRoutes.mockImplementation(() => ({
            totalEmissions: [{ name: '1', minTotalEmissions: 200.123 }],
        }));

        render(<Comparision />);
        expect(screen.getByText(/200\.12\s*kgCO₂/)).toBeInTheDocument();
    });


    it.each([
        [200, 'bg-green-500'],
        [400, 'bg-orange-500'],
        [700, 'bg-red-500'],
    ])('applies correct color for %i kgCO₂', async (value, expectedClass) => {
        const useRoutes = (await import('../../hooks/useRoutes')).default;
        useRoutes.mockImplementation(() => ({
            totalEmissions: [{ name: '1', minTotalEmissions: value }],
        }));

        const { container } = render(<Comparision />);
        await waitFor(() => {
            // Target the ACTUAL progress bar (child element)
            const progressBar = container.querySelector(
                '.w-full.bg-gray-200 > .h-2.rounded-full'
            );
            expect(progressBar).toHaveClass(expectedClass);
        });
    });
});