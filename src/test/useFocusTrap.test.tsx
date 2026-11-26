import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { useFocusTrap } from '@/features/widget-drawer/hooks/useFocusTrap'

function TrapContainer({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useFocusTrap(ref, active)

  return (
    <div ref={ref}>
      <button type="button">First</button>
      <input type="text" placeholder="Middle" />
      <button type="button">Last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('Tab from the last element wraps to the first', () => {
    render(<TrapContainer active={true} />)

    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    last.focus()
    expect(document.activeElement).toBe(last)

    fireEvent.keyDown(last, { key: 'Tab', shiftKey: false })

    expect(document.activeElement).toBe(first)
  })

  it('Shift+Tab from the first element wraps to the last', () => {
    render(<TrapContainer active={true} />)

    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    first.focus()
    expect(document.activeElement).toBe(first)

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(last)
  })
})
