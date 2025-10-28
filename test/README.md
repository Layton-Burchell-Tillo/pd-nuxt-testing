# Testing with nuxt

This document is an abbreviated and aggregated copy of [the nuxt testing docs](https://nuxt.com/docs/4.x/getting-started/testing) to help my memory, ensure understanding, and easy reference.

## Helper utils

Nuxt provides a lot of helpers (`@nuxt/test-utils`) for testing.

### Runtime utils @nuxt/test-utils/runtime

- `mountSuspended` - *mount* a component with async setup and plugin injections

  This can be used to test the rendered content but *not* its interactivity

  ```ts
  it('can mount some component', async () => {
    const component = await mountSuspended(SomeComponent)
    expect(component.text()).toMatchInlineSnapshot(
      '"This is an auto-imported component"',
    )
  })
  ```

- `renderSuspended` - *render* a component with async setup and plugin injections

  This can be used to test both the rendered content *and* its interactivity

  Using this setup requires `@testing-library/vue` for utils like `fireEvent` and `screen`

  ```ts
  // tests/components/SomeComponents.nuxt.spec.ts
  import { renderSuspended } from '@nuxt/test-utils/runtime'
  import { SomeComponent } from '#components'
  import { screen } from '@testing-library/vue'

  it('can render some component', async () => {
    await renderSuspended(SomeComponent)
    expect(screen.getByText('This is an auto-imported component')).toBeDefined()
  })
  ```
  ```ts
  // tests/App.nuxt.spec.ts
  import { renderSuspended } from '@nuxt/test-utils/runtime'
  import App from '~/app.vue'

  it('can also render an app', async () => {
    const html = await renderSuspended(App, { route: '/test' })
    expect(html).toMatchInlineSnapshot(`
      "<div id="test-wrapper">
        <div>This is an auto-imported component</div>
        <div> I am a global component </div>
        <div>Index page</div><a href="/test"> Test link </a>
      </div>"
    `)
  })
  ```

- `mockNuxtImport` - mock nuxt auto-imports

  ```ts
  import { mockNuxtImport } from '@nuxt/test-utils/runtime'

  mockNuxtImport('useStorage', () => {
    return () => {
      return { value: 'mocked storage' }
    }
  })

  // your tests here
  ```

  Can also provide different implementations between tests, as shown [here](https://nuxt.com/docs/4.x/getting-started/testing#%EF%B8%8F-helpers:~:text=provide%20different%20implementations%20between%20tests)

- `mockComponent` - mock a component

  - First input is a component name or a file path to the single file component (SFC)
  
  - Second input is a component options object, a factory function, or a path to an SFC

  ```ts
  import { mockComponent } from '@nuxt/test-utils/runtime'

  mockComponent('MyComponent', {
    props: {
      value: String,
    },
    setup (props) {
      // ...
    },
  })

  // relative path or alias also works
  mockComponent('~/components/my-component.vue', () => {
    // or a factory function
    return defineComponent({
      setup (props) {
        // ...
      },
    })
  })

  // or you can use SFC for redirecting to a mock component
  mockComponent('MyComponent', () => import('./MockComponent.vue'))

  // your tests here
  ```

- `registerEndpoint` - mock an endpoint such that it returns mock data

  ```ts
  import { registerEndpoint } from '@nuxt/test-utils/runtime'

  registerEndpoint('/test/', () => ({
    test: 'test-field',
  }))

  registerEndpoint('/test/', {
    method: 'POST',
    handler: () => ({ test: 'test-field' }),
  })
  ```

### E2e utils @nuxt/test-utils/e2e

All e2e tests need to be setup in a `setup` block at the start of the related `describe` block

```ts
import { describe, test } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('My test', async () => {
  await setup({
    // test context options
  })

  test('my test', () => {
    // ...
  })
})
```

This adds tasks to many of the `beforeX` and `afterX` setup functions to set up and tear down the nuxt test environment properly

The [setup section](https://nuxt.com/docs/4.x/getting-started/testing#setup-1) of the nuxt docs details all the available options for the `setup` block

- Playwright tests

  Using the `createPage` util from the e2e test utils returns a typical playwright page interface

  ```ts
  import { createPage } from '@nuxt/test-utils/e2e'

  const page = await createPage('/page')
  // you can access all the Playwright APIs from the `page` variable
  ```

  Then tests can be run by importing them from `@nuxt/test-utils/playwright`

  ```ts
  import { expect, test } from '@nuxt/test-utils/playwright'

  test.use({
    nuxt: {
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  })

  test('test', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page.getByRole('heading')).toHaveText('Welcome to Playwright!')
  })
  ```

  That's a bit verbose - we can drop the `test.use` call by adding a `playwright.config.ts` file which takes the same input as the `setup` blocks from earlier

  ```ts
  // playwright.config.ts
  import { fileURLToPath } from 'node:url'
  import { defineConfig, devices } from '@playwright/test'
  import type { ConfigOptions } from '@nuxt/test-utils/playwright'

  export default defineConfig<ConfigOptions>({
    use: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    // ...
  })
  ```

  Full example file available [here](https://github.com/nuxt/test-utils/blob/main/examples/app-playwright/playwright.config.ts)

- Testing against a separate *local* server

  Specify a `host` url in the `setup` block

  Why? Because across multiple tests, even in pipelines, this can be more efficient than repeatedly spinning up and shutting down servers in tandem with the related tests

  ```ts
  import { createPage, setup } from '@nuxt/test-utils/e2e'
  import { describe, expect, it } from 'vitest'

  describe('login page', async () => {
    await setup({
      host: 'http://localhost:8787',
    })

    it('displays the email and password fields', async () => {
      const page = await createPage('/login')
      expect(await page.getByTestId('email').isVisible()).toBe(true)
      expect(await page.getByTestId('password').isVisible()).toBe(true)
    })
  })
  ```

  - Fetching html and data use the `$fetch` and `fetch` functions respectively (both imported from the e2e test utils)

### Notes and Gotchas

- `@nuxt/test-utils/runtime` and `@nuxt/test-utils/e2e` need to run in different testing environments!!!

- If needed, `@vue/test-utils` can be used independantly of everything else
