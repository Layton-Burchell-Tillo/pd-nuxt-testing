export function getRandomIntInRange(low: number, high: number) {
  const r = Math.random()
  return Math.round(r * (high - low) + low)
}