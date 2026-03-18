import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBooking } from '../../../app/utils/useBooking';

// Mock $fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('useBooking Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('postNewBooking', () => {
    it('should successfully post a new booking', async () => {
      const mockResponse = {
        success: true,
        bookingId: '12345',
        message: 'Booking created successfully',
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { postNewBooking } = useBooking();
      const mockForm = {
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+36301234567',
        },
        departureLocation: { city: 'Budapest', isAirport: false },
        destinationLocation: { city: 'Vienna', isAirport: true },
      };

      const result = await postNewBooking(mockForm);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/api', {
        method: 'POST',
        body: mockForm,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors gracefully', async () => {
      const mockError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(mockError);

      const { postNewBooking } = useBooking();
      const mockForm = { customer: { fullName: 'Test' } };

      await expect(postNewBooking(mockForm)).rejects.toThrow('Network error');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle 400 Bad Request errors', async () => {
      const mockError: any = new Error('Bad Request');
      mockError.statusCode = 400;
      mockFetch.mockRejectedValueOnce(mockError);

      const { postNewBooking } = useBooking();
      const mockForm = { customer: { email: 'invalid-email' } };

      await expect(postNewBooking(mockForm)).rejects.toThrow('Bad Request');
    });

    it('should handle 500 Internal Server Error', async () => {
      const mockError: any = new Error('Internal Server Error');
      mockError.statusCode = 500;
      mockFetch.mockRejectedValueOnce(mockError);

      const { postNewBooking } = useBooking();
      const mockForm = { customer: { fullName: 'Test' } };

      await expect(postNewBooking(mockForm)).rejects.toThrow('Internal Server Error');
    });

    it('should post complete booking form with all fields', async () => {
      const mockResponse = { success: true, bookingId: '67890' };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const { postNewBooking } = useBooking();
      const completeForm = {
        customer: {
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+36209876543',
          companyLocation: {
            city: 'Budapest',
            street: 'Andrassy ut 1',
            zipCode: '1061',
          },
        },
        homeAddress: { city: 'Budapest', street: 'Deak ter', zipCode: '1052', isAirport: false },
        passengerCount: 3,
        departureLocation: { city: 'Budapest', street: '', zipCode: '', isAirport: true },
        departureDateTime: { date: '2026-04-15', time: '10:30' },
        destinationLocation: { city: 'Vienna', street: 'Main St', zipCode: '1010', isAirport: false },
        returnInfo: {
          isReturn: true,
          returnDateTime: { date: '2026-04-20', time: '15:00' },
        },
        flightInfo: {
          outboundFlightNumber: 'FR1234',
          returnFlightNumber: 'FR5678',
        },
        comment: 'Please bring child seat',
      };

      const result = await postNewBooking(completeForm);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/api', {
        method: 'POST',
        body: completeForm,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      const { postNewBooking } = useBooking();
      const mockForm = { customer: { fullName: 'Test' } };

      await expect(postNewBooking(mockForm)).rejects.toThrow('Request timeout');
    });
  });

  describe('getAllBooking', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should successfully fetch all bookings', async () => {
      const mockBookings = [
        {
          id: '1',
          customer: { fullName: 'John Doe', email: 'john@example.com' },
          departureLocation: { city: 'Budapest' },
        },
        {
          id: '2',
          customer: { fullName: 'Jane Smith', email: 'jane@example.com' },
          departureLocation: { city: 'Vienna' },
        },
      ];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const { getAllBooking } = useBooking();
      const result = await getAllBooking();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3002/api');
      expect(result).toEqual(mockBookings);
    });

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { getAllBooking } = useBooking();

      await expect(getAllBooking()).rejects.toThrow('Failed to fetch bookings');
    });

    it('should handle network errors for getAllBooking', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const { getAllBooking } = useBooking();

      await expect(getAllBooking()).rejects.toThrow('Network error');
    });

    it('should fetch empty array of bookings', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const { getAllBooking } = useBooking();
      const result = await getAllBooking();

      expect(result).toEqual([]);
    });

    it('should handle 404 Not Found error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { getAllBooking } = useBooking();

      await expect(getAllBooking()).rejects.toThrow('Failed to fetch bookings');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { getAllBooking } = useBooking();

      await expect(getAllBooking()).rejects.toThrow('Invalid JSON');
    });

    it('should handle null form data in postNewBooking', async () => {
      mockFetch.mockResolvedValueOnce({ success: true });

      const { postNewBooking } = useBooking();

      await postNewBooking(null);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/api', {
        method: 'POST',
        body: null,
      });
    });

    it('should handle undefined form data in postNewBooking', async () => {
      mockFetch.mockResolvedValueOnce({ success: true });

      const { postNewBooking } = useBooking();

      await postNewBooking(undefined);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/api', {
        method: 'POST',
        body: undefined,
      });
    });
  });
});
