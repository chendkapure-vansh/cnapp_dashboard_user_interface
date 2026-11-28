import { ChartNoAxesColumn } from 'lucide-react'

interface EmptyWidgetProps {
  message: string
}

/**
 * Placeholder view rendered when a chart has no available data.
 */
export function EmptyWidget({ message }: EmptyWidgetProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
      <ChartNoAxesColumn
        className="mb-2 text-slate-300"
        size={40}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  )
}
