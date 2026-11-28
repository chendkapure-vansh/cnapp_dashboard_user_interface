import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

/**
 * State for the global dashboard widget search bar.
 */
export interface SearchState {
  dashboardQuery: string
}

const initialState: SearchState = {
  dashboardQuery: '',
}

/**
 * Redux slice managing the search query string for filtering dashboard widgets.
 */
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

/**
 * Selects the current dashboard search input query.
 */
export const selectDashboardQuery = (state: { search: SearchState }): string =>
  state.search.dashboardQuery

export default searchSlice.reducer
