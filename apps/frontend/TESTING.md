# Booking Feature Test Suite

## Overview

This comprehensive test suite covers the AtlasRide booking feature with three levels of testing: Unit Tests, Integration Tests, and End-to-End (E2E) Tests.

## Test Structure

```
tests/
├── unit/
│   ├── stores/
│   │   └── useBookingStore.enhanced.test.ts
│   ├── utils/
│   │   └── useBooking.test.ts
│   ├── schemas/
│   │   └── booking.test.ts
│   └── components/
│       ├── ActionButtons.test.ts
│       └── FormStepper.test.ts
├── integration/
│   └── booking-flow.test.ts
└── e2e/
    └── booking.spec.ts
```

## Running Tests

### All Tests
```bash
pnpm test
```

### Unit Tests Only
```bash
pnpm vitest run tests/unit
```

### Integration Tests Only
```bash
pnpm vitest run tests/integration
```

### E2E Tests Only
```bash
pnpm playwright test tests/e2e
```

### Watch Mode (for development)
```bash
pnpm vitest watch
```

### E2E Tests with UI
```bash
pnpm playwright test --ui
```

## Test Coverage

### Unit Tests (Vitest)

#### 1. **useBookingStore Tests** (`tests/unit/stores/useBookingStore.enhanced.test.ts`)
- ✅ Initial state validation
- ✅ Step navigation (next/previous)
- ✅ Airport transfer detection
- ✅ Form data management
- ✅ Edge cases handling

**Coverage Areas:**
- State initialization
- Step count management
- Current step tracking
- Airport input counting
- Form data persistence

#### 2. **useBooking Composable Tests** (`tests/unit/utils/useBooking.test.ts`)
- ✅ Successful booking submission
- ✅ API error handling (400, 500, network errors)
- ✅ Fetching all bookings
- ✅ Timeout handling
- ✅ Malformed data handling

**Coverage Areas:**
- `postNewBooking()` function
- `getAllBooking()` function
- Error states
- Loading states
- API mocking with `vi.mock()`

#### 3. **Booking Schemas Tests** (`tests/unit/schemas/booking.test.ts`)
- ✅ Address validation
- ✅ Company location validation
- ✅ Contact data validation
- ✅ Flight information validation
- ✅ Custom error messages (Hungarian)

**Coverage Areas:**
- `AddressSchema`
- `CompanyLocationSchema`
- `ContactDataSchema`
- `FlightInformationSchema`
- Email format validation
- Required field validation

#### 4. **ActionButtons Component Tests** (`tests/unit/components/ActionButtons.test.ts`)
- ✅ Navigation button rendering
- ✅ Confirmation button on final step
- ✅ Event emission
- ✅ Loading states
- ✅ Different step counts (3 vs 4 steps)

**Coverage Areas:**
- Next/Previous button behavior
- Confirmation button
- Loading state during submission
- Button accessibility

#### 5. **FormStepper Component Tests** (`tests/unit/components/FormStepper.test.ts`)
- ✅ Personal transfer stepper (3 steps)
- ✅ Airport transfer stepper (4 steps)
- ✅ Dynamic switching between flows
- ✅ Current step binding
- ✅ Step count updates

**Coverage Areas:**
- Stepper item rendering
- Dynamic flow switching
- Airport detection
- Icon display

### Integration Tests (Vitest + @nuxt/test-utils)

#### **Booking Flow Integration** (`tests/integration/booking-flow.test.ts`)
- ✅ Complete 3-step personal flow
- ✅ Complete 4-step airport flow
- ✅ Dynamic flow switching
- ✅ Form data persistence across steps
- ✅ Booking submission with API mocking
- ✅ Error handling (400, 500, timeout)
- ✅ Loading states

**Coverage Areas:**
- Multi-step form navigation
- Component interaction
- Store integration
- API call mocking
- Error recovery

### E2E Tests (Playwright)

#### **Booking Page E2E** (`tests/e2e/booking.spec.ts`)

**Test Scenarios:**

1. **Personal Transfer Flow**
   - ✅ Complete booking journey
   - ✅ Backward navigation
   - ✅ Form data preservation
   - ✅ 3-step stepper validation

