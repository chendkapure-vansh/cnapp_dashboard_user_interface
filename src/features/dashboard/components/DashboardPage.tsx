import { useAppSelector } from '@/app/hooks'
import { CategorySection } from '@/features/dashboard/components/CategorySection'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { TopBar } from '@/features/dashboard/components/TopBar'
import { selectCategories } from '@/features/dashboard/selectors'
import { shouldShowCategory } from '@/features/dashboard/utils/categoryVisibility'
import { AddWidgetDrawer } from '@/features/widget-drawer/components/AddWidgetDrawer'

export function DashboardPage() {
  const categories = useAppSelector(selectCategories)
  const visibleCategories = categories.filter(shouldShowCategory)

  return (
    <div className="min-h-screen bg-canvas font-sans text-slate-900">
      <TopBar />

      <main className="mx-auto max-w-[1440px] space-y-6 px-6 pb-12">
        <DashboardHeader />

        <div className="space-y-6">
          {visibleCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      </main>

      <AddWidgetDrawer />
    </div>
  )
}
