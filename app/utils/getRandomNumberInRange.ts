export function getRandomNumberIntInRange(low: number, high: number) {
  const r = Math.random()
  return Math.round(r * (high - low) + low)
}