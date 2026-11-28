import { describe, expect, it } from 'vitest'
import {
  getSegmentPercent,
  sumSegments,
} from '@/features/dashboard/utils/segments'
import type { Segment } from '@/types/dashboard.types'

// Tests for segment utility functions sumSegments and getSegmentPercent
describe('segments utils', () => {
  it('sumSegments calculates total value of segments correctly', () => {
    const segments: Segment[] = [
      { label: 'A', value: 10, color: 'blue' },
      { label: 'B', value: 25, color: 'red' },
      { label: 'C', value: 65, color: 'green' },
    ]
    expect(sumSegments(segments)).toBe(100)
  })

  it('sumSegments handles empty or undefined segments gracefully', () => {
    expect(sumSegments([])).toBe(0)
    expect(sumSegments(undefined)).toBe(0)
  })

  it('getSegmentPercent returns proportional percentage', () => {
    expect(getSegmentPercent(25, 100)).toBe(25)
    expect(getSegmentPercent(50, 200)).toBe(25)
  })

  it('getSegmentPercent handles zero sum or zero value safely without division by zero', () => {
    expect(getSegmentPercent(10, 0)).toBe(0)
    expect(getSegmentPercent(0, 100)).toBe(0)
    expect(getSegmentPercent(0, 0)).toBe(0)
  })
})
