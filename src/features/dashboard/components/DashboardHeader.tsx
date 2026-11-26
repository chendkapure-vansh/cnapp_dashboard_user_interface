import { ChevronDown, Clock, MoreVertical, RotateCw } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import { openDrawer } from '@/features/widget-drawer/drawerSlice'

export function DashboardHeader() {
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <h1 className="text-xl font-semibold tracking-tight text-navy">
        CNAPP Dashboard
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(openDrawer('cspm'))}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50"
        >
          Add Widget +
        </button>

        <button
          type="button"
          aria-label="Refresh dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-navy"
        >
          <RotateCw size={15} />
        </button>

        <button
          type="button"
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-navy"
        >
          <MoreVertical size={15} />
        </button>

        <button
          type="button"
          aria-label="Time filter: Last 2 days"
          className="flex items-center gap-1.5 rounded-md border border-navy bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-xs transition hover:bg-navy/5"
        >
          <Clock size={14} className="text-navy" />
          <span>Last 2 days</span>
          <ChevronDown size={14} className="text-navy" />
        </button>
      </div>
    </div>
  )
}
