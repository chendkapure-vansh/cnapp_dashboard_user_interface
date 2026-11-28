import { act, renderHook } from '@testing-library/react'
import type React from 'react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppStore } from '@/app/store'
import { useSimulatedRefresh } from '@/features/ui/hooks/useSimulatedRefresh'

describe('useSimulatedRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function createWrapper() {
    const store = createAppStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    return { store, wrapper }
  }

  it('sets isRefreshing to true and then false after 600 ms', () => {
    const { wrapper, store } = createWrapper()
    const { result } = renderHook(() => useSimulatedRefresh(600), { wrapper })

    expect(result.current.isRefreshing).toBe(false)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(true)
    expect(store.getState().ui.isRefreshing).toBe(true)

    act(() => {
      vi.advanceTimersByTime(599)
    })
    expect(store.getState().ui.isRefreshing).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(store.getState().ui.isRefreshing).toBe(false)
  })

  it('ignores second call while refreshing', () => {
    const { wrapper, store } = createWrapper()
    const { result } = renderHook(() => useSimulatedRefresh(600), { wrapper })

    act(() => {
      result.current.refresh()
    })
    expect(result.current.isRefreshing).toBe(true)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Second call while still refreshing
    act(() => {
      result.current.refresh()
    })

    // Advances the remaining 300ms from the original 600ms
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(store.getState().ui.isRefreshing).toBe(false)
  })

  it('unmount clears the timer', () => {
    const { wrapper, store } = createWrapper()
    const { result, unmount } = renderHook(() => useSimulatedRefresh(600), {
      wrapper,
    })

    act(() => {
      result.current.refresh()
    })
    expect(store.getState().ui.isRefreshing).toBe(true)

    unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // finishRefresh was not dispatched because timer was cancelled on unmount
    expect(store.getState().ui.isRefreshing).toBe(true)
  })
})
