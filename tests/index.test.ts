import {describe, test, expect} from 'vitest'
import {createPage, setup} from '@nuxt/test-utils/e2e'
import path from 'path';

const screenshotsDir = path.join(process.cwd(), 'screenshots');

describe('testing', async () => {
  await setup()
  
  test('button shows', async () => {
    const page = await createPage('/')
    const button = page.getByRole('button')
    const buttonText = await button.textContent()
    expect(buttonText?.trim()).toBe('click me!')
  })
  
  test('clicking button opens modal', async () => {
    const page = await createPage('/')
    const button = page.getByRole('button')
    await button.click()

    const dialog = page.getByRole('dialog')
    const dialogIsVisible = await dialog.isVisible()
    const dialogText = await dialog.textContent();

    expect(dialogIsVisible).toBeTruthy()
    expect(dialogText?.trim()).toBe('dialog open')
  })
  
  test('clicking button opens modal', async () => {
    const page = await createPage('/')
    const button = page.getByRole('button')
    await button.click()

    const dialog = page.getByRole('dialog')

    // DIALOG IS OPEN

    await page.keyboard.press('Escape')
    const dialogIsVisible = await dialog.isVisible()

    expect(dialogIsVisible).toBeFalsy()
  })

  test('snapshot', async () => {
    const page = await createPage('/')
    const screenshotBinary = await page.screenshot({
      fullPage: true,
      type: 'png',
    })
    const screenshotPath = path.join(screenshotsDir, 'index-dialog_closed.png')

    expect(screenshotBinary).toMatchFileSnapshot(screenshotPath)
  })
})