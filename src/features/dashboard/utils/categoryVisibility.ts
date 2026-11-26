import type { Category } from '@/types/dashboard.types'
import { filterWidgetsByQuery } from '@/utils/searchWidgets'

export function shouldShowCategory(
  category: Category,
  searchQuery: string = ''
): boolean {
  const activeWidgets = category.widgets.filter((w) => w.isActive)
  const trimmed = searchQuery.trim()

  if (trimmed) {
    const matchingWidgets = filterWidgetsByQuery(activeWidgets, trimmed)
    return matchingWidgets.length > 0
  }

  if (category.id === 'ticket' && activeWidgets.length === 0) {
    return false
  }

  return true
}
