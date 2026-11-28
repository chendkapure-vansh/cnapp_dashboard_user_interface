import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'
import { createAppStore } from '@/app/store'
import { TopBar } from '@/features/dashboard/components/TopBar'

describe('TopBar Home button', () => {
  it('calls window.scrollTo when clicking Home breadcrumb', () => {
    const scrollToMock = vi.fn()
    window.scrollTo = scrollToMock

    const store = createAppStore()
    render(
      <Provider store={store}>
        <TopBar />
      </Provider>
    )

    const homeButton = screen.getByRole('button', { name: 'Home' })
    expect(homeButton).toBeInTheDocument()

    fireEvent.click(homeButton)

    expect(scrollToMock).toHaveBeenCalledTimes(1)
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
