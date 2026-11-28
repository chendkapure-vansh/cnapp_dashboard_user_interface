import { EmptyWidget } from '@/features/dashboard/components/widgets/EmptyWidget'
import { getColorHex } from '@/features/dashboard/utils/colorMap'
import {
  formatSegmentTooltip,
  getSegmentPercent,
  sumSegments,
} from '@/features/dashboard/utils/segments'
import type { StackedBarWidget as StackedBarWidgetType } from '@/types/dashboard.types'

interface StackedBarWidgetProps {
  widget: StackedBarWidgetType
}

/**
 * Renders a segmented horizontal progress bar with hover tooltips and category legends.
 */
export function StackedBarWidget({ widget }: StackedBarWidgetProps) {
  const sum = sumSegments(widget.segments)
  if (widget.segments.length === 0 || sum === 0) {
    return <EmptyWidget message="No Graph data available!" />
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-slate-900">{widget.total}</span>
        <span className="text-xs font-medium text-slate-500">
          {widget.totalLabel}
        </span>
      </div>

      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
        {widget.segments.map((seg) => {
          const percent = getSegmentPercent(seg.value, sum)
          if (percent === 0) {
            return null
          }
          return (
            <div
              key={seg.label}
              data-testid={`bar-segment-${seg.label}`}
              title={formatSegmentTooltip(seg, sum)}
              style={{
                width: `${percent}%`,
                backgroundColor: getColorHex(seg.color),
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-600">
        {widget.segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: getColorHex(seg.color) }}
            />
            <span className="truncate font-medium text-slate-700">
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
