import type { AppStore } from '@/app/store'
import type { Dashboard } from '@/types/dashboard.types'
import { saveDashboard } from '@/utils/dashboardStorage'

export function persistDashboard(store: AppStore, delayMs = 300): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let previousDashboard: Dashboard = store.getState().dashboard

  const unsubscribe = store.subscribe(() => {
    const currentDashboard = store.getState().dashboard
    if (currentDashboard === previousDashboard) {
      return
    }

    previousDashboard = currentDashboard

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
