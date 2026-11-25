import type { Category } from '@/types/dashboard.types'

export function shouldShowCategory(category: Category): boolean {
  const activeCount = category.widgets.filter((w) => w.isActive).length
  if (category.id === 'ticket' && activeCount === 0) {
    return false
  }
  return true
}
