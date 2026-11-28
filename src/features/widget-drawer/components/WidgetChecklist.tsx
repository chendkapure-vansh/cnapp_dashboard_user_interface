import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCategoryById } from '@/features/dashboard/selectors'
import { setDraftActive } from '@/features/widget-drawer/drawerSlice'
import {
  selectAllDrawerRows,
  selectDrawerRows,
} from '@/features/widget-drawer/selectors'
import { filterWidgetsByQuery } from '@/utils/searchWidgets'
import type { CategoryId } from '@/types/dashboard.types'

interface WidgetChecklistProps {
  activeTab: CategoryId
  searchQuery: string
}

/**
 * Interactive checklist displaying widgets for the active category or grouped search results.
 */
export function WidgetChecklist({
  activeTab,
  searchQuery,
}: WidgetChecklistProps) {
  const dispatch = useAppDispatch()
  const category = useAppSelector((state) =>
    selectCategoryById(state, activeTab)
  )
  const tabRows = useAppSelector((state) => selectDrawerRows(state, activeTab))
  const allRows = useAppSelector(selectAllDrawerRows)

  const isSearching = searchQuery.trim().length > 0

  function handleToggle(widgetId: string, currentVal: boolean) {
    dispatch(setDraftActive({ widgetId, active: !currentVal }))
  }

  if (isSearching) {
    const filtered = filterWidgetsByQuery(allRows, searchQuery)
    if (filtered.length === 0) {
      return (
        <div
          role="status"
          aria-live="polite"
          className="py-8 text-center text-xs text-slate-400"
        >
          No widgets found.
        </div>
      )
    }

    const grouped = new Map<string, typeof filtered>()
    for (const row of filtered) {
      const list = grouped.get(row.categoryTabLabel) || []
      list.push(row)
      grouped.set(row.categoryTabLabel, list)
    }

    return (
      <div className="space-y-4">
        {Array.from(grouped.entries()).map(([tabLabel, rows]) => (
          <div key={tabLabel} className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {tabLabel}
            </h4>
            <div className="space-y-2">
              {rows.map((row) => (
                <label
                  key={row.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 transition hover:border-slate-300 hover:bg-slate-50/50"
                >
                  <input
                    type="checkbox"
                    checked={row.checked}
                    aria-label={row.name}
                    onChange={() => handleToggle(row.id, row.checked)}
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
          </div>
        ))}
      </div>
    )
  }

  if (tabRows.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No widgets in this category yet.
      </div>
    )
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      className="space-y-2.5"
    >
      {tabRows.map((row) => (
        <label
          key={row.id}
          className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 transition hover:border-slate-300 hover:bg-slate-50/50"
        >
          <input
            type="checkbox"
            checked={row.checked}
            aria-label={row.name}
            onChange={() => {
              const widget = category?.widgets.find((w) => w.id === row.id)
              const currentVal = widget ? widget.isActive : row.checked
              handleToggle(row.id, currentVal)
            }}
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
