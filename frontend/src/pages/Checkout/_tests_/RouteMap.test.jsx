import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import RouteDetails from '@/components/RouteDetails';
import RouteMap from '../../../components/RouteMap';
import { prettyDOM } from '@testing-library/react'

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
            fuel_types: ["Bio Fuel", "Jet Fuel"],
            fromGeoLocation: [40.7128, -74.006],
            toGeoLocation: [40.4168, -3.7038],
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
            fuel_types: ["Electric (Renewable)", "Jet Fuel"],
            fromGeoLocation: [40.4168, -3.7038],
            toGeoLocation: [52.52, 13.405],
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
            fuel_types: ["Diesel", "Jet Fuel"],
            fromGeoLocation: [52.52, 13.405],
            toGeoLocation: [52.2297, 21.0122],
        },
    ],
};

vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => <div>TileLayer</div>,
    Polyline: () => <div>Polyline</div>,
    Marker: () => <div>Marker</div>,
    Popup: ({ children }) => <div>{children}</div>,
    useMap: () => ({
        addLayer: vi.fn(),
        removeLayer: vi.fn(),
    }),
}));

describe("Route Map", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a map', () => {
        render(<RouteMap route={mockRoute} />)
        console.log(prettyDOM(undefined, Infinity))
    })
})

