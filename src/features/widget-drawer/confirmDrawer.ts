import type { AppDispatch, RootState } from '@/app/store'
import { applyDrawerChanges } from '@/features/dashboard/dashboardSlice'
import { closeDrawer } from '@/features/widget-drawer/drawerSlice'

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
