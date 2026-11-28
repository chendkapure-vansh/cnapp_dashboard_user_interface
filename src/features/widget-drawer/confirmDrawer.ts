import type { AppDispatch, RootState } from '@/app/store'
import { applyDrawerChanges } from '@/features/dashboard/dashboardSlice'
import { closeDrawer } from '@/features/widget-drawer/drawerSlice'

/**
 * Commits staged drawer checkbox toggles and newly authored widgets to the dashboard state.
 * Automatically closes the drawer upon completion.
 */
export function confirmDrawer(dispatch: AppDispatch, state: RootState) {
  const { draftActive, draftNewWidgets } = state.drawer

  dispatch(
    applyDrawerChanges({
      activeStates: draftActive,
      newWidgets: draftNewWidgets,
    })
  )

  dispatch(closeDrawer())
}
