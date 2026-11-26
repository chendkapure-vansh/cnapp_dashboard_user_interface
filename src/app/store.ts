import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistDashboard } from '@/app/persistStore'
import dashboardReducer from '@/features/dashboard/dashboardSlice'
import searchReducer from '@/features/search/searchSlice'
import drawerReducer from '@/features/widget-drawer/drawerSlice'
import { loadSavedDashboard } from '@/utils/dashboardStorage'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  drawer: drawerReducer,
  search: searchReducer,
})

export function createAppStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  })
}

const savedDashboard = loadSavedDashboard()
export const store = createAppStore(
  savedDashboard ? { dashboard: savedDashboard } : undefined
)

persistDashboard(store)

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
