import { describe, expect, it } from 'vitest'
import {
  finishRefresh,
  selectIsRefreshing,
  selectTimeRange,
  setTimeRange,
  startRefresh,
  uiSlice,
} from '@/features/ui/uiSlice'

// Tests for uiSlice time range selection, refresh state reducers, and selectors
describe('uiSlice', () => {
  it('has expected default state', () => {
    const state = uiSlice.reducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({
      timeRange: 'last2d',
      isRefreshing: false,
    })
  })

  it('sets time range correctly', () => {
    const nextState = uiSlice.reducer(undefined, setTimeRange('last7d'))
    expect(nextState.timeRange).toBe('last7d')
  })

  it('handles startRefresh and finishRefresh', () => {
    const refreshingState = uiSlice.reducer(undefined, startRefresh())
    expect(refreshingState.isRefreshing).toBe(true)

    const finishedState = uiSlice.reducer(refreshingState, finishRefresh())
    expect(finishedState.isRefreshing).toBe(false)
  })

  it('ignores startRefresh when already refreshing', () => {
    const state = { timeRange: 'last2d' as const, isRefreshing: true }
    const nextState = uiSlice.reducer(state, startRefresh())
    expect(nextState).toBe(state)
  })

  it('selectors work properly', () => {
    const rootState = {
      ui: {
        timeRange: 'last30d' as const,
        isRefreshing: true,
      },
    } as any

    expect(selectTimeRange(rootState)).toBe('last30d')
    expect(selectIsRefreshing(rootState)).toBe(true)
  })
})
