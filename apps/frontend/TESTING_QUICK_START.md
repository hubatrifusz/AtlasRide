# Quick Start: Running the Booking Tests

## Prerequisites

Ensure you have:
- Node.js 18+ installed
- pnpm package manager
- Dependencies installed: `pnpm install`

## Running Tests

### 1. Run All Unit Tests
```bash
pnpm vitest run
```

### 2. Run Tests in Watch Mode (Development)
```bash
pnpm vitest watch
```

### 3. Run Specific Test File
```bash
# Unit test
pnpm vitest run tests/unit/stores/useBookingStore.enhanced.test.ts

# Integration test
pnpm vitest run tests/integration/booking-flow.test.ts
```

### 4. Run E2E Tests with Playwright
```bash
# Install Playwright browsers (first time only)
pnpm playwright install

# Run E2E tests
pnpm playwright test

# Run E2E tests with UI
pnpm playwright test --ui

# Run E2E tests in headed mode (see browser)
pnpm playwright test --headed
```

### 5. Generate Code Coverage Report
```bash
pnpm vitest run --coverage
```

## Test Files Overview

### Unit Tests (`tests/unit/`)
- **useBookingStore.enhanced.test.ts** - Store logic and state management
- **useBooking.test.ts** - API composable functions
- **booking.test.ts** - Validation schemas (Valibot)
- **ActionButtons.test.ts** - Button component behavior
- **FormStepper.test.ts** - Stepper component rendering

### Integration Tests (`tests/integration/`)
- **booking-flow.test.ts** - Multi-step form flow and component interactions

### E2E Tests (`tests/e2e/`)
- **booking.spec.ts** - Full user journey testing

## Common Issues & Solutions

### Issue: Module resolution errors in IDE
**Error:** `Cannot find module '~/stores/useBookingStore'`

**Solution:** This is a TypeScript language server limitation. The tests will run fine because `vitest.config.ts` configures the alias properly. You can ignore these errors or restart your TypeScript server.

### Issue: Playwright browsers not installed
**Error:** `Executable doesn't exist`

**Solution:** 
```bash
pnpm playwright install
```

### Issue: Port 3000 already in use for E2E tests
**Error:** `Port 3000 is already allocated`

**Solution:** 
1. Stop other services running on port 3000
2. Or update the E2E test URL to use a different port

### Issue: Vitest hangs or doesn't exit
**Solution:** Add `--no-watch` flag:
```bash
pnpm vitest run --no-watch
```

## Viewing Test Results

### Vitest Output
Tests will display in the terminal with:
- ✓ Green checkmarks for passing tests
- ✗ Red X for failing tests
- Detailed error messages with stack traces

### Playwright HTML Report
After running Playwright tests, view the report:
```bash
pnpm playwright show-report
```

## CI/CD Integration

Add to your CI pipeline (e.g., GitHub Actions):

```yaml
- name: Run Unit & Integration Tests
  run: pnpm vitest run

- name: Install Playwright Browsers
  run: pnpm playwright install --with-deps

- name: Run E2E Tests
  run: pnpm playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage for stores, utils, and components
- **Integration Tests:** All multi-step flows covered
- **E2E Tests:** Critical user journeys validated

## Next Steps

1. Review [TESTING.md](./TESTING.md) for comprehensive documentation
2. Run tests in watch mode during development
3. Add new tests when adding features
4. Keep test coverage above 80%

## Quick Commands Cheat Sheet

```bash
# Watch mode for development
pnpm vitest watch

# Run all tests once
pnpm vitest run && pnpm playwright test

# Run specific test pattern
pnpm vitest run -t "airport transfer"

# Debug a specific E2E test
pnpm playwright test --debug -g "complete full personal booking"

# Generate and open coverage report
pnpm vitest run --coverage && open coverage/index.html
```
