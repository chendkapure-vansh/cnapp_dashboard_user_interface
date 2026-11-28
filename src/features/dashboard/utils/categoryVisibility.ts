import type { Category } from '@/types/dashboard.types'
import { filterWidgetsByQuery } from '@/utils/searchWidgets'

/**
 * Determines whether a dashboard category section should be visible based on search query and widgets.
 * Hides empty ticket categories by default unless they have active widgets.
 *
 * @param category - Category to check
 * @param searchQuery - Current search query string
 */
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
