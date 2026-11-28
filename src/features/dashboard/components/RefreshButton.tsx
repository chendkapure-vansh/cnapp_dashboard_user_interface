import { RotateCw } from 'lucide-react'
import { useSimulatedRefresh } from '@/features/ui/hooks/useSimulatedRefresh'

export function RefreshButton() {
  const { isRefreshing, refresh } = useSimulatedRefresh()

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={isRefreshing}
      aria-busy={isRefreshing}
      aria-label="Refresh dashboard"
      title="Refresh"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RotateCw
        size={15}
        className={isRefreshing ? 'animate-spin' : undefined}
      />
    </button>
  )
}
