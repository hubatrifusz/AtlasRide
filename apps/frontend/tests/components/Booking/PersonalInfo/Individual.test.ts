import { describe, expect, beforeEach, test } from 'vitest';
import { mount } from '@vue/test-utils';
import Individual from '../../../../app/components/Booking/PersonalInfo/Individual.vue';
import { IndividualBookingSchema } from '../../../../app/schemas/booking';
import * as v from 'valibot';

describe('Tests for the input fields', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(Individual);
  });

  test('All input fields render', () => {
    const inputs = wrapper.findAll('UInput');
    expect(inputs.length).toEqual(3);
  });

  test('All input elements have the correct placeholder', () => {
    const inputs = wrapper.findAll('UInput');
    const placeholders: string[] = [];
    for (let i = 0; i < inputs.length; i++) {
      const element = inputs[i];
      placeholders.push(element.attributes('placeholder'));
    }

    expect(placeholders[0]).toEqual('Teljes név');
    expect(placeholders[1]).toEqual('Email');
    expect(placeholders[2]).toEqual('Telefonszám');
  });
});

describe('Tests for the validation schema', () => {
  test('The schema returns false, if the inputs are empty', () => {
    const emptyData = { name: '', email: '', phone: '' };
    const result = v.safeParse(IndividualBookingSchema, emptyData);
    expect(result.success).toBe(false);
  });

  test('The schema returns true, if the inputs are correcty filled', () => {
    const emptyData = { name: 'Test User', email: 'test.user@gmail.com', phone: '06201234567' };
    const result = v.safeParse(IndividualBookingSchema, emptyData);
    expect(result.success).toBe(true);
  });

  test('The schema returns false, if the inputs are partially filled', () => {
    const emptyData = { name: '', email: 'test.user@gmail.com', phone: '06201234567' };
    const result = v.safeParse(IndividualBookingSchema, emptyData);
    expect(result.success).toBe(false);
  });

  test('The schema returns false, if the inputs are filled with invalid data', () => {
    const emptyData = { name: 'Test User', email: 'test.user@gmailcom', phone: '06201234567' };
    const result = v.safeParse(IndividualBookingSchema, emptyData);
    expect(result.success).toBe(false);
  });
});
