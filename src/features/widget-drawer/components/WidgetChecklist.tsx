import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCategoryById } from '@/features/dashboard/selectors'
import { setDraftActive } from '@/features/widget-drawer/drawerSlice'
import {
  selectActiveTab,
  selectDraftActive,
  selectDrawerRows,
} from '@/features/widget-drawer/selectors'

export function WidgetChecklist() {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector(selectActiveTab)
  const category = useAppSelector((state) =>
    selectCategoryById(state, activeTab)
  )
  const draftActive = useAppSelector(selectDraftActive)
  const rows = useAppSelector((state) => selectDrawerRows(state, activeTab))

  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No widgets in this category yet.
      </div>
    )
  }

  function handleToggle(widgetId: string) {
    let currentVal: boolean
    if (Object.prototype.hasOwnProperty.call(draftActive, widgetId)) {
      currentVal = draftActive[widgetId]
    } else {
      const widget = category?.widgets.find((w) => w.id === widgetId)
      currentVal = widget ? widget.isActive : true
    }
    dispatch(setDraftActive({ widgetId, active: !currentVal }))
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      className="space-y-2.5"
    >
      {rows.map((row) => (
        <label
          key={row.id}
          className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 transition hover:border-slate-300 hover:bg-slate-50/50"
        >
          <input
            type="checkbox"
            checked={row.checked}
            onChange={() => handleToggle(row.id)}
            className="h-4 w-4 rounded border-slate-300 text-navy accent-navy focus:ring-navy"
          />
          <span className="font-medium">{row.name}</span>
          {row.isNew && (
            <span className="rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-semibold text-navy">
              New
            </span>
          )}
        </label>
      ))}
    </div>
  )
}
