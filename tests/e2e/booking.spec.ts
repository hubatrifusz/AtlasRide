import { test, expect } from '@playwright/test'

test.describe('Booking Page - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/booking')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Page initialization', () => {
    test('has title', async ({ page }) => {
      await expect(page).toHaveTitle(
        'Atlas Ride - Prémium reptértranszfer szolgáltatás',
      )
    })

    test('it should be at the first step after initialization', async ({
      page,
    }) => {
      await expect(page.getByText('Utazás részletei')).toBeVisible()
    })
  })

  test.describe('Action buttons', () => {
    test('only Next button is visible after initialization', async ({
      page,
    }) => {
      const actionButtonsContainer = await page.locator('#action_buttons')
      const buttons = await actionButtonsContainer.getByRole('button')

      await expect(buttons).toHaveCount(1)
      await expect(buttons).toHaveText('Következő')
    })

    test('stay on page after invalid submission', async ({ page }) => {
      await page.getByRole('button', { name: 'Következő' }).click()

      const errors = await page.getByText('Kötelező')

      expect(errors).toHaveCount(2)
    })

    test('stay on page after partial submission', async ({ page }) => {
      await page
        .getByRole('group')
        .filter({ has: page.getByText('Indulási helyszín') })
        .getByPlaceholder('Település neve*')
        .fill('Teszt település')

      await page.getByRole('button', { name: 'Következő' }).click()

      const errors = await page.getByText('Kötelező')

      expect(errors).toHaveCount(1)
    })

    test('stay on page after invalid airport submission', async ({ page }) => {
      await page
        .getByRole('group')
        .filter({ has: page.getByText('Indulási helyszín') })
        .getByRole('button', { name: 'Váltás repülőtérre' })
        .click()

      await page
        .getByRole('group')
        .filter({ has: page.getByText('Érkezési helyszín') })
        .getByRole('button', { name: 'Váltás repülőtérre' })
        .click()

      await page.getByRole('button', { name: 'Következő' }).click()

      await expect(page.getByText('Utazás részletei')).toBeVisible()
    })
  })

  test.describe('Form validation', () => {
    test('show 2 errors on invalid submission', async ({ page }) => {
      await page.getByRole('button', { name: 'Következő' }).click()

      const errors = await page.getByText('Kötelező')

      expect(errors).toHaveCount(2)
    })

    test('show 2 errors on invalid airport submission', async ({ page }) => {
      await page
        .getByRole('group')
        .filter({ has: page.getByText('Indulási helyszín') })
        .getByRole('button', { name: 'Váltás repülőtérre' })
        .click()

      await page
        .getByRole('group')
        .filter({ has: page.getByText('Érkezési helyszín') })
        .getByRole('button', { name: 'Váltás repülőtérre' })
        .click()

      await page.getByRole('button', { name: 'Következő' }).click()

      const errors = await page.getByText('Kötelező')

      expect(errors).toHaveCount(2)
    })
  })
})
