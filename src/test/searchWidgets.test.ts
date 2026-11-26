import { describe, expect, it } from 'vitest'
import { filterWidgetsByQuery } from '@/utils/searchWidgets'

describe('filterWidgetsByQuery', () => {
  const widgets = [
    { name: 'Cloud Accounts' },
    { name: 'Cloud Account Risk Assessment' },
    { name: 'Workload Alerts' },
  ]

  it('empty query returns the same array reference', () => {
    expect(filterWidgetsByQuery(widgets, '')).toBe(widgets)
    expect(filterWidgetsByQuery(widgets, '   ')).toBe(widgets)
  })

  it('performs case-insensitive match on name', () => {
    const result = filterWidgetsByQuery(widgets, 'cloud')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Cloud Accounts')
    expect(result[1].name).toBe('Cloud Account Risk Assessment')
  })

  it('trims leading and trailing spaces from query', () => {
    const result = filterWidgetsByQuery(widgets, '  workload  ')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Workload Alerts')
  })

  it('no match returns an empty array', () => {
    const result = filterWidgetsByQuery(widgets, 'nonexistent')
    expect(result).toEqual([])
  })

  it('does not mutate the input array', () => {
    const original = [...widgets]
    filterWidgetsByQuery(widgets, 'Cloud')
    expect(widgets).toEqual(original)
  })
})
