interface TextWidgetProps {
  text: string
}

/**
 * Displays user-defined textual notes within a widget card container.
 */
export function TextWidget({ text }: TextWidgetProps) {
  return (
    <div className="flex h-full w-full items-center p-2">
      <div className="max-h-36 w-full overflow-y-auto rounded bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
        <p className="break-words">{text}</p>
      </div>
    </div>
  )
}
