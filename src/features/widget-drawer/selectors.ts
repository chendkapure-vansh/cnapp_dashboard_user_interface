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

/**
 * Root state interface required by drawer selectors.
 */
export interface RootDrawerState {
  dashboard: DashboardState
  drawer: DrawerState
}

/**
 * Representation of a single widget item in the drawer checklist.
 */
export interface DrawerRow {
  id: string
  name: string
  checked: boolean
  isNew: boolean
}

/**
 * Checklist item enhanced with category metadata for global drawer search results.
 */
export interface CategorizedDrawerRow extends DrawerRow {
  categoryId: CategoryId
  categoryTabLabel: string
}

/**
 * Selects whether the Add Widget drawer is currently open.
 */
export const selectIsDrawerOpen = (state: RootDrawerState): boolean =>
  state.drawer.isOpen

/**
 * Selects the active category tab in the drawer.
 */
export const selectActiveTab = (state: RootDrawerState): CategoryId =>
  state.drawer.activeTab

/**
 * Selects the staged active checkbox states before user confirmation.
 */
export const selectDraftActive = (
  state: RootDrawerState
): Record<string, boolean> => state.drawer.draftActive

/**
 * Selects the list of newly drafted widgets created in the current drawer session.
 */
export const selectDraftNewWidgets = (state: RootDrawerState): DraftWidget[] =>
  state.drawer.draftNewWidgets

/**
 * Pure helper function building checklist rows combining existing category widgets and drafted additions.
 */
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

/**
 * Memoized selector returning all checklist rows for a specific category tab.
 */
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

/**
 * Memoized selector returning checklist rows across all categories for drawer search filtering.
 */
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
