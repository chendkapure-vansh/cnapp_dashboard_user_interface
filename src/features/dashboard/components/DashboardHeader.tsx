import { MoreVertical } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import { RefreshButton } from '@/features/dashboard/components/RefreshButton'
import { TimeRangeDropdown } from '@/features/dashboard/components/TimeRangeDropdown'
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

        <RefreshButton />

        <button
          type="button"
          aria-label="More options"
          title="More options"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-navy"
        >
          <MoreVertical size={15} />
        </button>

        <TimeRangeDropdown />
      </div>
    </div>
  )
}
