import dashboardData from '@/data/dashboard.json'
import type { Dashboard } from '@/types/dashboard.types'
import { validateDashboard } from '@/utils/validateDashboard'

export function loadDashboard(): Dashboard {
  return validateDashboard(dashboardData)
}
