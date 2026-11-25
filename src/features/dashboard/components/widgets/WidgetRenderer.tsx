import { DonutWidget } from '@/features/dashboard/components/widgets/DonutWidget'
import { EmptyWidget } from '@/features/dashboard/components/widgets/EmptyWidget'
import { StackedBarWidget } from '@/features/dashboard/components/widgets/StackedBarWidget'
import { TextWidget } from '@/features/dashboard/components/widgets/TextWidget'
import type { Widget } from '@/types/dashboard.types'

interface WidgetRendererProps {
  widget: Widget
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'donut':
      return <DonutWidget widget={widget} />
    case 'stackedBar':
      return <StackedBarWidget widget={widget} />
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
