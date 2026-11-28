import type { Segment } from '@/types/dashboard.types'

/**
 * Calculates the total sum of all values in a segment array.
 */
export function sumSegments(segments?: Segment[]): number {
  if (!segments || segments.length === 0) {
    return 0
  }
  return segments.reduce((sum, seg) => sum + (seg.value || 0), 0)
}

/**
 * Calculates the percentage of a segment relative to the total sum.
 */
export function getSegmentPercent(value: number, sum: number): number {
  if (sum <= 0 || value <= 0) {
    return 0
  }
  return (value / sum) * 100
}

/**
 * Formats segment data for tooltip presentation with one decimal place.
 */
export function formatSegmentTooltip(segment: Segment, sum: number): string {
  if (sum <= 0) {
    return `${segment.label}: ${segment.value}`
  }
  const pct = getSegmentPercent(segment.value, sum).toFixed(1)
  return `${segment.label}: ${segment.value} (${pct}%)`
}
