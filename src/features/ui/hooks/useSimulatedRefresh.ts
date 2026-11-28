import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  finishRefresh,
  selectIsRefreshing,
  startRefresh,
} from '@/features/ui/uiSlice'

export function useSimulatedRefresh(durationMs = 600): {
  isRefreshing: boolean
  refresh: () => void
} {
  const dispatch = useAppDispatch()
  const isRefreshing = useAppSelector(selectIsRefreshing)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
