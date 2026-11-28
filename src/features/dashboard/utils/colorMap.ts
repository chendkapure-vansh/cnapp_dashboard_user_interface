import type { ColorKey } from '@/types/dashboard.types'

const COLOR_MAP: Record<ColorKey, string> = {
  blue: '#4f7cff',
  lightBlue: '#dbe4ff',
  red: '#c8202a',
  darkRed: '#7a0f14',
  orange: '#f08a2c',
  amber: '#f5c542',
  green: '#1fa75a',
  grey: '#c9ced6',
}

/**
 * Maps a semantic color key to its corresponding hexadecimal color value.
 */
export function getColorHex(color: ColorKey): string {
  return COLOR_MAP[color] ?? '#c9ced6'
}
