// Small computer-science helpers shared by the CS visual components:
// number-base conversion, byte/bit utilities, and tiny text-encoding helpers.

/** Unsigned integer -> binary string, left-padded to `bits` width. */
export function toBinary(n: number, bits = 8): string {
  if (n < 0) n = 0
  return (n >>> 0).toString(2).padStart(bits, '0').slice(-bits)
}

/** Binary string -> unsigned integer. Ignores non 0/1 chars. */
export function fromBinary(s: string): number {
  const clean = s.replace(/[^01]/g, '')
  return clean ? parseInt(clean, 2) : 0
}

/** Unsigned integer -> uppercase hex string, left-padded to `digits`. */
export function toHex(n: number, digits = 2): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(digits, '0')
}

/** A byte (0-255) as an array of 8 bits, most-significant first. */
export function byteToBits(n: number): Array<0 | 1> {
  return toBinary(n, 8)
    .split('')
    .map((c) => (c === '1' ? 1 : 0)) as Array<0 | 1>
}

/** Place values of an 8-bit byte: [128,64,32,16,8,4,2,1]. */
export const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const

/** Format a count of bytes into a friendly unit string (powers of 1024). */
export function formatBytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let v = n
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v % 1 === 0 ? v : v.toFixed(1)} ${units[i]}`
}

/** Char -> ASCII code (first char only). */
export function asciiCode(ch: string): number {
  return ch.length ? ch.charCodeAt(0) : 0
}

/** XOR two equal-length bit strings (used in error-detection / crypto demos). */
export function xorBits(a: string, b: string): string {
  const len = Math.max(a.length, b.length)
  let out = ''
  for (let i = 0; i < len; i++) {
    const x = a[i] === '1' ? 1 : 0
    const y = b[i] === '1' ? 1 : 0
    out += x ^ y
  }
  return out
}

/** Even-parity bit for a bit string (1 if the number of 1s is odd). */
export function parityBit(bits: string): 0 | 1 {
  const ones = bits.split('').filter((c) => c === '1').length
  return (ones % 2) as 0 | 1
}
