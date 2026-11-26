import { createSelector } from '@reduxjs/toolkit'
import {
  selectCategories,
  selectCategoryById,
} from '@/features/dashboard/selectors'
import type { DashboardState } from '@/features/dashboard/dashboardSlice'
import type {
  DraftWidget,
  DrawerState,
} from '@/features/widget-drawer/drawerSlice'
import type { Category, CategoryId } from '@/types/dashboard.types'

export interface RootDrawerState {
  dashboard: DashboardState
  drawer: DrawerState
}

export interface DrawerRow {
  id: string
  name: string
  checked: boolean
  isNew: boolean
}

export interface CategorizedDrawerRow extends DrawerRow {
  categoryId: CategoryId
  categoryTabLabel: string
}

export const selectIsDrawerOpen = (state: RootDrawerState): boolean =>
  state.drawer.isOpen

export const selectActiveTab = (state: RootDrawerState): CategoryId =>
  state.drawer.activeTab

export const selectDraftActive = (
  state: RootDrawerState
): Record<string, boolean> => state.drawer.draftActive

export const selectDraftNewWidgets = (state: RootDrawerState): DraftWidget[] =>
  state.drawer.draftNewWidgets

export function buildDrawerRowsForCategory(
  category: Category | undefined,
  tabId: CategoryId,
  draftActive: Record<string, boolean>,
  draftNewWidgets: DraftWidget[]
): DrawerRow[] {
  const existingRows: DrawerRow[] = []
  if (category) {
    for (const w of category.widgets) {
      const checked = Object.prototype.hasOwnProperty.call(draftActive, w.id)
        ? draftActive[w.id]
        : w.isActive
      existingRows.push({
        id: w.id,
        name: w.name,
        checked,
        isNew: false,
      })
    }
  }

  const newRows: DrawerRow[] = draftNewWidgets
    .filter((dw) => dw.categoryId === tabId)
    .map((dw) => ({
      id: dw.id,
      name: dw.name,
      checked: Object.prototype.hasOwnProperty.call(draftActive, dw.id)
        ? draftActive[dw.id]
        : true,
      isNew: true,
    }))

  return [...existingRows, ...newRows]
}

export const selectDrawerRows = createSelector(
  [
    (state: RootDrawerState, tabId: CategoryId) =>
      selectCategoryById(state, tabId),
    selectDraftActive,
    selectDraftNewWidgets,
    (_state: RootDrawerState, tabId: CategoryId) => tabId,
  ],
  (category, draftActive, draftNewWidgets, tabId): DrawerRow[] => {
    return buildDrawerRowsForCategory(
      category,
      tabId,
      draftActive,
      draftNewWidgets
    )
  }
)

export const selectAllDrawerRows = createSelector(
  [selectCategories, selectDraftActive, selectDraftNewWidgets],
  (categories, draftActive, draftNewWidgets): CategorizedDrawerRow[] => {
    const allRows: CategorizedDrawerRow[] = []

    for (const category of categories) {
      const rows = buildDrawerRowsForCategory(
        category,
        category.id,
        draftActive,
        draftNewWidgets
      )

      for (const row of rows) {
        allRows.push({
          ...row,
          categoryId: category.id,
          categoryTabLabel: category.tabLabel,
        })
      }
    }

    return allRows
  }
)
