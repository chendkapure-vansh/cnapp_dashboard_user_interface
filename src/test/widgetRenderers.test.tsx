import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WidgetRenderer } from '@/features/dashboard/components/widgets/WidgetRenderer'
import type {
  DonutWidget,
  EmptyWidget,
  StackedBarWidget,
  TextWidget,
} from '@/types/dashboard.types'

describe('WidgetRenderers', () => {
  it('Donut shows its total ("2", "9659") and legend text', () => {
    const donut1: DonutWidget = {
      id: 'cloud-accounts',
      name: 'Cloud Accounts',
      isActive: true,
      type: 'donut',
      total: 2,
      segments: [
        { label: 'Connected', value: 2, color: 'blue' },
        { label: 'Not Connected', value: 2, color: 'lightBlue' },
      ],
    }

    const { rerender } = render(<WidgetRenderer widget={donut1} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Connected (2)')).toBeInTheDocument()
    expect(screen.getByText('Not Connected (2)')).toBeInTheDocument()

    const donut2: DonutWidget = {
      id: 'risk-assessment',
      name: 'Cloud Account Risk Assessment',
      isActive: true,
      type: 'donut',
      total: 9659,
      segments: [
        { label: 'Failed', value: 1689, color: 'red' },
        { label: 'Warning', value: 681, color: 'amber' },
        { label: 'Not available', value: 36, color: 'grey' },
        { label: 'Passed', value: 7253, color: 'green' },
      ],
    }

    rerender(<WidgetRenderer widget={donut2} />)
    expect(screen.getByText('9659')).toBeInTheDocument()
    expect(screen.getByText('Failed (1689)')).toBeInTheDocument()
    expect(screen.getByText('Passed (7253)')).toBeInTheDocument()
  })

  it('StackedBar shows total, totalLabel, and legend values', () => {
    const bar: StackedBarWidget = {
      id: 'image-risk-assessment',
      name: 'Image Risk Assessment',
      isActive: true,
      type: 'stackedBar',
      total: 1470,
      totalLabel: 'Total Vulnerabilities',
      segments: [
        { label: 'Critical', value: 9, color: 'darkRed' },
        { label: 'High', value: 150, color: 'red' },
        { label: 'Medium', value: 640, color: 'orange' },
      ],
    }

    render(<WidgetRenderer widget={bar} />)
    expect(screen.getByText('1470')).toBeInTheDocument()
    expect(screen.getByText('Total Vulnerabilities')).toBeInTheDocument()
    expect(screen.getByText('Critical (9)')).toBeInTheDocument()
    expect(screen.getByText('High (150)')).toBeInTheDocument()
  })

  it('Bar segment widths sum to 100%', () => {
    const bar: StackedBarWidget = {
      id: 'bar-test',
      name: 'Bar Test',
      isActive: true,
      type: 'stackedBar',
      total: 100,
      totalLabel: 'Items',
      segments: [
        { label: 'Part1', value: 20, color: 'blue' },
        { label: 'Part2', value: 30, color: 'red' },
        { label: 'Part3', value: 50, color: 'green' },
      ],
    }

    render(<WidgetRenderer widget={bar} />)
    const seg1 = screen.getByTestId('bar-segment-Part1')
    const seg2 = screen.getByTestId('bar-segment-Part2')
    const seg3 = screen.getByTestId('bar-segment-Part3')

    const w1 = parseFloat(seg1.style.width)
    const w2 = parseFloat(seg2.style.width)
    const w3 = parseFloat(seg3.style.width)

    expect(w1 + w2 + w3).toBeCloseTo(100, 2)
  })

  it('Empty shows "No Graph data available!"', () => {
    const empty: EmptyWidget = {
      id: 'empty-1',
      name: 'Empty Widget',
      isActive: true,
      type: 'empty',
      message: 'No Graph data available!',
    }

    render(<WidgetRenderer widget={empty} />)
    expect(screen.getByText('No Graph data available!')).toBeInTheDocument()
  })

  it('Text widget shows its text', () => {
    const textWidget: TextWidget = {
      id: 'text-1',
      name: 'Text Widget',
      isActive: true,
      type: 'text',
      text: 'Sample descriptive text content',
    }

    render(<WidgetRenderer widget={textWidget} />)
    expect(
      screen.getByText('Sample descriptive text content')
    ).toBeInTheDocument()
  })

  it('Donut or bar with empty segments falls back to the empty message', () => {
    const emptyDonut: DonutWidget = {
      id: 'donut-empty',
      name: 'Empty Donut',
      isActive: true,
      type: 'donut',
      total: 0,
      segments: [],
    }

    const { rerender } = render(<WidgetRenderer widget={emptyDonut} />)
    expect(screen.getByText('No Graph data available!')).toBeInTheDocument()

    const emptyBar: StackedBarWidget = {
      id: 'bar-empty',
      name: 'Empty Bar',
      isActive: true,
      type: 'stackedBar',
      total: 0,
      totalLabel: 'Items',
      segments: [],
    }

    rerender(<WidgetRenderer widget={emptyBar} />)
    expect(screen.getByText('No Graph data available!')).toBeInTheDocument()

    const zeroSumDonut: DonutWidget = {
      id: 'donut-zero-sum',
      name: 'Zero Sum Donut',
      isActive: true,
      type: 'donut',
      total: 0,
      segments: [{ label: 'Zero', value: 0, color: 'blue' }],
    }

    rerender(<WidgetRenderer widget={zeroSumDonut} />)
    expect(screen.getByText('No Graph data available!')).toBeInTheDocument()
  })
})