2. **Airport Transfer Flow**
   - ✅ Complete airport booking
   - ✅ Flight information step
   - ✅ Dynamic flow switching
   - ✅ 4-step stepper validation
   - ✅ Return trip handling

3. **Form Validation**
   - ✅ Required field validation
   - ✅ Email format validation
   - ✅ Flight number validation

4. **Company Booking**
   - ✅ Company tab selection
   - ✅ Company location fields
   - ✅ Required field validation for companies

5. **Loading States**
   - ✅ Button disabled during submission
   - ✅ Loading indicator

6. **API Error Handling**
   - ✅ 500 Internal Server Error
   - ✅ 400 Bad Request
   - ✅ Network timeout

7. **Responsive Design**
   - ✅ Mobile viewport (375x667)
   - ✅ Tablet viewport (768x1024)

8. **Accessibility**
   - ✅ Keyboard navigation
   - ✅ ARIA labels
   - ✅ Screen reader support

9. **Edge Cases**
   - ✅ Special characters (Hungarian: ő, ű, etc.)
   - ✅ Very long input strings
   - ✅ Rapid button clicking
   - ✅ Browser back button recovery

## Key Testing Patterns

### 1. Mocking API Calls (Vitest)
```typescript
const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

mockFetch.mockResolvedValueOnce({ success: true });
```

### 2. Pinia Store Setup
```typescript
beforeEach(() => {
  setActivePinia(createPinia());
});
```

### 3. Component Testing
```typescript
const wrapper = mount(ActionButtons);
await wrapper.find('button').trigger('click');
expect(wrapper.emitted('submitForm')).toBeTruthy();
```

### 4. Playwright Selectors (Accessible)
```typescript
await page.getByRole('button', { name: /Következő/i });
await page.getByLabel(/Teljes név/i);
```

### 5. API Mocking (Playwright)
```typescript
await page.route('**/api', (route) => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Server Error' }),
  });
});
```

## Test Coverage Summary

| Test Type | Files | Test Cases | Coverage |
|-----------|-------|------------|----------|
| Unit Tests | 5 | 120+ | Store, Utils, Schemas, Components |
| Integration Tests | 1 | 25+ | Multi-step flows, API integration |
| E2E Tests | 1 | 30+ | Full user journeys, edge cases |
| **Total** | **7** | **175+** | **Comprehensive** |

## Edge Cases Covered

### Form Validation
- ✅ Empty required fields
- ✅ Invalid email format
- ✅ Missing flight numbers
- ✅ Incomplete company information

### Error States
- ✅ Network errors
- ✅ 400 Bad Request
- ✅ 500 Internal Server Error
- ✅ Timeout errors
- ✅ Malformed JSON responses

### User Interactions
- ✅ Rapid clicking
- ✅ Back button navigation
- ✅ Browser back/forward
- ✅ Form data persistence
- ✅ Dynamic flow switching

### Data Handling
- ✅ Special characters (Hungarian)
- ✅ Very long strings
- ✅ Null/undefined values
- ✅ Empty arrays/objects

## Best Practices Implemented

1. **Organized Test Structure**: Tests are grouped using `describe()` blocks
2. **Setup/Teardown**: Use `beforeEach()` for consistent test setup
3. **Accessible Selectors**: Playwright tests use `getByRole()`, `getByLabel()`
4. **Mocking**: API calls are mocked to isolate tests
5. **Async/Await**: Proper handling of asynchronous operations
6. **Edge Cases**: Comprehensive coverage of error scenarios
7. **Clean Code**: Descriptive test names and clear assertions

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm vitest run
      - run: pnpm playwright test
```

## Debugging Tests

### Vitest Debug Mode
```bash
pnpm vitest --inspect-brk
```

### Playwright Debug Mode
```bash
pnpm playwright test --debug
```

### View Playwright Report
```bash
pnpm playwright show-report
```

## Contributing

When adding new booking features:

1. **Unit Tests**: Test individual component behavior
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

Maintain the same testing patterns and ensure all new code has appropriate test coverage.

## Notes

- All tests use TypeScript for type safety
- Hungarian language validation messages are tested
- Tests cover both personal and airport transfer flows
- Accessibility is a first-class concern
- API mocking ensures tests run independently

## Support

For questions or issues with the test suite, refer to:
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [@nuxt/test-utils Documentation](https://nuxt.com/docs/getting-started/testing)
