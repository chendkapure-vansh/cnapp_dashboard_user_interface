import { createSelector } from '@reduxjs/toolkit'
import type { Category, CategoryId, Widget } from '@/types/dashboard.types'

interface DashboardSliceState {
  dashboard: {
    categories: Category[]
  }
}

export interface CategorizedWidget {
  categoryId: CategoryId
  widget: Widget
}

export const selectCategories = (state: DashboardSliceState): Category[] =>
  state.dashboard.categories

export const selectCategoryById = (
  state: DashboardSliceState,
  categoryId: CategoryId
): Category | undefined =>
  state.dashboard.categories.find((category) => category.id === categoryId)

export const selectActiveWidgets = createSelector(
  [
    selectCategories,
    (_state: DashboardSliceState, categoryId: CategoryId) => categoryId,
  ],
  (categories, categoryId): Widget[] => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) {
      return []
    }
    return category.widgets.filter((widget) => widget.isActive)
  }
)

export const selectAllWidgets = createSelector(
  [selectCategories],
  (categories): CategorizedWidget[] => {
    return categories.flatMap((category) =>
      category.widgets.map((widget) => ({
        categoryId: category.id,
        widget,
      }))
    )
  }
)
