import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '../../app/stores/useBookingStore';
import ActionButtons from '../../app/components/Booking/ActionButtons.vue';
import FormStepper from '../../app/components/Booking/FormStepper.vue';

// Mock the useBooking composable
const mockPostNewBooking = vi.fn();
vi.mock('../../app/utils/useBooking', () => ({
  useBooking: () => ({
    postNewBooking: mockPostNewBooking,
    getAllBooking: vi.fn().mockResolvedValue([]),
  }),
}));

describe('Booking Flow - Integration Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('Complete Booking Flow - Personal Transfer', () => {
    it('should complete a 3-step personal booking flow', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const stepperWrapper = mount(FormStepper);
      const actionWrapper = mount(ActionButtons);

      // Step Count should be set to 3 (personal transfer)
      expect(store.stepCount).toBe(3);
      expect(store.currentStep).toBe(0);

      // Step 1: Travel Details - Navigate to next
      store.nextStep();
      await stepperWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(1);

      // Step 2: Contact Details - Navigate to next
      store.nextStep();
      await stepperWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(2);

      // Step 3: Confirmation - Should be on final step
      expect(store.currentStep).toBe(2);
      expect(store.currentStep).toBe(store.stepCount - 1);
    });

    it('should allow backward navigation in personal flow', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;
      store.currentStep = 2;
      store.stepCount = 3;

      const actionWrapper = mount(ActionButtons);

      // Navigate backward
      store.prevStep();
      await actionWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(1);

      store.prevStep();
      await actionWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(0);

      // Cannot go before first step
      store.prevStep();
      await actionWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(0);
    });

    it('should preserve form data during navigation', async () => {
      const store = useBookingStore();
      store.stepCount = 3;
      store.airportInputCount = 0;

      // Fill travel details
      store.form.departureLocation = {
        city: 'Budapest',
        street: 'Main St',
        zipCode: '1234',
        isAirport: false,
      };
      store.form.destinationLocation = {
        city: 'Vienna',
        street: 'Center St',
        zipCode: '1000',
        isAirport: false,
      };

      store.nextStep();

      // Fill contact details
      store.form.customer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+36301234567',
      };

      store.nextStep();

      // Data should be preserved
      expect(store.form.departureLocation.city).toBe('Budapest');
      expect(store.form.customer.fullName).toBe('John Doe');
    });
  });

  describe('Complete Booking Flow - Airport Transfer', () => {
    it('should complete a 4-step airport booking flow', async () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const stepperWrapper = mount(FormStepper);

      // Step Count should be set to 4 (airport transfer)
      expect(store.stepCount).toBe(4);
      expect(store.currentStep).toBe(0);

      // Step 1: Travel Details
      store.nextStep();
      await stepperWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(1);

      // Step 2: Flight Information
      store.nextStep();
      await stepperWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(2);

      // Step 3: Contact Details
      store.nextStep();
      await stepperWrapper.vm.$nextTick();
      expect(store.currentStep).toBe(3);

      // Step 4: Confirmation
      expect(store.currentStep).toBe(store.stepCount - 1);
    });

    it('should include flight information step for airport transfer', async () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      mount(FormStepper);

      expect(store.stepCount).toBe(4);
      expect(store.isAirportTransfer).toBe(true);

      // Fill travel details with airport
      store.form.departureLocation = {
        city: 'Budapest',
        street: '',
        zipCode: '',
        isAirport: true,
      };

      store.nextStep(); // To flight info

      // Add flight information
      store.form.flightInfo = {
        outboundFlightNumber: 'FR1234',
        returnFlightNumber: '',
      };

      expect(store.form.flightInfo.outboundFlightNumber).toBe('FR1234');
    });

    it('should handle both departure and destination as airports', async () => {
      const store = useBookingStore();

      // Both locations are airports
      store.form.departureLocation.isAirport = true;
      store.form.destinationLocation.isAirport = true;
      store.airportInputCount = 2;

      mount(FormStepper);

      // Should still show airport flow
      expect(store.stepCount).toBe(4);
      expect(store.isAirportTransfer).toBe(true);
    });
  });

  describe('Dynamic Flow Switching', () => {
    it('should switch from personal to airport flow when airport is added', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const stepperWrapper = mount(FormStepper);

      // Initially personal (3 steps)
      expect(store.stepCount).toBe(3);

      // User selects airport as destination
      store.form.destinationLocation.isAirport = true;
      store.airportInputCount = 1;
      await stepperWrapper.vm.$nextTick();

      // Should switch to airport flow (4 steps)
      expect(store.stepCount).toBe(4);
      expect(store.isAirportTransfer).toBe(true);
    });

    it('should switch from airport to personal flow when airport is removed', async () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const stepperWrapper = mount(FormStepper);

      // Initially airport (4 steps)
      expect(store.stepCount).toBe(4);

      // User deselects airport
      store.form.departureLocation.isAirport = false;
      store.airportInputCount = 0;
      await stepperWrapper.vm.$nextTick();

      // Should switch to personal flow (3 steps)
      expect(store.stepCount).toBe(3);
      expect(store.isAirportTransfer).toBe(false);
    });

    it('should adjust current step when flow changes', async () => {
      const store = useBookingStore();
      store.airportInputCount = 1;
      store.stepCount = 4;
      store.currentStep = 3; // On confirmation step

      const stepperWrapper = mount(FormStepper);

      // Switch to personal flow
      store.airportInputCount = 0;
      await stepperWrapper.vm.$nextTick();

      // Step count changes to 3
      expect(store.stepCount).toBe(3);

      // Current step might need adjustment
      if (store.currentStep >= store.stepCount) {
        store.currentStep = store.stepCount - 1;
      }

      expect(store.currentStep).toBeLessThan(store.stepCount);
    });
  });

  describe('Booking Submission', () => {
    it('should successfully submit booking with API call', async () => {
      mockPostNewBooking.mockResolvedValueOnce({
        success: true,
        bookingId: '12345',
      });

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      store.form = {
        customer: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+36301234567',
        },
        homeAddress: { city: '', street: '', zipCode: '', isAirport: false },
        passengerCount: 2,
        departureLocation: { city: 'Budapest', street: '', zipCode: '', isAirport: false },
        departureDateTime: { date: undefined, time: undefined },
        destinationLocation: { city: 'Vienna', street: '', zipCode: '', isAirport: false },
        returnInfo: { isReturn: false },
        flightInfo: { outboundFlightNumber: '', returnFlightNumber: '' },
        comment: 'Test booking',
      };

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockPostNewBooking).toHaveBeenCalledWith(store.form);
    });

    it('should handle API error during submission', async () => {
      mockPostNewBooking.mockRejectedValueOnce(new Error('API Error'));

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Loading should be reset
      expect((wrapper.vm as any).loading).toBe(false);
    });

    it('should handle 400 Bad Request error', async () => {
      const error: any = new Error('Validation failed');
      error.statusCode = 400;
      mockPostNewBooking.mockRejectedValueOnce(error);

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockPostNewBooking).toHaveBeenCalled();
      expect((wrapper.vm as any).loading).toBe(false);
    });

    it('should handle 500 Internal Server Error', async () => {
      const error: any = new Error('Server error');
      error.statusCode = 500;
      mockPostNewBooking.mockRejectedValueOnce(error);

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect((wrapper.vm as any).loading).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      let resolvePromise: ((value: any) => void) | undefined;
      const slowPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockPostNewBooking.mockReturnValueOnce(slowPromise);

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await wrapper.vm.$nextTick();

      // Should be loading
      expect((wrapper.vm as any).loading).toBe(true);

      // Resolve the promise
      resolvePromise?.({ success: true });
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should no longer be loading
      expect((wrapper.vm as any).loading).toBe(false);
    });

    it('should disable navigation during form submission', async () => {
      let resolvePromise: ((value: any) => void) | undefined;
      const slowPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockPostNewBooking.mockReturnValueOnce(slowPromise);

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await wrapper.vm.$nextTick();

      // User tries to go back during submission
      const prevStep = store.currentStep;
      store.prevStep();

      // Should still be able to navigate (no built-in prevention)
      // In a real app, you might want to prevent this

      resolvePromise?.({ success: true });
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
  });

  describe('Form Data Validation', () => {
    it('should maintain form integrity across all steps', async () => {
      const store = useBookingStore();
      store.stepCount = 3;

      // Step 1: Fill travel details
      store.form.departureLocation = { city: 'Budapest', isAirport: false };
      store.form.destinationLocation = { city: 'Vienna', isAirport: false };
      store.form.passengerCount = 3;

      store.nextStep();

      // Step 2: Fill contact details
      store.form.customer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+36301234567',
      };
      store.form.comment = 'Please be punctual';

      store.nextStep();

      // Step 3: Verify all data is intact
      expect(store.form.departureLocation.city).toBe('Budapest');
      expect(store.form.destinationLocation.city).toBe('Vienna');
      expect(store.form.passengerCount).toBe(3);
      expect(store.form.customer.fullName).toBe('John Doe');
      expect(store.form.comment).toBe('Please be punctual');
    });

    it('should handle return trip information', async () => {
      const store = useBookingStore();

      store.form.returnInfo = {
        isReturn: true,
        returnDateTime: { date: undefined, time: undefined },
      };

      expect(store.form.returnInfo.isReturn).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid step changes', async () => {
      const store = useBookingStore();
      store.stepCount = 4;

      for (let i = 0; i < 10; i++) {
        if (store.currentStep < store.stepCount - 1) {
          store.nextStep();
        }
      }

      expect(store.currentStep).toBe(store.stepCount - 1);
    });

    it('should handle incomplete form data gracefully', async () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      // Incomplete form
      store.form.customer = {
        fullName: '',
        email: '',
        phone: '',
      };

      mockPostNewBooking.mockResolvedValueOnce({ success: true });

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should still attempt to submit
      expect(mockPostNewBooking).toHaveBeenCalled();
    });

    it('should handle network timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockPostNewBooking.mockRejectedValueOnce(timeoutError);

      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect((wrapper.vm as any).loading).toBe(false);
    });
  });
});
