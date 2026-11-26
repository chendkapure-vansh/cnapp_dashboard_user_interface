import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'

function renderPage() {
  const store = createAppStore()
  const utils = render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  )
  return { ...utils, store }
}

describe('Drawer Search (Phase 8a)', () => {
  it('typing in the drawer search shows matches across tabs with group headings', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'Alerts' } })

    // Matches 'Top 5 Namespace Specific Alerts' and 'Workload Alerts' in CWPP
    expect(
      screen.getByRole('heading', { level: 4, name: 'CWPP' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Top 5 Namespace Specific Alerts',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: 'Workload Alerts' })
    ).toBeInTheDocument()

    // Does not match CSPM widgets
    expect(
      screen.queryByRole('checkbox', { name: 'Cloud Accounts' })
    ).not.toBeInTheDocument()
  })

  it('unchecking from results then Confirm hides that widget on the dashboard', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'Accounts' } })

    const checkbox = screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(screen.queryByText('Cloud Accounts')).not.toBeInTheDocument()
  })

  it('shows no-match message when query matches nothing', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'nonexistent-term' } })

    expect(screen.getByText('No widgets found.')).toBeInTheDocument()
  })

  it('clearing the query returns to the tab view', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'Accounts' } })

    const clearBtn = screen.getByLabelText('Clear search')
    fireEvent.click(clearBtn)

    expect(searchInput).toHaveValue('')
    // Back to CSPM tab view
    expect(
      screen.getByRole('checkbox', { name: 'Cloud Accounts' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Cloud Account Risk Assessment',
      })
    ).toBeInTheDocument()
  })

  it('Create form is hidden while a search query is active', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    expect(screen.getByText('Create new widget')).toBeInTheDocument()

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'Accounts' } })

    expect(screen.queryByText('Create new widget')).not.toBeInTheDocument()
  })

  it('query resets after closing and reopening the drawer', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))

    const searchInput = screen.getByLabelText('Search widgets')
    fireEvent.change(searchInput, { target: { value: 'Accounts' } })
    expect(searchInput).toHaveValue('Accounts')

    // Close with Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    // Reopen
    fireEvent.click(screen.getByRole('button', { name: 'Add Widget +' }))
    const newSearchInput = screen.getByLabelText('Search widgets')
    expect(newSearchInput).toHaveValue('')
  })
})
