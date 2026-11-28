import { type RefObject, useEffect } from 'react'

export function useDismissable<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  isOpen: boolean,
  onClose: () => void
): void {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node | null
      if (ref.current && !ref.current.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [ref, isOpen, onClose])
}
