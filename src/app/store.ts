import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '@/features/dashboard/dashboardSlice'

export function createAppStore(preloadedState?: {
  dashboard: ReturnType<typeof dashboardReducer>
}) {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
    },
    preloadedState,
  })
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
