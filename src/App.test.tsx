import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  CircleMarker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

test('renders navbar brand', () => {
  render(<App />);
  const title = screen.getByText(/lạc lối ở ulis/i);
  expect(title).toBeInTheDocument();
});
