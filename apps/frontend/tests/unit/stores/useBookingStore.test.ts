import { expect, it, describe, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '~/stores/useBookingStore';

describe('Stepper buttons', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with currentStep at 0', () => {
    const store = useBookingStore();

    expect(store.currentStep).toBe(0);
  });

  it('should increment currentStep when nextStep is called', () => {
    const store = useBookingStore();
    store.nextStep();

    expect(store.currentStep).toBe(0);
  });

  it('should not increment currentStep beyond the stepCount limit', () => {
    const store = useBookingStore();

    store.stepCount = 4;
    store.currentStep = 4;

    store.nextStep();

    expect(store.currentStep).toBe(4);
  });

  it('should decrement currentStep when prevStep is called', () => {
    const store = useBookingStore();

    store.stepCount = 3;
    store.currentStep = 2;

    store.prevStep();

    expect(store.currentStep).toBe(1);
  });

  it('should not decrement currentStep when at first step', () => {
    const store = useBookingStore();

    store.stepCount = 4;

    store.prevStep();

    expect(store.currentStep).toBe(0);
  });
});

describe('Airport boolean', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should be true when airportInputCount is greater than 0', () => {
    const store = useBookingStore();

    store.airportInputCount = 5;

    expect(store.isAirportTransfer).toBe(true);
  });

  it('should be false when airportInputCount is 0', () => {
    const store = useBookingStore();

    store.airportInputCount = 0;

    expect(store.isAirportTransfer).toBe(false);
  });
});
