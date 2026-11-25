import { combineReducers, configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '@/features/dashboard/dashboardSlice'
import drawerReducer from '@/features/widget-drawer/drawerSlice'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  drawer: drawerReducer,
})

export function createAppStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  })
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
