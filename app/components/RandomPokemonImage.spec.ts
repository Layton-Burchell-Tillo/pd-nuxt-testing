import { test, describe, expect } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils'

describe.skip('RandomPokemonImage', async () => {
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