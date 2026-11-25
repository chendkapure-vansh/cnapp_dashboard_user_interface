import { createSelector } from '@reduxjs/toolkit'
import { selectCategoryById } from '@/features/dashboard/selectors'
import type { DashboardState } from '@/features/dashboard/dashboardSlice'
import type { DrawerState } from '@/features/widget-drawer/drawerSlice'
import type { CategoryId } from '@/types/dashboard.types'

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

export const selectIsDrawerOpen = (state: RootDrawerState): boolean =>
  state.drawer.isOpen

export const selectActiveTab = (state: RootDrawerState): CategoryId =>
  state.drawer.activeTab

export const selectDraftActive = (
  state: RootDrawerState
): Record<string, boolean> => state.drawer.draftActive

export const selectDraftNewWidgets = (
  state: RootDrawerState
): RootDrawerState['drawer']['draftNewWidgets'] => state.drawer.draftNewWidgets

export const selectDrawerRows = createSelector(
  [
    (state: RootDrawerState, tabId: CategoryId) =>
      selectCategoryById(state, tabId),
    selectDraftActive,
    selectDraftNewWidgets,
    (_state: RootDrawerState, tabId: CategoryId) => tabId,
  ],
  (category, draftActive, draftNewWidgets, tabId): DrawerRow[] => {
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
)
