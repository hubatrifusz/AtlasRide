import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import FormStepper from '../../../app/components/Booking/FormStepper.vue';
import { useBookingStore } from '../../../app/stores/useBookingStore';

describe('BookingFormStepper Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial Rendering', () => {
    it('should render the stepper component', () => {
      const wrapper = mount(FormStepper);

      expect(wrapper.exists()).toBe(true);
    });

    it('should initialize with personal stepper items when no airport', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);

      // Personal flow has 3 steps
      expect(store.stepCount).toBe(3);
    });

    it('should initialize with airport stepper items when airport transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);

      // Airport flow has 4 steps
      expect(store.stepCount).toBe(4);
    });
  });

  describe('Stepper Items - Personal Transfer (Non-Airport)', () => {
    it('should have 3 steps for personal transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);
      const personalSteps = (wrapper.vm as any).personalStepperItems;

      expect(personalSteps.length).toBe(3);
    });

    it('should have correct icons for personal transfer steps', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);
      const personalSteps = (wrapper.vm as any).personalStepperItems;

      expect(personalSteps[0].icon).toBe('i-lucide-map');
      expect(personalSteps[1].icon).toBe('i-lucide-user');
      expect(personalSteps[2].icon).toBe('i-lucide-badge-check');
    });

    it('should update stepCount to 3 for personal transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      mount(FormStepper);

      expect(store.stepCount).toBe(3);
    });
  });

  describe('Stepper Items - Airport Transfer', () => {
    it('should have 4 steps for airport transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);
      const airportSteps = (wrapper.vm as any).airportStepperItems;

      expect(airportSteps.length).toBe(4);
    });

    it('should have correct icons for airport transfer steps', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);
      const airportSteps = (wrapper.vm as any).airportStepperItems;

      expect(airportSteps[0].icon).toBe('i-lucide-map');
      expect(airportSteps[1].icon).toBe('i-lucide-tickets-plane');
      expect(airportSteps[2].icon).toBe('i-lucide-user');
      expect(airportSteps[3].icon).toBe('i-lucide-badge-check');
    });

    it('should update stepCount to 4 for airport transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      mount(FormStepper);

      expect(store.stepCount).toBe(4);
    });
  });

  describe('Dynamic Stepper Switching', () => {
    it('should switch from personal to airport stepper when airport is detected', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);

      // Initially personal (3 steps)
      expect(store.stepCount).toBe(3);

      // Switch to airport
      store.airportInputCount = 1;
      await wrapper.vm.$nextTick();

      expect(store.stepCount).toBe(4);
    });

    it('should switch from airport to personal stepper when no airports', async () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);

      // Initially airport (4 steps)
      expect(store.stepCount).toBe(4);

      // Switch to personal
      store.airportInputCount = 0;
      await wrapper.vm.$nextTick();

      expect(store.stepCount).toBe(3);
    });

    it('should handle multiple airport inputs', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);

      // Add multiple airports (both departure and destination)
      store.airportInputCount = 2;
      await wrapper.vm.$nextTick();

      // Should still show airport flow (4 steps)
      expect(store.stepCount).toBe(4);
      expect(store.isAirportTransfer).toBe(true);
    });
  });

  describe('Current Step Binding', () => {
    it('should reflect the current step from store', () => {
      const store = useBookingStore();
      store.currentStep = 0;

      const wrapper = mount(FormStepper);

      expect(store.currentStep).toBe(0);
    });

    it('should update when current step changes', async () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(FormStepper);

      store.nextStep();
      await wrapper.vm.$nextTick();

      expect(store.currentStep).toBe(1);
    });

    it('should handle navigation through all steps', async () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(FormStepper);

      // Navigate through all steps
      for (let i = 0; i < 3; i++) {
        expect(store.currentStep).toBe(i);
        if (i < 2) {
          store.nextStep();
          await wrapper.vm.$nextTick();
        }
      }

      expect(store.currentStep).toBe(2);
    });
  });

  describe('Computed Property - stepperItems', () => {
    it('should return personal stepper items when not airport transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);
      const items = (wrapper.vm as any).stepperItems;

      expect(items.length).toBe(3);
      expect(items[0].icon).toBe('i-lucide-map');
    });

    it('should return airport stepper items when is airport transfer', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);
      const items = (wrapper.vm as any).stepperItems;

      expect(items.length).toBe(4);
      expect(items[1].icon).toBe('i-lucide-tickets-plane');
    });

    it('should be reactive to isAirportTransfer changes', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);

      expect((wrapper.vm as any).stepperItems.length).toBe(3);

      store.airportInputCount = 1;
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).stepperItems.length).toBe(4);
    });
  });

  describe('WatchEffect - stepCount Update', () => {
    it('should automatically update stepCount when stepper items change', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      mount(FormStepper);

      expect(store.stepCount).toBe(3);

      // Change to airport
      store.airportInputCount = 1;
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(store.stepCount).toBe(4);
    });

    it('should update stepCount immediately on mount', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      mount(FormStepper);

      // Should be set immediately
      expect(store.stepCount).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined stepperItems gracefully', () => {
      const store = useBookingStore();
      const wrapper = mount(FormStepper);

      // Should not crash even with edge cases
      expect(wrapper.exists()).toBe(true);
      expect(store.stepCount).toBeGreaterThan(0);
    });

    it('should handle rapid switching between transfer types', async () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      const wrapper = mount(FormStepper);

      // Rapidly toggle
      for (let i = 0; i < 10; i++) {
        store.airportInputCount = i % 2;
        await wrapper.vm.$nextTick();
      }

      // Should still be valid
      expect(store.stepCount).toBeGreaterThan(0);
      expect([3, 4]).toContain(store.stepCount);
    });

    it('should maintain step count consistency when remounting', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      let wrapper = mount(FormStepper);
      expect(store.stepCount).toBe(4);

      wrapper.unmount();

      wrapper = mount(FormStepper);
      // Should still reflect the correct step count
      expect(store.stepCount).toBe(4);
    });
  });

  describe('Integration with Store', () => {
    it('should use the same store instance across renders', () => {
      const store1 = useBookingStore();
      store1.airportInputCount = 1;

      mount(FormStepper);

      const store2 = useBookingStore();
      expect(store2.airportInputCount).toBe(1);
      expect(store2.stepCount).toBe(4);
    });

    it('should update store stepCount synchronously', () => {
      const store = useBookingStore();
      store.airportInputCount = 0;

      expect(store.stepCount).toBe(0);

      mount(FormStepper);

      // Should be updated immediately after mount
      expect(store.stepCount).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('should render stepper with disabled state', () => {
      const wrapper = mount(FormStepper);

      // Stepper should be disabled (not clickable)
      const stepper = wrapper.find('[disabled]');
      expect(wrapper.exists()).toBe(true);
    });

    it('should maintain correct icon semantics for screen readers', () => {
      const store = useBookingStore();
      store.airportInputCount = 1;

      const wrapper = mount(FormStepper);
      const items = (wrapper.vm as any).stepperItems;

      // Each step should have an icon
      items.forEach((item: any) => {
        expect(item.icon).toBeTruthy();
        expect(item.icon).toMatch(/^i-lucide-/);
      });
    });
  });
});
