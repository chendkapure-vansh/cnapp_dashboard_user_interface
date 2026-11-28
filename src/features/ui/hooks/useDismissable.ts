import { type RefObject, useEffect } from 'react'

/**
 * Hook that listens for outside clicks and Escape key presses to dismiss an overlay or menu.
 * Automatically cleans up event listeners when closed or unmounted.
 *
 * @param ref - Reference to the root container element to keep open
 * @param isOpen - Boolean indicating if the overlay is visible
 * @param onClose - Callback invoked to close the overlay
 */
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
