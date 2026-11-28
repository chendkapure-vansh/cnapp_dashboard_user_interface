/**
 * Filters a list of named items by substring matching against a search query.
 * Returns the original array unchanged if the query is empty to preserve reference equality.
 *
 * @param items - Array of items with a name property
 * @param query - Raw search query string
 */
export function filterWidgetsByQuery<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  const trimmed = query.trim().toLowerCase()
  // Return identical reference when query is empty to avoid triggering selector rerenders
  if (!trimmed) {
    return items
  }

  return items.filter((item) => item.name.toLowerCase().includes(trimmed))
}
