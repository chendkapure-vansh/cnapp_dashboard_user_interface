import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import App from '@/App'

// Tests for root App component mounting and initial heading rendering
describe('App', () => {
  it('renders the CNAPP Dashboard heading', () => {
    const store = createAppStore()
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /cnapp dashboard/i })
    ).toBeInTheDocument()
  })
})
