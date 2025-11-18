import {expect, test} from '@nuxt/test-utils/playwright'

test('button shows', async ({ page, goto }) => {
  await goto('/', {waitUntil: 'hydration'})

  const button = page.getByRole('button')
  const buttonText = await button.textContent()
  expect(buttonText?.trim()).toBe('click me!')
})

test('clicking button opens modal', async ({ page, goto }) => {
  await goto('/', {waitUntil: 'hydration'})

  const button = page.getByRole('button')
  await button.click()

  const dialog = page.getByRole('dialog')
  const dialogIsVisible = await dialog.isVisible()
  const dialogText = await dialog.textContent();

  expect(dialogIsVisible).toBeTruthy()
  expect(dialogText?.trim()).toBe('dialog open')
})

test('pressing escape closes modal', async ({ page, goto }) => {
  await goto('/', {waitUntil: 'hydration'})

  const button = page.getByRole('button')
  await button.click()

  const dialog = page.getByRole('dialog')

  // DIALOG IS OPEN

  await page.keyboard.press('Escape')
  const dialogIsVisible = await dialog.isVisible()

  expect(dialogIsVisible).toBeFalsy()
})

test('snapshot', async ({ page, goto }) => {
  await goto('/', {waitUntil: 'hydration'})
  await expect(page).toHaveScreenshot({ fullPage: true })
})