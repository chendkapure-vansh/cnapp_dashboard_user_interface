import { type KeyboardEvent, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCategories } from '@/features/dashboard/selectors'
import { setActiveTab } from '@/features/widget-drawer/drawerSlice'
import { selectActiveTab } from '@/features/widget-drawer/selectors'
import type { CategoryId } from '@/types/dashboard.types'

/**
 * Category tab bar for the drawer with keyboard arrow navigation and ARIA tab roles.
 */
export function DrawerTabs() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const activeTab = useAppSelector(selectActiveTab)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(
    e: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % categories.length
      const nextCategory = categories[nextIndex]
      dispatch(setActiveTab(nextCategory.id as CategoryId))
      tabRefs.current[nextIndex]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex =
        (currentIndex - 1 + categories.length) % categories.length
      const prevCategory = categories[prevIndex]
      dispatch(setActiveTab(prevCategory.id as CategoryId))
      tabRefs.current[prevIndex]?.focus()
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Widget Categories"
      className="flex border-b border-slate-200 px-6"
    >
      {categories.map((cat, index) => {
        const isActive = activeTab === cat.id
        return (
          <button
            key={cat.id}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            id={`tab-${cat.id}`}
            aria-controls={`tabpanel-${cat.id}`}
            onClick={() => dispatch(setActiveTab(cat.id as CategoryId))}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`border-b-2 px-4 py-3 text-xs transition outline-none focus-visible:ring-2 focus-visible:ring-navy ${
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
