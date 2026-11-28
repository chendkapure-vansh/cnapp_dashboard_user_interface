import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { TimeRangeDropdown } from '@/features/dashboard/components/TimeRangeDropdown'

describe('TimeRangeDropdown', () => {
  function renderDropdown() {
    const store = createAppStore()
    const utils = render(
      <Provider store={store}>
        <div>
          <button type="button">Outside element</button>
          <TimeRangeDropdown />
        </div>
      </Provider>
    )
    return { ...utils, store }
  }

  it('renders default "Last 2 days" and shows 4 options on click', () => {
    renderDropdown()

    const trigger = screen.getByRole('button', {
      name: 'Time filter: Last 2 days',
    })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(4)
    expect(options.map((opt) => opt.textContent)).toEqual([
      'Last 24 hours',
      'Last 2 days',
      'Last 7 days',
      'Last 30 days',
    ])

    const selectedOption = screen.getByRole('option', { selected: true })
    expect(selectedOption).toHaveTextContent('Last 2 days')
  })

  it('selecting "Last 7 days" updates the label and store', () => {
    const { store } = renderDropdown()
    const trigger = screen.getByRole('button', {
      name: 'Time filter: Last 2 days',
    })
    fireEvent.click(trigger)

    const option7d = screen.getByRole('option', { name: 'Last 7 days' })
    fireEvent.click(option7d)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Time filter: Last 7 days' })
    ).toBeInTheDocument()
    expect(store.getState().ui.timeRange).toBe('last7d')
  })

  it('Escape and outside click close the dropdown', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', {
      name: 'Time filter: Last 2 days',
    })
    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByText('Outside element'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('ArrowDown + Enter select option via keyboard', () => {
    const { store } = renderDropdown()
    const trigger = screen.getByRole('button', {
      name: 'Time filter: Last 2 days',
    })
    fireEvent.click(trigger)

    // Current is last2d (index 1). ArrowDown should move to last7d (index 2)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(store.getState().ui.timeRange).toBe('last7d')

    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(store.getState().ui.timeRange).toBe('last7d')
  })
})
