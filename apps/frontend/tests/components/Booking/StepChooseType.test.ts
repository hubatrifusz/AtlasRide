import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import StepChooseType from '../../../app/components/Booking/StepChooseType.vue';

describe('Tests for choosing ride type', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(StepChooseType);
  });

  it('renders all 3 ride type options', () => {
    expect(wrapper.text()).toContain('Céges');
    expect(wrapper.text()).toContain('Reptéri');
    expect(wrapper.text()).toContain('Egyéni');
  });

  it('emits "selectType" event with "céges" on click', async () => {
    const cegesCard = wrapper.find('#ceges');
    await cegesCard.trigger('click');
    expect(wrapper.emitted('selectType')![0]).toEqual(['céges']);
  });

  it('emits "selectType" event with "reptéri" on click', async () => {
    const cegesCard = wrapper.find('#repteri');
    await cegesCard.trigger('click');
    expect(wrapper.emitted('selectType')![0]).toEqual(['reptéri']);
  });

  it('emits "selectType" event with "egyéni" on click', async () => {
    const cegesCard = wrapper.find('#egyeni');
    await cegesCard.trigger('click');
    expect(wrapper.emitted('selectType')![0]).toEqual(['egyéb']);
  });
});
