import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import {getRandomIntInRange} from './getRandomIntInRange'

describe('getRandomIntInRange', () =>{
  const originalRandom = Math.random

  beforeAll(() => {
    Math.random = vi.fn(() => 0.1)
  })

  afterAll(() => {
    Math.random = originalRandom
  })
  
  test('returned number is within range', () => {
    const actual = getRandomIntInRange(1, 1025)
    expect(actual).toBe(103)
  })
})