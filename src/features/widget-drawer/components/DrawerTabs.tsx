import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCategories } from '@/features/dashboard/selectors'
import { setActiveTab } from '@/features/widget-drawer/drawerSlice'
import { selectActiveTab } from '@/features/widget-drawer/selectors'
import type { CategoryId } from '@/types/dashboard.types'

export function DrawerTabs() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const activeTab = useAppSelector(selectActiveTab)

  return (
    <div
      role="tablist"
      aria-label="Widget Categories"
      className="flex border-b border-slate-200 px-6"
    >
      {categories.map((cat) => {
        const isActive = activeTab === cat.id
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            id={`tab-${cat.id}`}
            aria-controls={`tabpanel-${cat.id}`}
            onClick={() => dispatch(setActiveTab(cat.id as CategoryId))}
            className={`border-b-2 px-4 py-3 text-xs transition ${
              isActive
                ? 'border-navy font-bold text-navy'
                : 'border-transparent font-medium text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat.tabLabel}
          </button>
        )
      })}
    </div>
  )
}
