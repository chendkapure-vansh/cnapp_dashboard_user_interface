import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { CreateWidgetForm } from '@/features/widget-drawer/components/CreateWidgetForm'
import { DrawerFooter } from '@/features/widget-drawer/components/DrawerFooter'
import { DrawerHeader } from '@/features/widget-drawer/components/DrawerHeader'
import { DrawerTabs } from '@/features/widget-drawer/components/DrawerTabs'
import { WidgetChecklist } from '@/features/widget-drawer/components/WidgetChecklist'
import { closeDrawer } from '@/features/widget-drawer/drawerSlice'
import { selectIsDrawerOpen } from '@/features/widget-drawer/selectors'

export function AddWidgetDrawer() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsDrawerOpen)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      // Move focus into panel
      panelRef.current?.focus()

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          dispatch(closeDrawer())
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [isOpen, dispatch])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeDrawer())}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative z-10 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl outline-none"
      >
        <DrawerHeader />

        <div className="px-6 pt-4">
          <p className="text-xs font-semibold text-slate-700">
            Personalise your dashboard by adding the following widget
          </p>
        </div>

        <DrawerTabs />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <WidgetChecklist />
          <CreateWidgetForm />
        </div>

        <DrawerFooter />
      </div>
    </div>
  )
}
