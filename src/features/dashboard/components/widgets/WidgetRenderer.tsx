import { lazy, Suspense } from 'react'
import { EmptyWidget } from '@/features/dashboard/components/widgets/EmptyWidget'
import { TextWidget } from '@/features/dashboard/components/widgets/TextWidget'
import type { Widget } from '@/types/dashboard.types'

// Lazy load chart components to keep large Recharts library out of the initial bundle
const LazyDonutWidget = lazy(() =>
  import('@/features/dashboard/components/widgets/DonutWidget').then((m) => ({
    default: m.DonutWidget,
  }))
)

// Lazy load stacked bar widget to optimize code splitting and chunk size
const LazyStackedBarWidget = lazy(() =>
  import('@/features/dashboard/components/widgets/StackedBarWidget').then(
    (m) => ({
      default: m.StackedBarWidget,
    })
  )
)

function WidgetSkeleton() {
  return (
    <div
      data-testid="widget-skeleton"
      className="flex h-36 w-full items-center justify-center"
    >
      <div className="h-28 w-full animate-pulse rounded-lg bg-slate-100" />
    </div>
  )
}

interface WidgetRendererProps {
  widget: Widget
}

/**
 * Dynamically renders the appropriate widget content component based on widget.type.
 */
export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'donut':
      return (
        <Suspense fallback={<WidgetSkeleton />}>
          <LazyDonutWidget widget={widget} />
        </Suspense>
      )
    case 'stackedBar':
      return (
        <Suspense fallback={<WidgetSkeleton />}>
          <LazyStackedBarWidget widget={widget} />
        </Suspense>
      )
    case 'empty':
      return <EmptyWidget message={widget.message} />
    case 'text':
      return <TextWidget text={widget.text} />
    default: {
      const _exhaustiveCheck: never = widget
      return _exhaustiveCheck
    }
  }
}
