import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppStore } from '@/app/store'
import { RefreshButton } from '@/features/dashboard/components/RefreshButton'

describe('RefreshButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sets aria-busy and disabled while refreshing, enables after 600 ms, leaving dashboard data unchanged', () => {
    const store = createAppStore()
    const initialCategories = store.getState().dashboard.categories

    render(
      <Provider store={store}>
        <RefreshButton />
      </Provider>
    )

    const button = screen.getByRole('button', { name: 'Refresh dashboard' })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
    expect(button).not.toHaveAttribute('aria-busy', 'true')

    act(() => {
      fireEvent.click(button)
    })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('title', 'Refresh')

    // Advance 600ms inside act to trigger the state update
    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(button).not.toBeDisabled()
    expect(button).not.toHaveAttribute('aria-busy', 'true')

    // Dashboard data is completely unchanged
    expect(store.getState().dashboard.categories).toEqual(initialCategories)
  })
})
