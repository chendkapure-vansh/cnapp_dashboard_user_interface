import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SearchState {
  dashboardQuery: string
}

const initialState: SearchState = {
  dashboardQuery: '',
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDashboardQuery(state, action: PayloadAction<string>) {
      state.dashboardQuery = action.payload
    },
  },
})

export const { setDashboardQuery } = searchSlice.actions

export const selectDashboardQuery = (state: { search: SearchState }): string =>
  state.search.dashboardQuery

export default searchSlice.reducer
