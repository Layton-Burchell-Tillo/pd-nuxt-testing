import { test, vi, describe, afterAll, beforeAll, expect } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils'

describe('RandomPokemonImage', async () => {
  vi.mock(
    '#imports',
    async (importOriginal: () => Promise<Record<PropertyKey, unknown>>) => {
      const actual = await importOriginal()
      return {
        ...actual,
        getRandomIntInRange: vi.fn(() => 103),
      }
    }
  )
  
  const originalRandom = Math.random

  beforeAll(() => {
    Math.random = vi.fn(() => 0.1)
  })

  afterAll(() => {
    Math.random = originalRandom
  })

  await setup({
    rootDir: '../..'
  })
  
  test('is rendered properly on home page', async () => {
    const page = await createPage('/')

    const imgEl = await page.$('img')
    const src = await imgEl?.getAttribute('src')

    expect(src).toBeTruthy()
    expect(src!.startsWith('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/')).toBeTruthy()
    expect(src!.endsWith('.png')).toBeTruthy()
  })
})