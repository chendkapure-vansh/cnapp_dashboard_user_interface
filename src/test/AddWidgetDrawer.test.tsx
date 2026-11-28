import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'

function renderDashboardPage() {
  const store = createAppStore()
  const utils = render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  )
  return { ...utils, store }
}

// Integration tests for opening the drawer, tab navigation, checklist toggling, and new widget creation
describe('AddWidgetDrawer integration', () => {
  it('header button opens drawer on CSPM tab', () => {
    renderDashboardPage()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const addWidgetButton = screen.getByRole('button', { name: 'Add Widget +' })
    fireEvent.click(addWidgetButton)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    const cspmTab = screen.getByRole('tab', { name: 'CSPM' })
    expect(cspmTab).toHaveAttribute('aria-selected', 'true')
  })

  it('section placeholder opens drawer on its own tab', () => {
    renderDashboardPage()

    const cwppPlaceholder = screen.getAllByRole('button', {
      name: '+ Add Widget',
    })[1]
    fireEvent.click(cwppPlaceholder)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const cwppTab = screen.getByRole('tab', { name: 'CWPP' })
    expect(cwppTab).toHaveAttribute('aria-selected', 'true')
  })

  it('unchecking a widget and pressing Confirm removes it from the dashboard', () => {
    renderDashboardPage()

    // Open on CSPM
    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).toBeChecked()

    // Uncheck Cloud Accounts
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    // Confirm
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    // Drawer closes and widget is removed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Cloud Accounts')).not.toBeInTheDocument()
  })

  it('unchecking a widget and pressing Cancel leaves it active on the dashboard', () => {
    renderDashboardPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    // Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    // Drawer closes and widget stays on dashboard
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument()
  })

  it('creating a widget (name + text) and Confirm shows it in the right section', () => {
    renderDashboardPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    // Expand create form
    fireEvent.click(screen.getByRole('button', { name: 'Create new widget' }))

    const nameInput = screen.getByLabelText('Widget name')
    const textInput = screen.getByLabelText('Widget text')
    const addButton = screen.getByRole('button', { name: 'Add' })

    // Verify Add button is disabled while fields are empty
    expect(addButton).toBeDisabled()

    fireEvent.change(nameInput, { target: { value: 'Compliance Summary' } })
    expect(addButton).toBeDisabled()

    fireEvent.change(textInput, {
      target: { value: 'All compliance checks passed with zero errors.' },
    })
    expect(addButton).not.toBeDisabled()

    // Add draft widget
    fireEvent.click(addButton)

    // Verify fields cleared
    expect(nameInput).toHaveValue('')
    expect(textInput).toHaveValue('')

    // Confirm changes
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    // Verify widget rendered on CSPM section
    expect(screen.getByText('Compliance Summary')).toBeInTheDocument()
    expect(
      screen.getByText('All compliance checks passed with zero errors.')
    ).toBeInTheDocument()
  })

  it('Esc closes the drawer', () => {
    renderDashboardPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it("tab switching shows that tab's rows", () => {
    renderDashboardPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    // CSPM rows
    expect(
      screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    ).toBeInTheDocument()

    // Switch to CWPP
    const cwppTab = screen.getByRole('tab', { name: 'CWPP' })
    fireEvent.click(cwppTab)

    expect(
      screen.getByRole('checkbox', {
        name: 'Top 5 Namespace Specific Alerts',
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('checkbox', { name: 'Cloud Accounts' })
    ).not.toBeInTheDocument()

    // Switch to Ticket (empty)
    const ticketTab = screen.getByRole('tab', { name: 'Ticket' })
    fireEvent.click(ticketTab)
    expect(
      screen.getByText('No widgets in this category yet.')
    ).toBeInTheDocument()
  })
})
