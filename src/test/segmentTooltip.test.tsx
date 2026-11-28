import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StackedBarWidget } from '@/features/dashboard/components/widgets/StackedBarWidget'
import { formatSegmentTooltip } from '@/features/dashboard/utils/segments'
import type { Segment, StackedBarWidget as StackedBarWidgetType } from '@/types/dashboard.types'

describe('formatSegmentTooltip and StackedBarWidget tooltips', () => {
  it('formatSegmentTooltip handles normal case, zero sum, and one-decimal rounding', () => {
    const seg: Segment = { label: 'Critical', value: 9, color: 'darkRed' }

    // Normal case with rounding: 9 out of 10 is 90.0%
    expect(formatSegmentTooltip(seg, 10)).toBe('Critical: 9 (90.0%)')

    // Normal case with fraction: 9 out of 27 is 33.333... -> 33.3%
    expect(formatSegmentTooltip(seg, 27)).toBe('Critical: 9 (33.3%)')

    // Zero sum: should return "Label: value"
    expect(formatSegmentTooltip(seg, 0)).toBe('Critical: 9')

    // Negative sum fallback:
    expect(formatSegmentTooltip(seg, -5)).toBe('Critical: 9')
  })

  it('renders bar segments with title attribute containing formatted tooltip', () => {
    const widget: StackedBarWidgetType = {
      id: 'test-stacked',
      name: 'Test Stacked Bar',
      isActive: true,
      type: 'stackedBar',
      total: 10,
      totalLabel: 'Alerts',
      segments: [
        { label: 'Critical', value: 3, color: 'red' },
        { label: 'Warning', value: 7, color: 'orange' },
      ],
    }

    render(<StackedBarWidget widget={widget} />)

    const criticalSeg = screen.getByTestId('bar-segment-Critical')
    expect(criticalSeg).toHaveAttribute('title', 'Critical: 3 (30.0%)')

    const warningSeg = screen.getByTestId('bar-segment-Warning')
    expect(warningSeg).toHaveAttribute('title', 'Warning: 7 (70.0%)')
  })
})
