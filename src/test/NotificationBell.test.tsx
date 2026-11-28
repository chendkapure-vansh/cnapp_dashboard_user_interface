import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NotificationBell } from '@/features/dashboard/components/NotificationBell'

// Tests for notification bell toggle, dialog content rendering, and outside/Escape dismissal
describe('NotificationBell', () => {
  it('toggles dialog with "No new notifications", aria-expanded, and dismisses on Esc or outside click', () => {
    render(
      <div>
        <button type="button">Outside element</button>
        <NotificationBell />
      </div>
    )

    const bellButton = screen.getByRole('button', { name: 'Notifications' })
    expect(bellButton).toBeInTheDocument()
    expect(bellButton).toHaveAttribute('aria-haspopup', 'dialog')
    expect(bellButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(bellButton)
    expect(bellButton).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('heading', { level: 3, name: 'Notifications' })
    ).toBeInTheDocument()
    expect(screen.getByText('No new notifications')).toBeInTheDocument()
    expect(screen.getByText('You are all caught up.')).toBeInTheDocument()

    // Dismiss with Escape
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bellButton).toHaveAttribute('aria-expanded', 'false')

    // Open again and dismiss with outside click
    fireEvent.click(bellButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByText('Outside element'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bellButton).toHaveAttribute('aria-expanded', 'false')
  })
})
