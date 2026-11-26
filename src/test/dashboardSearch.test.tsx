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

describe('Dashboard Search (Phase 8b)', () => {
  it('typing in the top bar hides non-matching cards and sections, hides placeholders', () => {
    renderPage()

    const searchInput = screen.getByLabelText('Search dashboard widgets')
    fireEvent.change(searchInput, { target: { value: 'Alerts' } })

    // CWPP section matches and shows
    expect(screen.getByText('CWPP Dashboard:')).toBeInTheDocument()
    expect(
      screen.getByText('Top 5 Namespace Specific Alerts')
    ).toBeInTheDocument()
    expect(screen.getByText('Workload Alerts')).toBeInTheDocument()

    // CSPM and Registry Scan sections should be hidden
    expect(
      screen.queryByText('CSPM Executive Dashboard')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Registry Scan')).not.toBeInTheDocument()

    // AddWidgetPlaceholder should NOT be rendered during search
    expect(screen.queryByText('+ Add Widget')).not.toBeInTheDocument()
  })

  it('shows "No widgets match your search." when nothing matches', () => {
    renderPage()

    const searchInput = screen.getByLabelText('Search dashboard widgets')
    fireEvent.change(searchInput, { target: { value: 'xyz-no-match' } })

    expect(
      screen.getByText('No widgets match your search.')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('CSPM Executive Dashboard')
    ).not.toBeInTheDocument()
  })

  it('clearing the query restores all sections, cards, and placeholders', () => {
    renderPage()

    const searchInput = screen.getByLabelText('Search dashboard widgets')
    fireEvent.change(searchInput, { target: { value: 'Alerts' } })
    expect(
      screen.queryByText('CSPM Executive Dashboard')
    ).not.toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText('CSPM Executive Dashboard')).toBeInTheDocument()
    expect(screen.getByText('CWPP Dashboard:')).toBeInTheDocument()
    expect(screen.getByText('Registry Scan')).toBeInTheDocument()
    expect(screen.getAllByText('+ Add Widget')).toHaveLength(3)
  })

  it('removed (inactive) widgets are never shown by dashboard search', () => {
    renderPage()

    // Remove Cloud Accounts
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove Cloud Accounts' })
    )

    const searchInput = screen.getByLabelText('Search dashboard widgets')
    fireEvent.change(searchInput, { target: { value: 'Cloud Accounts' } })

    // Cloud Accounts should not show since it is inactive
    expect(screen.queryByText('Cloud Accounts')).not.toBeInTheDocument()
    // Nor should the CSPM section show since no active widgets match
    expect(
      screen.getByText('No widgets match your search.')
    ).toBeInTheDocument()
  })
})
