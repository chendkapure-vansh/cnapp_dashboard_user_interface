import type { Dashboard } from '@/types/dashboard.types'
import { validateDashboard } from '@/utils/validateDashboard'

export const STORAGE_KEY = 'cnapp.dashboard.v1'

function isStorageAvailable(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    )
  } catch {
    return false
  }
}

export function loadSavedDashboard(): Dashboard | null {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available; falling back to default data.')
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)
    return validateDashboard(parsed)
  } catch (error) {
    console.warn(
      'Failed to load or validate saved dashboard from localStorage:',
      error
    )
    return null
  }
}

export function saveDashboard(dashboard: Dashboard): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available; cannot save dashboard.')
    return
  }

  try {
    const serialized = JSON.stringify(dashboard)
    window.localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.warn('Failed to save dashboard to localStorage:', error)
  }
}
