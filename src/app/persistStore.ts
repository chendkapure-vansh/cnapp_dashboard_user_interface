import type { AppStore } from '@/app/store'
import type { Dashboard } from '@/types/dashboard.types'
import { saveDashboard } from '@/utils/dashboardStorage'

/**
 * Subscribes to the Redux store and persists dashboard changes to localStorage with debouncing.
 * Only saves when the dashboard slice actually mutates, ignoring UI/drawer/search changes.
 *
 * @param store - The Redux application store
 * @param delayMs - Debounce interval in milliseconds
 * @returns Unsubscribe cleanup function
 */
export function persistDashboard(store: AppStore, delayMs = 300): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let previousDashboard: Dashboard = store.getState().dashboard

  const unsubscribe = store.subscribe(() => {
    const currentDashboard = store.getState().dashboard
    // Only persist when dashboard data changes; ignore transient UI or search updates
    if (currentDashboard === previousDashboard) {
      return
    }

    previousDashboard = currentDashboard

    // Debounce writes to prevent disk thrashing during rapid user interactions
    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      saveDashboard(currentDashboard)
      timer = null
    }, delayMs)
  })

  return () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    unsubscribe()
  }
}
