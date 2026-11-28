import { Bell } from 'lucide-react'
import { useRef, useState } from 'react'
import { useDismissable } from '@/features/ui/hooks/useDismissable'

/**
 * Header button displaying notification icon and opening a dismissal popover dialog.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useDismissable(containerRef, isOpen, () => setIsOpen(false))

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-label="Notifications"
        title="Notifications"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full p-1.5 text-slate-500 transition hover:bg-canvas hover:text-navy"
      >
        <Bell size={18} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5"
        >
          <h3 className="text-sm font-semibold text-slate-800">
            Notifications
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-700">
            No new notifications
          </p>
          <p className="mt-1 text-xs text-slate-400">
            You are all caught up.
          </p>
        </div>
      )}
    </div>
  )
}
