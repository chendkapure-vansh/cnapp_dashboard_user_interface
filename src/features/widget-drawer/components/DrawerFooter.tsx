import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { confirmDrawer } from '@/features/widget-drawer/confirmDrawer'
import { closeDrawer } from '@/features/widget-drawer/drawerSlice'

export function DrawerFooter() {
  const dispatch = useAppDispatch()
  const dashboard = useAppSelector((state) => state.dashboard)
  const drawer = useAppSelector((state) => state.drawer)
  const search = useAppSelector((state) => state.search)

  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white p-4">
      <button
        type="button"
        onClick={() => dispatch(closeDrawer())}
        className="rounded-md border border-navy px-5 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => confirmDrawer(dispatch, { dashboard, drawer, search })}
        className="rounded-md bg-navy px-5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-navy/90"
      >
        Confirm
      </button>
    </div>
  )
}
