import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import {
  selectDashboardQuery,
  setDashboardQuery,
} from '@/features/search/searchSlice'

describe('searchSlice', () => {
  it('default dashboardQuery is empty', () => {
    const store = createAppStore()
    expect(selectDashboardQuery(store.getState())).toBe('')
  })

  it('setDashboardQuery updates the query string', () => {
    const store = createAppStore()
    store.dispatch(setDashboardQuery('alerts'))
    expect(selectDashboardQuery(store.getState())).toBe('alerts')
  })
})
