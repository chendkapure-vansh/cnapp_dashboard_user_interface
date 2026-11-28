import dashboardData from '@/data/dashboard.json'
import type { Dashboard } from '@/types/dashboard.types'
import { validateDashboard } from '@/utils/validateDashboard'

/**
 * Loads and validates the default initial dashboard configuration from bundled JSON.
 */
export function loadDashboard(): Dashboard {
  return validateDashboard(dashboardData)
}
