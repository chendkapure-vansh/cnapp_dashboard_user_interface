import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { persistDashboard } from '@/app/persistStore'
import { createAppStore } from '@/app/store'
import { removeWidget } from '@/features/dashboard/dashboardSlice'
import { setDashboardQuery } from '@/features/search/searchSlice'
import { setTimeRange } from '@/features/ui/uiSlice'
import { openDrawer } from '@/features/widget-drawer/drawerSlice'
import { STORAGE_KEY } from '@/utils/dashboardStorage'

// Tests for dashboard persistence to localStorage, debounce handling, and ignoring non-dashboard slice updates
describe('persistStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('a dashboard change is saved after the debounce delay', () => {
    const store = createAppStore()
    persistDashboard(store, 300)

    store.dispatch(
      removeWidget({ categoryId: 'cspm', widgetId: 'cloud-accounts' })
    )

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()

    vi.advanceTimersByTime(300)

    const raw = window.localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    const widget = parsed.categories[0].widgets.find(
      (w: { id: string }) => w.id === 'cloud-accounts'
    )
    expect(widget.isActive).toBe(false)
  })

  it('several quick changes cause one save', () => {
    const store = createAppStore()
    persistDashboard(store, 300)

    store.dispatch(
      removeWidget({ categoryId: 'cspm', widgetId: 'cloud-accounts' })
    )
    vi.advanceTimersByTime(100)
    store.dispatch(
      removeWidget({
        categoryId: 'cspm',
        widgetId: 'cloud-account-risk-assessment',
      })
    )
    vi.advanceTimersByTime(100)

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()

    vi.advanceTimersByTime(300)

    const raw = window.localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    const w1 = parsed.categories[0].widgets.find(
      (w: { id: string }) => w.id === 'cloud-accounts'
    )
    const w2 = parsed.categories[0].widgets.find(
      (w: { id: string }) => w.id === 'cloud-account-risk-assessment'
    )
    expect(w1.isActive).toBe(false)
    expect(w2.isActive).toBe(false)
  })

  it('a change to the drawer, search, or ui slice does not save', () => {
    const store = createAppStore()
    persistDashboard(store, 300)

    store.dispatch(openDrawer('cwpp'))
    store.dispatch(setDashboardQuery('alerts'))
    store.dispatch(setTimeRange('last7d'))

    vi.advanceTimersByTime(500)

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('the unsubscribe function stops saving', () => {
    const store = createAppStore()
    const unsubscribe = persistDashboard(store, 300)

    store.dispatch(
      removeWidget({ categoryId: 'cspm', widgetId: 'cloud-accounts' })
    )
    unsubscribe()

    vi.advanceTimersByTime(500)

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
