import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { TimeRangeId } from '@/features/ui/timeRanges'

export interface UiState {
  timeRange: TimeRangeId
  isRefreshing: boolean
}

const initialState: UiState = {
  timeRange: 'last2d',
  isRefreshing: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTimeRange(state, action: PayloadAction<TimeRangeId>) {
      state.timeRange = action.payload
    },
    startRefresh(state) {
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

export const selectTimeRange = (state: RootState): TimeRangeId =>
  state.ui.timeRange

export const selectIsRefreshing = (state: RootState): boolean =>
  state.ui.isRefreshing

export default uiSlice.reducer
