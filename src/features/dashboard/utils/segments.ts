import type { Segment } from '@/types/dashboard.types'

export function sumSegments(segments?: Segment[]): number {
  if (!segments || segments.length === 0) {
    return 0
  }
  return segments.reduce((sum, seg) => sum + (seg.value || 0), 0)
}

export function getSegmentPercent(value: number, sum: number): number {
  if (sum <= 0 || value <= 0) {
    return 0
  }
  return (value / sum) * 100
}
