import { useAppSelector } from '@/app/hooks'
import { AddWidgetPlaceholder } from '@/features/dashboard/components/AddWidgetPlaceholder'
import { WidgetCard } from '@/features/dashboard/components/WidgetCard'
import { selectActiveWidgets } from '@/features/dashboard/selectors'
import { selectDashboardQuery } from '@/features/search/searchSlice'
import type { Category } from '@/types/dashboard.types'
import { filterWidgetsByQuery } from '@/utils/searchWidgets'

interface CategorySectionProps {
  category: Category
}

/**
 * Renders a categorized section containing widget cards and an add-widget placeholder.
 */
export function CategorySection({ category }: CategorySectionProps) {
  const activeWidgets = useAppSelector((state) =>
    selectActiveWidgets(state, category.id)
  )
  const dashboardQuery = useAppSelector(selectDashboardQuery)
  const isSearching = dashboardQuery.trim().length > 0

  const displayedWidgets = isSearching
    ? filterWidgetsByQuery(activeWidgets, dashboardQuery)
    : activeWidgets

  return (
    <section className="space-y-2">
      <h2 className="text-xs font-bold tracking-tight text-slate-800">
        {category.name}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedWidgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            categoryId={category.id}
            widget={widget}
          />
        ))}

        {!isSearching && <AddWidgetPlaceholder categoryId={category.id} />}
      </div>
    </section>
  )
}
