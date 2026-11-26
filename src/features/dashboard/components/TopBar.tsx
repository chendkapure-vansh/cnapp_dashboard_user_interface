import { Bell, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  selectDashboardQuery,
  setDashboardQuery,
} from '@/features/search/searchSlice'

export function TopBar() {
  const dispatch = useAppDispatch()
  const dashboardQuery = useAppSelector(selectDashboardQuery)

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-grey/40 bg-white px-6">
      <nav aria-label="Breadcrumb" className="text-xs text-grey">
        <span className="text-slate-400">Home</span>
        <span className="mx-2 text-slate-400">&gt;</span>
        <span className="font-semibold text-navy">Dashboard V2</span>
      </nav>

      <div className="relative w-80 max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
          aria-hidden="true"
        />
        <input
          type="search"
          value={dashboardQuery}
          onChange={(e) => dispatch(setDashboardQuery(e.target.value))}
          aria-label="Search dashboard widgets"
          placeholder="Search anything..."
          className="h-8 w-full rounded-md border border-slate-200 bg-canvas/60 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-canvas hover:text-navy"
        >
          <Bell size={18} />
        </button>

        <div
          role="img"
          aria-label="User avatar"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-xs font-semibold text-navy"
        >
          JD
        </div>
      </div>
    </header>
  )
}
