import { test, vi, describe, beforeEach, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { RandomPokemonImage } from '#components'

describe('RandomPokemonImage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  
  test('text', async () => {
    // Mock the global fetch
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ sprites: { front_default: 'https://placehold.co/300' }})
    })))

    const wrapper = await mountSuspended(RandomPokemonImage, { props: { pokemonId: 103 } })

    const actual = wrapper.text()

    expect(actual).toBe('Random pokemon image')
  })
})