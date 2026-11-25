import { X } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import { WidgetRenderer } from '@/features/dashboard/components/widgets/WidgetRenderer'
import { removeWidget } from '@/features/dashboard/dashboardSlice'
import type { CategoryId, Widget } from '@/types/dashboard.types'

interface WidgetCardProps {
  categoryId: CategoryId
  widget: Widget
}

export function WidgetCard({ categoryId, widget }: WidgetCardProps) {
  const dispatch = useAppDispatch()

  function handleRemove() {
    dispatch(removeWidget({ categoryId, widgetId: widget.id }))
  }

  return (
    <div className="group relative flex min-h-[220px] flex-col rounded-[16px] bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-bold text-slate-900">{widget.name}</h3>

        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${widget.name}`}
          className="rounded p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-2 flex flex-1 items-center justify-center">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  )
}
