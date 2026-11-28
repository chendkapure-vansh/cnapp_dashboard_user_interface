import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { CategoryId } from '@/types/dashboard.types'

/**
 * Represents a newly authored widget held in drawer draft state before confirmation.
 */
export interface DraftWidget {
  id: string
  categoryId: CategoryId
  name: string
  text: string
}

/**
 * State for the Add Widget sliding drawer, active category tab, and unconfirmed drafts.
 */
export interface DrawerState {
  isOpen: boolean
  activeTab: CategoryId
  draftActive: Record<string, boolean>
  draftNewWidgets: DraftWidget[]
}

const initialState: DrawerState = {
  isOpen: false,
  activeTab: 'cspm',
  draftActive: {},
  draftNewWidgets: [],
}

interface AddDraftWidgetPreparePayload {
  categoryId: CategoryId
  name: string
  text: string
}

interface AddDraftWidgetActionPayload {
  id: string
  categoryId: CategoryId
  name: string
  text: string
}

/**
 * Redux slice handling the widget management drawer and its draft changes.
 */
export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<CategoryId>) {
      state.isOpen = true
      state.activeTab = action.payload
      // Reset draft edits whenever drawer is opened
      state.draftActive = {}
      state.draftNewWidgets = []
    },
    closeDrawer(state) {
      state.isOpen = false
      // Discard unconfirmed drafts on close/cancel
      state.draftActive = {}
      state.draftNewWidgets = []
    },
    setActiveTab(state, action: PayloadAction<CategoryId>) {
      state.activeTab = action.payload
    },
    toggleDraftWidget(state, action: PayloadAction<string>) {
      const widgetId = action.payload
      const currentVal = state.draftActive[widgetId]
      state.draftActive[widgetId] = !currentVal
    },
    setDraftActive(
      state,
      action: PayloadAction<{ widgetId: string; active: boolean }>
    ) {
      state.draftActive[action.payload.widgetId] = action.payload.active
    },
    addDraftWidget: {
      reducer(state, action: PayloadAction<AddDraftWidgetActionPayload>) {
        const { categoryId, id, name, text } = action.payload
        if (!name || !text) {
          return
        }

        state.draftNewWidgets.push({
          id,
          categoryId,
          name,
          text,
        })
        state.draftActive[id] = true
      },
      // Keep ID generation pure via nanoid in action preparation
      prepare(payload: AddDraftWidgetPreparePayload) {
        return {
          payload: {
            id: nanoid(),
            categoryId: payload.categoryId,
            name: payload.name.trim(),
            text: payload.text.trim(),
          },
        }
      },
    },
  },
})

export const {
  openDrawer,
  closeDrawer,
  setActiveTab,
  toggleDraftWidget,
  setDraftActive,
  addDraftWidget,
} = drawerSlice.actions

export default drawerSlice.reducer
