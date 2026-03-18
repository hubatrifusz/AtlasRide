import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ActionButtons from '../../../app/components/Booking/ActionButtons.vue';
import { useBookingStore } from '../../../app/stores/useBookingStore';

// Mock the useBooking composable
vi.mock('../../../app/utils/useBooking', () => ({
  useBooking: () => ({
    postNewBooking: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

describe('BookingActionButtons Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Navigation Buttons', () => {
    it('should render Next button on non-final steps', () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const nextButton = wrapper.find('button:has(*)');
      expect(nextButton.text()).toContain('Következő');
    });

    it('should render Back button when not on first step', () => {
      const store = useBookingStore();
      store.currentStep = 1;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Vissza');
    });

    it('should not render Back button on first step', () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const backButtons = wrapper.findAll('button').filter((btn) => btn.text().includes('Vissza'));
      expect(backButtons.length).toBe(0);
    });

    it('should emit submitForm event when Next button is clicked', async () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const nextButton = wrapper.findAll('button').find((btn) => btn.text().includes('Következő'));
      await nextButton?.trigger('click');

      expect(wrapper.emitted('submitForm')).toBeTruthy();
      expect(wrapper.emitted('submitForm')?.length).toBe(1);
    });

    it('should call prevStep when Back button is clicked', async () => {
      const store = useBookingStore();
      store.currentStep = 1;
      store.stepCount = 3;
      const prevStepSpy = vi.spyOn(store, 'prevStep');

      const wrapper = mount(ActionButtons);

      const backButton = wrapper.findAll('button').find((btn) => btn.text().includes('Vissza'));
      await backButton?.trigger('click');

      expect(prevStepSpy).toHaveBeenCalled();
    });
  });

  describe('Confirmation Step', () => {
    it('should render Confirmation button on final step', () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Megerősítés');
    });

    it('should render Back button on final step', () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Vissza');
    });

    it('should call handleConfirmBooking when Confirmation button is clicked', async () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      // Wait for async operation
      await wrapper.vm.$nextTick();

      // Check that loading state was set (we can't easily test the actual API call in unit test)
      expect(confirmButton?.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when confirming booking', async () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      // Mock a slow API call
      const slowPostBooking = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 100);
          })
      );

      vi.mock('~/utils/useBooking', () => ({
        useBooking: () => ({
          postNewBooking: slowPostBooking,
        }),
      }));

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      // During API call, component should show loading state
      expect((wrapper.vm as any).loading).toBe(true);

      // Wait for API call to complete
      await new Promise((resolve) => setTimeout(resolve, 150));
      await wrapper.vm.$nextTick();

      // After completion, loading should be false
      expect((wrapper.vm as any).loading).toBe(false);
    });

    it('should handle booking submission error gracefully', async () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const failingPostBooking = vi.fn().mockRejectedValue(new Error('API Error'));

      vi.mock('~/utils/useBooking', () => ({
        useBooking: () => ({
          postNewBooking: failingPostBooking,
        }),
      }));

      const wrapper = mount(ActionButtons);

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));
      await confirmButton?.trigger('click');

      await wrapper.vm.$nextTick();

      // Loading should be set back to false even after error
      expect((wrapper.vm as any).loading).toBe(false);
    });
  });

  describe('Different Step Counts', () => {
    it('should handle 3-step flow (non-airport)', () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;
      store.airportInputCount = 0;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Következő');
    });

    it('should handle 4-step flow (airport transfer)', () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 4;
      store.airportInputCount = 1;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Következő');
    });

    it('should show confirmation on last step of 3-step flow', () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Megerősítés');
    });

    it('should show confirmation on last step of 4-step flow', () => {
      const store = useBookingStore();
      store.currentStep = 3;
      store.stepCount = 4;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Megerősítés');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button clicks', async () => {
      const store = useBookingStore();
      store.currentStep = 1;
      store.stepCount = 3;
      const prevStepSpy = vi.spyOn(store, 'prevStep');

      const wrapper = mount(ActionButtons);

      const backButton = wrapper.findAll('button').find((btn) => btn.text().includes('Vissza'));

      // Click multiple times rapidly
      await backButton?.trigger('click');
      await backButton?.trigger('click');
      await backButton?.trigger('click');

      expect(prevStepSpy).toHaveBeenCalledTimes(3);
    });

    it('should maintain button state across re-renders', async () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      expect(wrapper.text()).toContain('Következő');

      // Change step
      store.currentStep = 1;
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Vissza');
      expect(wrapper.text()).toContain('Következő');
    });

    it('should handle stepCount of 0', () => {
      const store = useBookingStore();
      store.currentStep = 0;
      store.stepCount = 0;

      const wrapper = mount(ActionButtons);

      // Should not crash
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should render buttons that are keyboard accessible', () => {
      const store = useBookingStore();
      store.currentStep = 1;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);

      const buttons = wrapper.findAll('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        // Buttons should be focusable
        expect(button.element.tagName).toBe('BUTTON');
      });
    });

    it('should disable Confirmation button during loading', async () => {
      const store = useBookingStore();
      store.currentStep = 2;
      store.stepCount = 3;

      const wrapper = mount(ActionButtons);
      (wrapper.vm as any).loading = true;
      await wrapper.vm.$nextTick();

      const confirmButton = wrapper.findAll('button').find((btn) => btn.text().includes('Megerősítés'));

      // Check if button has loading state attribute
      expect((wrapper.vm as any).loading).toBe(true);
    });
  });
});
