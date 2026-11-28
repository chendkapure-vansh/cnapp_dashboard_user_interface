import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistDashboard } from '@/app/persistStore'
import dashboardReducer from '@/features/dashboard/dashboardSlice'
import searchReducer from '@/features/search/searchSlice'
import uiReducer from '@/features/ui/uiSlice'
import drawerReducer from '@/features/widget-drawer/drawerSlice'
import { loadSavedDashboard } from '@/utils/dashboardStorage'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  drawer: drawerReducer,
  search: searchReducer,
  ui: uiReducer,
})

/**
 * Creates and configures a new Redux store instance with the root reducer.
 *
 * @param preloadedState - Optional initial state for testing or hydration
 */
export function createAppStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  })
}

const savedDashboard = loadSavedDashboard()

/**
 * Singleton Redux store initialized with persisted dashboard data if available.
 */
export const store = createAppStore(
  savedDashboard ? { dashboard: savedDashboard } : undefined
)

persistDashboard(store)

/**
 * Store instance type returned by createAppStore.
 */
export type AppStore = ReturnType<typeof createAppStore>

/**
 * Inferred root state type containing all slice reducers.
 */
export type RootState = ReturnType<typeof rootReducer>

/**
 * Inferred dispatch type from the primary store instance.
 */
export type AppDispatch = typeof store.dispatch
