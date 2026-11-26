import { useAppSelector } from '@/app/hooks'
import { CategorySection } from '@/features/dashboard/components/CategorySection'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { TopBar } from '@/features/dashboard/components/TopBar'
import { selectCategories } from '@/features/dashboard/selectors'
import { shouldShowCategory } from '@/features/dashboard/utils/categoryVisibility'
import { selectDashboardQuery } from '@/features/search/searchSlice'
import { AddWidgetDrawer } from '@/features/widget-drawer/components/AddWidgetDrawer'

export function DashboardPage() {
  const categories = useAppSelector(selectCategories)
  const dashboardQuery = useAppSelector(selectDashboardQuery)

  const visibleCategories = categories.filter((cat) =>
    shouldShowCategory(cat, dashboardQuery)
  )

  const isSearching = dashboardQuery.trim().length > 0
  const hasNoMatches = isSearching && visibleCategories.length === 0

  return (
    <div className="min-h-screen bg-canvas font-sans text-slate-900">
      <TopBar />

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 pb-12 sm:px-6">
        <DashboardHeader />

        {hasNoMatches ? (
          <div
            role="status"
            aria-live="polite"
            className="py-16 text-center text-sm font-medium text-slate-400"
          >
            No widgets match your search.
          </div>
        ) : (
          <div className="space-y-6">
            {visibleCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
      </main>

      <AddWidgetDrawer />
    </div>
  )
}
