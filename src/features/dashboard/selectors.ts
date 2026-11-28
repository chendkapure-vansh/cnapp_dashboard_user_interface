import { createSelector } from '@reduxjs/toolkit'
import type { Category, CategoryId, Widget } from '@/types/dashboard.types'

interface DashboardSliceState {
  dashboard: {
    categories: Category[]
  }
}

/**
 * Pair of a widget and the parent category identifier it belongs to.
 */
export interface CategorizedWidget {
  categoryId: CategoryId
  widget: Widget
}

/**
 * Selects all category groups from the dashboard state.
 */
export const selectCategories = (state: DashboardSliceState): Category[] =>
  state.dashboard.categories

/**
 * Selects a specific category by its unique ID.
 */
export const selectCategoryById = (
  state: DashboardSliceState,
  categoryId: CategoryId
): Category | undefined =>
  state.dashboard.categories.find((category) => category.id === categoryId)

/**
 * Selects only active widgets for a specified category.
 */
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

/**
 * Selects all widgets across all categories mapped with their category IDs.
 */
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
