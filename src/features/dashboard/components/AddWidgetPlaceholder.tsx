import { useAppDispatch } from '@/app/hooks'
import { openDrawer } from '@/features/widget-drawer/drawerSlice'
import type { CategoryId } from '@/types/dashboard.types'

interface AddWidgetPlaceholderProps {
  categoryId: CategoryId
}

/**
 * Displays an empty-state placeholder card at the end of a category grid.
 * Clicking the button opens the widget drawer pre-selected to this category.
 */
export function AddWidgetPlaceholder({
  categoryId,
}: AddWidgetPlaceholderProps) {
  const dispatch = useAppDispatch()

  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[16px] border border-dashed border-slate-300 bg-white/70 p-6 shadow-sm transition hover:bg-white">
      <button
        type="button"
        // Pass the category ID so the drawer automatically opens on the corresponding tab
        onClick={() => dispatch(openDrawer(categoryId))}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 shadow-xs transition hover:border-slate-400 hover:text-slate-700"
      >
        + Add Widget
      </button>
    </div>
  )
}
