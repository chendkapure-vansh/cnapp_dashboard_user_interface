import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'
import { shouldShowCategory } from '@/features/dashboard/utils/categoryVisibility'
import type { Category } from '@/types/dashboard.types'

function renderWithStore(preloadedDashboard?: any) {
  const store = createAppStore(
    preloadedDashboard ? { dashboard: preloadedDashboard } : undefined
  )
  const utils = render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  )
  return { ...utils, store }
}

// Tests for DashboardPage sections, initial active widgets, card removal, and category visibility
describe('DashboardPage', () => {
  it('renders the 3 section headings and the 6 widget titles', () => {
    renderWithStore()

    // 3 visible sections
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'CSPM Executive Dashboard',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'CWPP Dashboard:' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Registry Scan' })
    ).toBeInTheDocument()

    // 6 initial active widgets
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument()
    expect(
      screen.getByText('Cloud Account Risk Assessment')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Top 5 Namespace Specific Alerts')
    ).toBeInTheDocument()
    expect(screen.getByText('Workload Alerts')).toBeInTheDocument()
    expect(screen.getByText('Image Risk Assessment')).toBeInTheDocument()
    expect(screen.getByText('Image Security Issues')).toBeInTheDocument()
  })

  it('the Ticket section is not rendered when empty', () => {
    renderWithStore()
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Ticket' })
    ).not.toBeInTheDocument()
  })

  it('each rendered section has a "+ Add Widget" placeholder, and it is the last item in its grid', () => {
    const { container } = renderWithStore()
    const sections = container.querySelectorAll('section')
    expect(sections).toHaveLength(3)

    sections.forEach((section) => {
      const grid = section.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      const children = grid ? Array.from(grid.children) : []
      const lastChild = children[children.length - 1]
      expect(lastChild).toHaveTextContent('+ Add Widget')
    })
  })

  it('clicking the remove button on a card removes it from the screen', () => {
    const { store } = renderWithStore()
    const removeButton = screen.getByRole('button', {
      name: 'Remove Cloud Accounts',
    })
    expect(removeButton).toBeInTheDocument()

    fireEvent.click(removeButton)

    expect(screen.queryByText('Cloud Accounts')).not.toBeInTheDocument()
    const state = store.getState()
    const cspm = state.dashboard.categories.find((c) => c.id === 'cspm')
    const widget = cspm?.widgets.find((w) => w.id === 'cloud-accounts')
    expect(widget?.isActive).toBe(false)
  })

  it('shouldShowCategory returns false for an empty ticket category and true for the others', () => {
    const emptyTicketCategory: Category = {
      id: 'ticket',
      name: 'Ticket',
      tabLabel: 'Ticket',
      widgets: [],
    }
    expect(shouldShowCategory(emptyTicketCategory)).toBe(false)

    const ticketWithActiveWidgets: Category = {
      id: 'ticket',
      name: 'Ticket',
      tabLabel: 'Ticket',
      widgets: [
        {
          id: 'ticket-1',
          name: 'Open Tickets',
          isActive: true,
          type: 'text',
          text: '5 open',
        },
      ],
    }
    expect(shouldShowCategory(ticketWithActiveWidgets)).toBe(true)

    const emptyCspmCategory: Category = {
      id: 'cspm',
      name: 'CSPM Executive Dashboard',
      tabLabel: 'CSPM',
      widgets: [],
    }
    expect(shouldShowCategory(emptyCspmCategory)).toBe(true)
  })
})
