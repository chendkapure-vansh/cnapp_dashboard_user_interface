import { useAppSelector } from '@/app/hooks'
import { AddWidgetPlaceholder } from '@/features/dashboard/components/AddWidgetPlaceholder'
import { WidgetCard } from '@/features/dashboard/components/WidgetCard'
import { selectActiveWidgets } from '@/features/dashboard/selectors'
import type { Category } from '@/types/dashboard.types'

interface CategorySectionProps {
  category: Category
}

export function CategorySection({ category }: CategorySectionProps) {
  const activeWidgets = useAppSelector((state) =>
    selectActiveWidgets(state, category.id)
  )

  return (
    <section className="space-y-2">
      <h2 className="text-xs font-bold tracking-tight text-slate-800">
        {category.name}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeWidgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            categoryId={category.id}
            widget={widget}
          />
        ))}

        <AddWidgetPlaceholder />
      </div>
    </section>
  )
}
