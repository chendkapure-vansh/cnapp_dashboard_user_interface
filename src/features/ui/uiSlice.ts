import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { TimeRangeId } from '@/features/ui/timeRanges'

/**
 * Transient UI state for the dashboard header and controls.
 */
export interface UiState {
  timeRange: TimeRangeId
  isRefreshing: boolean
}

const initialState: UiState = {
  timeRange: 'last2d',
  isRefreshing: false,
}

/**
 * Redux slice managing temporary UI state like time range and refresh animation.
 */
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTimeRange(state, action: PayloadAction<TimeRangeId>) {
      state.timeRange = action.payload
    },
    startRefresh(state) {
      // Prevent multiple concurrent refreshes
      if (state.isRefreshing) {
        return
      }
      state.isRefreshing = true
    },
    finishRefresh(state) {
      state.isRefreshing = false
    },
  },
})

export const { setTimeRange, startRefresh, finishRefresh } = uiSlice.actions

/**
 * Selects the active time range identifier.
 */
export const selectTimeRange = (state: RootState): TimeRangeId =>
  state.ui.timeRange

/**
 * Selects whether the simulated dashboard refresh is currently active.
 */
export const selectIsRefreshing = (state: RootState): boolean =>
  state.ui.isRefreshing

export default uiSlice.reducer
