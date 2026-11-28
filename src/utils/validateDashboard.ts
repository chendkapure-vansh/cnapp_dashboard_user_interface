import type {
  Category,
  CategoryId,
  ColorKey,
  Dashboard,
  DonutWidget,
  EmptyWidget,
  Segment,
  StackedBarWidget,
  TextWidget,
  Widget,
} from '@/types/dashboard.types'

/**
 * Error thrown when a dashboard object violates the expected schema.
 * Contains the object path where the validation failed.
 */
export class DashboardValidationError extends Error {
  readonly path: string

  constructor(message: string, path: string) {
    super(`Validation error at ${path}: ${message}`)
    this.name = 'DashboardValidationError'
    this.path = path
  }
}

const ALLOWED_COLOR_KEYS: ReadonlySet<string> = new Set<ColorKey>([
  'blue',
  'lightBlue',
  'red',
  'darkRed',
  'orange',
  'amber',
  'green',
  'grey',
])

const ALLOWED_CATEGORY_IDS: ReadonlySet<string> = new Set<CategoryId>([
  'cspm',
  'cwpp',
  'registry',
  'ticket',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertString(value: unknown, path: string, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DashboardValidationError(
      `${fieldName} must be a non-empty string`,
      path
    )
  }
  return value
}

function assertNumber(value: unknown, path: string, fieldName: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    throw new DashboardValidationError(
      `${fieldName} must be a non-negative number`,
      path
    )
  }
  return value
}

function assertBoolean(
  value: unknown,
  path: string,
  fieldName: string
): boolean {
  if (typeof value !== 'boolean') {
    throw new DashboardValidationError(`${fieldName} must be a boolean`, path)
  }
  return value
}

function validateSegment(input: unknown, path: string): Segment {
  if (!isRecord(input)) {
    throw new DashboardValidationError('Segment must be an object', path)
  }

  const label = assertString(input.label, `${path}.label`, 'label')
  const value = assertNumber(input.value, `${path}.value`, 'value')

  if (typeof input.color !== 'string' || !ALLOWED_COLOR_KEYS.has(input.color)) {
    throw new DashboardValidationError(
      `Unknown color key "${String(input.color)}"`,
      `${path}.color`
    )
  }

  return { label, value, color: input.color as ColorKey }
}

function validateSegments(input: unknown, path: string): Segment[] {
  if (!Array.isArray(input)) {
    throw new DashboardValidationError('segments must be an array', path)
  }
  return input.map((item, index) => validateSegment(item, `${path}[${index}]`))
}

function validateBaseWidget(
  input: Record<string, unknown>,
  path: string,
  seenWidgetIds: Set<string>
): { id: string; name: string; isActive: boolean } {
  const id = assertString(input.id, `${path}.id`, 'id')
  // Ensure every widget ID is unique across all categories to prevent state conflicts
  if (seenWidgetIds.has(id)) {
    throw new DashboardValidationError(
      `Duplicate widget id "${id}"`,
      `${path}.id`
    )
  }
  seenWidgetIds.add(id)

  const name = assertString(input.name, `${path}.name`, 'name')
  const isActive = assertBoolean(input.isActive, `${path}.isActive`, 'isActive')

  return { id, name, isActive }
}

function validateWidget(
  input: unknown,
  path: string,
  seenWidgetIds: Set<string>
): Widget {
  if (!isRecord(input)) {
    throw new DashboardValidationError('Widget must be an object', path)
  }

  const base = validateBaseWidget(input, path, seenWidgetIds)
  const widgetType = input.type

  if (widgetType === 'donut') {
    const total = assertNumber(input.total, `${path}.total`, 'total')
    const segments = validateSegments(input.segments, `${path}.segments`)
    const donut: DonutWidget = { ...base, type: 'donut', total, segments }
    return donut
  }

  if (widgetType === 'stackedBar') {
    const total = assertNumber(input.total, `${path}.total`, 'total')
    const totalLabel = assertString(
      input.totalLabel,
      `${path}.totalLabel`,
      'totalLabel'
    )
    const segments = validateSegments(input.segments, `${path}.segments`)
    const stackedBar: StackedBarWidget = {
      ...base,
      type: 'stackedBar',
      total,
      totalLabel,
      segments,
    }
    return stackedBar
  }

  if (widgetType === 'empty') {
    const message = assertString(input.message, `${path}.message`, 'message')
    const empty: EmptyWidget = { ...base, type: 'empty', message }
    return empty
  }

  if (widgetType === 'text') {
    const text = assertString(input.text, `${path}.text`, 'text')
    const textWidget: TextWidget = { ...base, type: 'text', text }
    return textWidget
  }

  throw new DashboardValidationError(
    `Unknown widget type "${String(widgetType)}"`,
    `${path}.type`
  )
}

function validateCategory(
  input: unknown,
  path: string,
  seenCategoryIds: Set<string>,
  seenWidgetIds: Set<string>
): Category {
  if (!isRecord(input)) {
    throw new DashboardValidationError('Category must be an object', path)
  }

  const id = assertString(input.id, `${path}.id`, 'id')
  if (!ALLOWED_CATEGORY_IDS.has(id)) {
    throw new DashboardValidationError(
      `Unknown category id "${id}"`,
      `${path}.id`
    )
  }
  // Guard against duplicate category IDs
  if (seenCategoryIds.has(id)) {
    throw new DashboardValidationError(
      `Duplicate category id "${id}"`,
      `${path}.id`
    )
  }
  seenCategoryIds.add(id)

  const name = assertString(input.name, `${path}.name`, 'name')
  const tabLabel = assertString(input.tabLabel, `${path}.tabLabel`, 'tabLabel')

  if (!Array.isArray(input.widgets)) {
    throw new DashboardValidationError(
      'widgets must be an array',
      `${path}.widgets`
    )
  }

  const widgets = input.widgets.map((widget, index) =>
    validateWidget(widget, `${path}.widgets[${index}]`, seenWidgetIds)
  )

  return {
    id: id as CategoryId,
    name,
    tabLabel,
    widgets,
  }
}

/**
 * Validates an untrusted input against the full Dashboard data schema.
 * Throws DashboardValidationError if structure, categories, widgets, or segment types are invalid.
 *
 * @param input - Raw data from localStorage or imported JSON
 * @returns Fully validated Dashboard object
 */
export function validateDashboard(input: unknown): Dashboard {
  if (!isRecord(input)) {
    throw new DashboardValidationError(
      'Dashboard root must be an object',
      'root'
    )
  }

  if (!Array.isArray(input.categories)) {
    throw new DashboardValidationError(
      'categories must be an array',
      'categories'
    )
  }

  const seenCategoryIds = new Set<string>()
  const seenWidgetIds = new Set<string>()

  const categories = input.categories.map((category, index) =>
    validateCategory(
      category,
      `categories[${index}]`,
      seenCategoryIds,
      seenWidgetIds
    )
  )

  return { categories }
}
