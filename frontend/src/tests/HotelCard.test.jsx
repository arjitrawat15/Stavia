import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HotelCard from '../components/HotelCard';

// Mock the image config
vi.mock('../config/images', () => ({
  IMAGES: {
    HOTEL1_IMAGE: '/test-image.jpg',
    HOTEL2_IMAGE: '/test-image.jpg',
    HOTEL3_IMAGE: '/test-image.jpg',
  },
  getImage: (key, fallback) => fallback || '/test-image.jpg',
}));

const mockHotel = {
  id: 1,
  name: 'Test Hotel',
  city: 'Test City',
  rating: 4.5,
  pricePerNight: 199,
  heroImage: '/test-image.jpg',
  tags: ['Luxury', 'Spa'],
  isTopPick: false,
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HotelCard', () => {
  it('renders hotel name', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
  });

  it('renders hotel city', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText('Test City')).toBeInTheDocument();
  });

  it('renders price per night', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText('$199')).toBeInTheDocument();
    expect(screen.getByText('/night')).toBeInTheDocument();
  });

  it('renders "Select Hotel" CTA button', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    const ctaButton = screen.getByRole('link', { name: /select hotel/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/hotels/1');
  });

  it('renders hotel tags', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('Spa')).toBeInTheDocument();
  });

  it('does not render "Free Parking" tag', () => {
    const hotelWithFreeParking = {
      ...mockHotel,
      tags: ['Luxury', 'Free Parking', 'Spa'],
    };
    renderWithRouter(<HotelCard hotel={hotelWithFreeParking} />);
    expect(screen.queryByText('Free Parking')).not.toBeInTheDocument();
  });

  it('renders "Top Pick" badge when isTopPick is true', () => {
    const topPickHotel = { ...mockHotel, isTopPick: true };
    renderWithRouter(<HotelCard hotel={topPickHotel} />);
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
  });

  it('renders rating stars', () => {
    renderWithRouter(<HotelCard hotel={mockHotel} />);
    // Check that rating is displayed
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
});

