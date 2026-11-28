import { useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { EmptyWidget } from '@/features/dashboard/components/widgets/EmptyWidget'
import { getColorHex } from '@/features/dashboard/utils/colorMap'
import {
  formatSegmentTooltip,
  sumSegments,
} from '@/features/dashboard/utils/segments'
import type { DonutWidget as DonutWidgetType, Segment } from '@/types/dashboard.types'

interface DonutWidgetProps {
  widget: DonutWidgetType
}

/**
 * Renders a circular Donut chart with total count at center, hovered segment text above, and legend.
 */
export function DonutWidget({ widget }: DonutWidgetProps) {
  const [hoveredSegment, setHoveredSegment] = useState<Segment | null>(null)

  const sum = sumSegments(widget.segments)
  if (widget.segments.length === 0 || sum === 0) {
    return <EmptyWidget message="No Graph data available!" />
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-around gap-4 sm:flex-row">
      <div className="flex flex-col items-center">
        {/* Direct text displayed directly above the circular wheel without box */}
        <div className="h-4 text-[11px] font-semibold text-slate-700">
          {hoveredSegment ? formatSegmentTooltip(hoveredSegment, sum) : null}
        </div>

        <div className="relative flex h-[140px] w-[140px] shrink-0 items-center justify-center">
          <PieChart width={140} height={140}>
            <Pie
              data={widget.segments}
              dataKey="value"
              nameKey="label"
              cx={70}
              cy={70}
              innerRadius={45}
              outerRadius={65}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              stroke="none"
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {widget.segments.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={getColorHex(entry.color)}
                  onMouseEnter={() => setHoveredSegment(entry)}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-slate-800">
              {widget.total}
            </span>
            <span className="text-[10px] font-medium text-slate-400">Total</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-slate-600">
        {widget.segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: getColorHex(seg.color) }}
            />
            <span className="font-medium text-slate-700">
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
