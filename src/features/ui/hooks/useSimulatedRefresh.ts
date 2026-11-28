import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  finishRefresh,
  selectIsRefreshing,
  startRefresh,
} from '@/features/ui/uiSlice'

/**
 * Hook managing simulated dashboard refresh with spinning indicator and auto-finish timeout.
 * Protects against multiple simultaneous triggers and cleans up timers on unmount.
 *
 * @param durationMs - Duration of the simulated refresh in milliseconds
 */
export function useSimulatedRefresh(durationMs = 600): {
  isRefreshing: boolean
  refresh: () => void
} {
  const dispatch = useAppDispatch()
  const isRefreshing = useAppSelector(selectIsRefreshing)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear timeout on unmount to prevent setting state on unmounted components
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const refresh = useCallback(() => {
    if (isRefreshing) {
      return
    }

    dispatch(startRefresh())

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      dispatch(finishRefresh())
      timerRef.current = null
    }, durationMs)
  }, [dispatch, isRefreshing, durationMs])

  return { isRefreshing, refresh }
}
