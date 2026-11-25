import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addDraftWidget } from '@/features/widget-drawer/drawerSlice'
import { selectActiveTab } from '@/features/widget-drawer/selectors'

export function CreateWidgetForm() {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector(selectActiveTab)

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const isValid = name.trim().length > 0 && text.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) {
      return
    }

    dispatch(
      addDraftWidget({
        categoryId: activeTab,
        name,
        text,
      })
    )

    setName('')
    setText('')
  }

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100/70"
      >
        <span>Create new widget</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-t border-slate-200 p-3.5"
        >
          <div>
            <label
              htmlFor="new-widget-name"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Widget name
            </label>
            <input
              id="new-widget-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Compliance Overview"
              className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition focus:border-navy"
            />
          </div>

          <div>
            <label
              htmlFor="new-widget-text"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Widget text
            </label>
            <textarea
              id="new-widget-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter widget description or summary..."
              rows={3}
              className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition focus:border-navy"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className="rounded bg-navy px-3 py-1.5 text-xs font-medium text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
