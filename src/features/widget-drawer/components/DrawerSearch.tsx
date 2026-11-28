import { Search, X } from 'lucide-react'

interface DrawerSearchProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * Search input field within the drawer for filtering available widgets across categories.
 */
export function DrawerSearch({ query, onQueryChange }: DrawerSearchProps) {
  return (
    <div className="relative mb-3 w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={14}
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search widgets"
        placeholder="Search widgets..."
        className="h-8 w-full rounded-md border border-slate-200 bg-canvas/40 pl-8 pr-8 text-xs text-slate-800 outline-none transition focus:border-navy focus:bg-white"
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => onQueryChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
