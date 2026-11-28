import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { DrawerTabs } from '@/features/widget-drawer/components/DrawerTabs'

// Tests for WAI-ARIA tablist roving tabindex and arrow key navigation in drawer tabs
describe('DrawerTabs keyboard navigation (WAI-ARIA tabs)', () => {
  it('ArrowRight and ArrowLeft move the selected tab and roving focus', () => {
    const store = createAppStore()
    render(
      <Provider store={store}>
        <DrawerTabs />
      </Provider>
    )

    const cspmTab = screen.getByRole('tab', { name: 'CSPM' })
    const cwppTab = screen.getByRole('tab', { name: 'CWPP' })
    const imageTab = screen.getByRole('tab', { name: 'Image' })
    const ticketTab = screen.getByRole('tab', { name: 'Ticket' })

    cspmTab.focus()
    expect(cspmTab).toHaveAttribute('aria-selected', 'true')

    // ArrowRight -> CWPP
    fireEvent.keyDown(cspmTab, { key: 'ArrowRight' })
    expect(cwppTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(cwppTab)

    // ArrowRight -> Image
    fireEvent.keyDown(cwppTab, { key: 'ArrowRight' })
    expect(imageTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(imageTab)

    // ArrowRight -> Ticket
    fireEvent.keyDown(imageTab, { key: 'ArrowRight' })
    expect(ticketTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(ticketTab)

    // ArrowRight wrap around -> CSPM
    fireEvent.keyDown(ticketTab, { key: 'ArrowRight' })
    expect(cspmTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(cspmTab)

    // ArrowLeft wrap around -> Ticket
    fireEvent.keyDown(cspmTab, { key: 'ArrowLeft' })
    expect(ticketTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(ticketTab)
  })
})
