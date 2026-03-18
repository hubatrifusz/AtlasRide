import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '../../../app/stores/useBookingStore';

describe('useBookingStore - Enhanced Unit Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial State', () => {
    it('should initialize with default form values', () => {
      const store = useBookingStore();

      expect(store.form).toEqual({
        customer: {
          fullName: '',
          email: '',
          phone: '',
          companyLocation: { city: '', street: '', zipCode: '' },
        },
        homeAddress: { city: '', street: '', zipCode: '', isAirport: false },
        passengerCount: 1,
        departureLocation: { city: '', street: '', zipCode: '', isAirport: false },
        departureDateTime: { date: undefined, time: undefined },
        destinationLocation: { city: '', street: '', zipCode: '', isAirport: false },
        returnInfo: { isReturn: false },
        flightInfo: { outboundFlightNumber: '', returnFlightNumber: '' },
        comment: '',
      });
    });

    it('should initialize with currentStep at 0', () => {
      const store = useBookingStore();
      expect(store.currentStep).toBe(0);
    });

    it('should initialize with stepCount at 0', () => {
      const store = useBookingStore();
      expect(store.stepCount).toBe(0);
    });

    it('should initialize with airportInputCount at 0', () => {
      const store = useBookingStore();
      expect(store.airportInputCount).toBe(0);
    });

    it('should initialize isAirportTransfer as false', () => {
      const store = useBookingStore();
      expect(store.isAirportTransfer).toBe(false);
    });
  });

  describe('Step Navigation', () => {
    it('should increment currentStep when nextStep is called', () => {
      const store = useBookingStore();
      store.stepCount = 4;
      store.nextStep();

      expect(store.currentStep).toBe(1);
    });

    it('should not increment currentStep beyond stepCount', () => {
      const store = useBookingStore();
      store.stepCount = 3;
      store.currentStep = 3;

      store.nextStep();

      expect(store.currentStep).toBe(3);
    });

    it('should decrement currentStep when prevStep is called', () => {
      const store = useBookingStore();
      store.currentStep = 2;

      store.prevStep();

      expect(store.currentStep).toBe(1);
    });

    it('should not decrement currentStep below 0', () => {
      const store = useBookingStore();
      store.currentStep = 0;

      store.prevStep();

      expect(store.currentStep).toBe(0);
    });

    it('should allow navigation through multiple steps', () => {
      const store = useBookingStore();
      store.stepCount = 5;

      store.nextStep();
      store.nextStep();
      expect(store.currentStep).toBe(2);

      store.prevStep();
      expect(store.currentStep).toBe(1);

      store.nextStep();
      store.nextStep();
      store.nextStep();
      expect(store.currentStep).toBe(4);
    });
  });

  describe('Airport Transfer Detection', () => {
    it('should detect airport transfer when airportInputCount is greater than 0', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      expect(store.isAirportTransfer).toBe(true);
    });

    it('should not be airport transfer when airportInputCount is 0', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      expect(store.isAirportTransfer).toBe(false);
    });

    it('should update isAirportTransfer when airportInputCount changes', () => {
      const store = useBookingStore();

      expect(store.isAirportTransfer).toBe(false);

      store.airportInputCount = 2;
      expect(store.isAirportTransfer).toBe(true);

      store.airportInputCount = 0;
      expect(store.isAirportTransfer).toBe(false);
    });
  });

  describe('Form Data Management', () => {
    it('should allow updating customer information', () => {
      const store = useBookingStore();

      store.form.customer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+36301234567',
        companyLocation: { city: 'Budapest', street: 'Main St 1', zipCode: '1234' },
      };

      expect(store.form.customer.fullName).toBe('John Doe');
      expect(store.form.customer.email).toBe('john@example.com');
    });

    it('should allow updating departure location with airport flag', () => {
      const store = useBookingStore();

      store.form.departureLocation = {
        city: 'Budapest',
        street: '',
        zipCode: '',
        isAirport: true,
      };

      expect(store.form.departureLocation.city).toBe('Budapest');
      expect(store.form.departureLocation.isAirport).toBe(true);
    });

    it('should allow updating destination location', () => {
      const store = useBookingStore();

      store.form.destinationLocation = {
        city: 'Vienna',
        street: 'Airport Road',
        zipCode: '1000',
        isAirport: true,
      };

      expect(store.form.destinationLocation.city).toBe('Vienna');
      expect(store.form.destinationLocation.isAirport).toBe(true);
    });

    it('should allow updating passenger count', () => {
      const store = useBookingStore();

      store.form.passengerCount = 4;

      expect(store.form.passengerCount).toBe(4);
    });

    it('should allow adding return trip information', () => {
      const store = useBookingStore();

      store.form.returnInfo = {
        isReturn: true,
        returnDateTime: { date: undefined, time: undefined },
      };

      expect(store.form.returnInfo.isReturn).toBe(true);
    });

    it('should allow updating comment', () => {
      const store = useBookingStore();

      store.form.comment = 'Please bring child seat';

      expect(store.form.comment).toBe('Please bring child seat');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid step navigation', () => {
      const store = useBookingStore();
      store.stepCount = 3;

      for (let i = 0; i < 10; i++) {
        store.nextStep();
      }

      expect(store.currentStep).toBe(3);
    });

    it('should handle negative step counts gracefully', () => {
      const store = useBookingStore();
      store.stepCount = -1;
      store.nextStep();

      // Should not crash and should not increment
      expect(store.currentStep).toBe(0);
    });

    it('should maintain form data integrity after multiple step changes', () => {
      const store = useBookingStore();
      store.stepCount = 4;

      store.form.customer.fullName = 'Test User';

      store.nextStep();
      store.nextStep();
      store.prevStep();

      expect(store.form.customer.fullName).toBe('Test User');
    });
  });
});
