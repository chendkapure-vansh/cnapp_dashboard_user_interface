export type TimeRangeId = 'last24h' | 'last2d' | 'last7d' | 'last30d'

export interface TimeRangeOption {
  id: TimeRangeId
  label: string
}

export const TIME_RANGE_OPTIONS: readonly TimeRangeOption[] = [
  { id: 'last24h', label: 'Last 24 hours' },
  { id: 'last2d', label: 'Last 2 days' },
  { id: 'last7d', label: 'Last 7 days' },
  { id: 'last30d', label: 'Last 30 days' },
] as const

export function getTimeRangeLabel(id: TimeRangeId): string {
  const match = TIME_RANGE_OPTIONS.find((opt) => opt.id === id)
  return match ? match.label : id
}
