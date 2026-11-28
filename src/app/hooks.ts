import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/**
 * Typed wrapper around useDispatch for the application Redux store.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * Typed wrapper around useSelector for the application Redux store.
 */
export const useAppSelector = useSelector.withTypes<RootState>()
