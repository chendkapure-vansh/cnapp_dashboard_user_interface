import { Check, ChevronDown, Clock } from 'lucide-react'
import { type KeyboardEvent, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useDismissable } from '@/features/ui/hooks/useDismissable'
import {
  getTimeRangeLabel,
  TIME_RANGE_OPTIONS,
  type TimeRangeId,
} from '@/features/ui/timeRanges'
import { selectTimeRange, setTimeRange } from '@/features/ui/uiSlice'

export function TimeRangeDropdown() {
  const dispatch = useAppDispatch()
  const currentTimeRange = useAppSelector(selectTimeRange)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useDismissable(containerRef, isOpen, () => setIsOpen(false))

  const selectedLabel = getTimeRangeLabel(currentTimeRange)

  function handleSelect(id: TimeRangeId) {
    dispatch(setTimeRange(id))
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isOpen) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter'
      ) {
        event.preventDefault()
        setIsOpen(true)
      }
      return
    }

    const currentIndex = TIME_RANGE_OPTIONS.findIndex(
      (opt) => opt.id === currentTimeRange
    )

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (currentIndex + 1) % TIME_RANGE_OPTIONS.length
      dispatch(setTimeRange(TIME_RANGE_OPTIONS[nextIndex].id))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex =
        (currentIndex - 1 + TIME_RANGE_OPTIONS.length) %
        TIME_RANGE_OPTIONS.length
      dispatch(setTimeRange(TIME_RANGE_OPTIONS[prevIndex].id))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="relative inline-block text-left"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Time filter: ${selectedLabel}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-md border border-navy bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-xs transition hover:bg-navy/5"
      >
        <Clock size={14} className="text-navy" />
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className="text-navy" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Time filter options"
          className="absolute right-0 z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = opt.id === currentTimeRange
            return (
              <li
                key={opt.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.id)}
                className={`flex cursor-pointer items-center justify-between px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? 'bg-navy/10 font-semibold text-navy'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="text-navy" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
