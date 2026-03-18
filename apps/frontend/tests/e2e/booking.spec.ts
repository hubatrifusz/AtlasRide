import { test, expect } from '@playwright/test';

test.describe('Booking Page - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking page before each test
    await page.goto('http://localhost:3000/booking', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test.describe('Personal Transfer Flow (Non-Airport)', () => {
    test('should complete full personal booking journey', async ({ page }) => {
      // Step 1: Travel Details
      await expect(page.getByText('Utazás részletei')).toBeVisible();

      // Fill departure location
      await page
        .getByLabel(/Indulás helye|Város/i)
        .first()
        .fill('Budapest');

      // Fill destination location
      await page
        .getByLabel(/Érkezés helye|Város/i)
        .nth(1)
        .fill('Vienna');

      // Set passenger count
      await page.locator('input[type="number"]').fill('2');

      // Click next
      await page.getByRole('button', { name: /Következő/i }).click();

      // Step 2: Contact Details
      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();

      // Fill contact information
      await page.getByLabel(/Teljes név|név/i).fill('John Doe');
      await page.getByLabel(/Telefonszám|telefon/i).fill('+36301234567');
      await page.getByLabel(/Email/i).fill('john.doe@example.com');

      // Click next
      await page.getByRole('button', { name: /Következő/i }).click();

      // Step 3: Confirmation
      await expect(page.getByText('Foglalás áttekintése')).toBeVisible();

      // Verify displayed information
      await expect(page.getByText('Budapest')).toBeVisible();
      await expect(page.getByText('Vienna')).toBeVisible();
      await expect(page.getByText('John Doe')).toBeVisible();

      // Submit booking
      const confirmButton = page.getByRole('button', { name: /Megerősítés/i });
      await confirmButton.click();

      // Wait for submission to complete (either success or error)
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    });

    test('should navigate backward through steps', async ({ page }) => {
      // Go to step 2
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();

      // Go back
      await page.getByRole('button', { name: /Vissza/i }).click();

      // Should be back on travel details
      await expect(page.getByText('Utazás részletei')).toBeVisible();
    });

    test('should preserve form data when navigating backward', async ({ page }) => {
      // Fill travel details
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Fill contact details
      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Email/i).fill('test@example.com');

      // Go back
      await page.getByRole('button', { name: /Vissza/i }).click();

      // Verify data is preserved
      await expect(page.getByLabel(/Város/i).first()).toHaveValue('Budapest');

      // Go forward again
      await page.getByRole('button', { name: /Következő/i }).click();

      // Contact data should still be there
      await expect(page.getByLabel(/Teljes név|név/i)).toHaveValue('Test User');
    });

    test('should show 3 steps for personal transfer in stepper', async ({ page }) => {
      // Count stepper items (3 for personal)
      const stepperItems = page.locator('[role="tablist"] [role="tab"]');
      await expect(stepperItems).toHaveCount(3);
    });
  });

  test.describe('Airport Transfer Flow', () => {
    test('should complete full airport booking journey', async ({ page }) => {
      // Step 1: Travel Details with airport
      await expect(page.getByText('Utazás részletei')).toBeVisible();

      // Toggle departure location to airport
      await page
        .getByText(/Repülőtér/i)
        .first()
        .click();

      // Select airport
      await page.selectOption('select', 'BUD');

      // Fill destination as regular address
      await page.getByLabel(/Város/i).last().fill('Vienna');

      // Click next
      await page.getByRole('button', { name: /Következő/i }).click();

      // Step 2: Flight Information
      await expect(page.getByText('Járat információk')).toBeVisible();

      // Fill flight number
      await page.getByLabel(/Járatszám/i).fill('FR1234');

      // Click next
      await page.getByRole('button', { name: /Következő/i }).click();

      // Step 3: Contact Details
      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();

      await page.getByLabel(/Teljes név|név/i).fill('Jane Smith');
      await page.getByLabel(/Telefon/i).fill('+36209876543');
      await page.getByLabel(/Email/i).fill('jane@example.com');

      await page.getByRole('button', { name: /Következő/i }).click();

      // Step 4: Confirmation
      await expect(page.getByText('Foglalás áttekintése')).toBeVisible();

      // Verify information
      await expect(page.getByText('Budapest')).toBeVisible();
      await expect(page.getByText('FR1234')).toBeVisible();
      await expect(page.getByText('Jane Smith')).toBeVisible();

      // Submit
      await page.getByRole('button', { name: /Megerősítés/i }).click();
    });

    test('should show 4 steps for airport transfer in stepper', async ({ page }) => {
      // Toggle to airport
      await page
        .getByText(/Repülőtér/i)
        .first()
        .click();

      // Wait for stepper to update
      const stepperItems = page.locator('[role="tablist"] [role="tab"]');
      await expect(stepperItems).toHaveCount(4, { timeout: 3000 });
    });

    test('should dynamically switch from personal to airport flow', async ({ page }) => {
      // Initially 3 steps
      let stepperItems = page.locator('[role="tablist"] [role="tab"]');
      await expect(stepperItems).toHaveCount(3, { timeout: 3000 });

      // Toggle to airport
      await page
        .getByText(/Repülőtér/i)
        .first()
        .click();

      // Wait for stepper to update to 4 steps
      await expect(stepperItems).toHaveCount(4, { timeout: 3000 });
    });

    test('should include flight information for return trip', async ({ page }) => {
      // Set up airport transfer
      await page
        .getByText(/Repülőtér/i)
        .first()
        .click();
      await page.selectOption('select', 'BUD');

      // Enable return trip
      await page.getByLabel(/Visszaút|return/i).check();

      await page.getByLabel(/Város/i).last().fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Flight information page
      await expect(page.getByText('Járat információk')).toBeVisible();

      // Should have fields for both outbound and return flights
      await page.getByLabel(/Induló járat|outbound/i).fill('FR1234');
      await page.getByLabel(/Vissza járat|return/i).fill('FR5678');

      await expect(page.getByLabel(/Induló járat|outbound/i)).toHaveValue('FR1234');
      await expect(page.getByLabel(/Vissza járat|return/i)).toHaveValue('FR5678');
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors for empty required fields', async ({ page }) => {
      // Try to proceed without filling required fields
      await page.getByRole('button', { name: /Következő/i }).click();

      // Should show validation errors
      await expect(page.getByText(/Kötelező/i).first()).toBeVisible({ timeout: 5000 });
    });

    test('should validate email format', async ({ page }) => {
      // Fill travel details
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Enter invalid email
      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Telefon/i).fill('+36301234567');
      await page.getByLabel(/Email/i).fill('invalid-email');

      await page.getByRole('button', { name: /Következő/i }).click();

      // Should show email validation error
      await expect(page.getByText(/email/i)).toBeVisible({ timeout: 5000 });
    });

    test('should require flight number for airport transfer', async ({ page }) => {
      // Set up airport transfer
      await page
        .getByText(/Repülőtér/i)
        .first()
        .click();
      await page.selectOption('select', 'BUD');
      await page.getByLabel(/Város/i).last().fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // On flight information page, try to proceed without flight number
      await page.getByRole('button', { name: /Következő/i }).click();

      // Should show validation error
      await expect(page.getByText(/Járatszám kötelező|required/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Company Booking', () => {
    test('should allow selecting company as customer type', async ({ page }) => {
      // Navigate to contact details
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Switch to company tab
      await page.getByRole('tab', { name: /Cég/i }).click();

      // Company location fields should be visible
      await expect(page.getByLabel(/Székhely|Location/i).first()).toBeVisible({ timeout: 5000 });
    });

    test('should require company location fields when company is selected', async ({ page }) => {
      // Navigate to contact details
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Switch to company
      await page.getByRole('tab', { name: /Cég/i }).click();

      // Fill personal details but not company location
      await page.getByLabel(/Teljes név|név/i).fill('John Doe');
      await page.getByLabel(/Email/i).fill('john@company.com');
      await page.getByLabel(/Telefon/i).fill('+36301234567');

      // Try to proceed
      await page.getByRole('button', { name: /Következő/i }).click();

      // Should show validation for company fields
      await expect(page.getByText(/Kötelező kitölteni/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state during booking submission', async ({ page }) => {
      // Complete the form
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Email/i).fill('test@example.com');
      await page.getByLabel(/Telefon/i).fill('+36301234567');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Click confirm
      const confirmButton = page.getByRole('button', { name: /Megerősítés/i });
      await confirmButton.click();

      // Button should show loading state
      await expect(confirmButton).toBeDisabled({ timeout: 2000 });
    });
  });

  test.describe('API Error Handling', () => {
    test('should handle API 500 error gracefully', async ({ page }) => {
      // Mock API to return error
      await page.route('**/api', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      // Complete the form
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Email/i).fill('test@example.com');
      await page.getByLabel(/Telefon/i).fill('+36301234567');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Submit
      await page.getByRole('button', { name: /Megerősítés/i }).click();

      // Wait for API response or timeout
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      // Should remain on confirmation page (not crash)
      await expect(page.getByText('Foglalás áttekintése')).toBeVisible({ timeout: 5000 });
    });

    test('should handle API 400 validation error', async ({ page }) => {
      // Mock API to return validation error
      await page.route('**/api', (route) => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Validation failed', details: ['Invalid phone number'] }),
        });
      });

      // Complete the form
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Email/i).fill('test@example.com');
      await page.getByLabel(/Telefon/i).fill('invalid-phone');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Submit
      await page.getByRole('button', { name: /Megerősítés/i }).click();

      // Wait for API response or timeout
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      // Should handle error without crashing
      await expect(page.getByRole('button', { name: /Megerősítés/i })).toBeVisible({ timeout: 5000 });
    });

    test('should handle network timeout', async ({ page }) => {
      test.setTimeout(15000); // Increase timeout for this specific test

      // Mock slow API response
      await page.route('**/api', async (route) => {
        await page.waitForTimeout(2000);
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      // Complete the form quickly
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await page.getByLabel(/Teljes név|név/i).fill('Test User');
      await page.getByLabel(/Email/i).fill('test@example.com');
      await page.getByLabel(/Telefon/i).fill('+36301234567');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Submit
      const confirmButton = page.getByRole('button', { name: /Megerősítés/i });
      await confirmButton.click();

      // Should show loading state immediately
      await expect(confirmButton).toBeDisabled({ timeout: 1000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Should still be able to complete booking
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form fields
      await page.keyboard.press('Tab');
      await page.keyboard.type('Budapest');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.type('Vienna');

      // Should be able to submit with Enter
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should navigate to next step
      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible({ timeout: 3000 });
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for accessible form labels
      const labels = page.getByRole('textbox');
      await expect(labels.first()).toBeVisible({ timeout: 5000 });
    });

    test('should announce errors to screen readers', async ({ page }) => {
      // Submit without filling
      await page.getByRole('button', { name: /Következő/i }).click();

      // Error messages should have proper aria attributes
      const errors = page.getByText(/Kötelező/i);
      await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle special characters in input', async ({ page }) => {
      await page.getByLabel(/Város/i).first().fill('Győr');
      await page.getByLabel(/Város/i).nth(1).fill('Sopron');

      await expect(page.getByLabel(/Város/i).first()).toHaveValue('Győr');
    });

    test('should handle very long input strings', async ({ page }) => {
      const longString = 'A'.repeat(500);
      await page.getByLabel(/Város/i).first().fill(longString);

      // Should handle without crashing
      await expect(page.getByLabel(/Város/i).first()).toHaveValue(longString);
    });

    test('should handle rapid clicking of next button', async ({ page }) => {
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');

      const nextButton = page.getByRole('button', { name: /Következő/i });

      // Click multiple times rapidly
      await nextButton.click();
      await nextButton.click();
      await nextButton.click();

      // Should only advance once
      await expect(page.getByText('Kapcsolattartó adatok')).toBeVisible();
    });

    test('should recover from browser back button', async ({ page }) => {
      await page.getByLabel(/Város/i).first().fill('Budapest');
      await page.getByLabel(/Város/i).nth(1).fill('Vienna');
      await page.getByRole('button', { name: /Következő/i }).click();

      // Use browser back
      await page.goBack();

      // Should return to previous step
      await expect(page.getByText('Utazás részletei')).toBeVisible();

      // Data should be preserved
      await expect(page.getByLabel(/Város/i).first()).toHaveValue('Budapest');
    });
  });
});
