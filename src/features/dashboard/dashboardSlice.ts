import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type {
  Category,
  CategoryId,
  Dashboard,
  TextWidget,
  Widget,
} from '@/types/dashboard.types'
import { loadDashboard } from '@/utils/loadDashboard'

export type DashboardState = Dashboard

const initialState: DashboardState = loadDashboard()

interface AddWidgetPreparePayload {
  categoryId: CategoryId
  name: string
  text: string
}

interface AddWidgetActionPayload {
  id: string
  categoryId: CategoryId
  name: string
  text: string
}

interface WidgetTargetPayload {
  categoryId: CategoryId
  widgetId: string
}

function findWidgetInCategory(
  categories: Category[],
  categoryId: CategoryId,
  widgetId: string
): Widget | undefined {
  const category = categories.find((cat) => cat.id === categoryId)
  if (!category) {
    return undefined
  }
  return category.widgets.find((w) => w.id === widgetId)
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: {
      reducer(state, action: PayloadAction<AddWidgetActionPayload>) {
        const { categoryId, id, name, text } = action.payload
        if (!name || !text) {
          return
        }

        const category = state.categories.find((cat) => cat.id === categoryId)
        if (!category) {
          return
        }

        const newWidget: TextWidget = {
          id,
          name,
          isActive: true,
          type: 'text',
          text,
        }

        category.widgets.push(newWidget)
      },
      prepare(payload: AddWidgetPreparePayload) {
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
    removeWidget(state, action: PayloadAction<WidgetTargetPayload>) {
      const { categoryId, widgetId } = action.payload
      const widget = findWidgetInCategory(
        state.categories,
        categoryId,
        widgetId
      )
      if (!widget) {
        return
      }
      widget.isActive = false
    },
    toggleWidget(state, action: PayloadAction<WidgetTargetPayload>) {
      const { categoryId, widgetId } = action.payload
      const widget = findWidgetInCategory(
        state.categories,
        categoryId,
        widgetId
      )
      if (!widget) {
        return
      }
      widget.isActive = !widget.isActive
    },
  },
})

export const { addWidget, removeWidget, toggleWidget } = dashboardSlice.actions
export default dashboardSlice.reducer
