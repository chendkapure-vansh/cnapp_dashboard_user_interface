import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'

// Tests verifying state parity between card X button removal and drawer uncheck-confirm flow
describe('Phase 7: remove-path synchronization', () => {
  it('removing via card X and via drawer uncheck + Confirm produce the same store state', () => {
    // 1. Remove via Card X
    const storeX = createAppStore()
    const { unmount: unmountX } = render(
      <Provider store={storeX}>
        <DashboardPage />
      </Provider>
    )
    const removeBtn = screen.getByRole('button', {
      name: 'Remove Cloud Accounts',
    })
    fireEvent.click(removeBtn)

    const stateX = storeX.getState()
    const cspmX = stateX.dashboard.categories.find((c) => c.id === 'cspm')
    const widgetX = cspmX?.widgets.find((w) => w.id === 'cloud-accounts')
    expect(widgetX).toBeDefined()
    expect(widgetX?.isActive).toBe(false)
    unmountX()

    // 2. Remove via Drawer uncheck + Confirm in a separate store
    const storeDrawer = createAppStore()
    render(
      <Provider store={storeDrawer}>
        <DashboardPage />
      </Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    const stateDrawer = storeDrawer.getState()
    const cspmDrawer = stateDrawer.dashboard.categories.find(
      (c) => c.id === 'cspm'
    )
    const widgetDrawer = cspmDrawer?.widgets.find(
      (w) => w.id === 'cloud-accounts'
    )
    expect(widgetDrawer).toBeDefined()
    expect(widgetDrawer?.isActive).toBe(false)

    expect(widgetX).toEqual(widgetDrawer)
  })

  it('after removing through the card X, opening drawer shows that widget unchecked; checking and Confirm brings it back', () => {
    const store = createAppStore()
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    )

    // Remove via Card X
    const removeBtn = screen.getByRole('button', {
      name: 'Remove Cloud Accounts',
    })
    fireEvent.click(removeBtn)
    expect(screen.queryByText('Cloud Accounts')).not.toBeInTheDocument()

    // Open drawer on CSPM
    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))
    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).not.toBeChecked()

    // Check it and Confirm
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    // Widget card returns to dashboard
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument()
  })

  it('Cancel after unchecking in drawer does not change the dashboard', () => {
    const store = createAppStore()
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))
    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    // Cloud Accounts is still present
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument()
  })
})
