import { X } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import { closeDrawer } from '@/features/widget-drawer/drawerSlice'

/**
 * Header of the Add Widget drawer with title and dismiss button.
 */
export function DrawerHeader() {
  const dispatch = useAppDispatch()

  return (
    <div className="flex h-12 items-center justify-between bg-navy px-6 text-white">
      <h2 id="drawer-title" className="text-sm font-semibold tracking-wide">
        Add Widget
      </h2>
      <button
        type="button"
        onClick={() => dispatch(closeDrawer())}
        aria-label="Close"
        title="Close"
        className="rounded p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  )
}
