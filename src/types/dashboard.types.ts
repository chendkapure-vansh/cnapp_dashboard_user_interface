/**
 * Supported color palette keys for chart segments and indicators.
 */
export type ColorKey =
  | 'blue'
  | 'lightBlue'
  | 'red'
  | 'darkRed'
  | 'orange'
  | 'amber'
  | 'green'
  | 'grey'

/**
 * Data point for charts representing a slice or bar segment.
 */
export interface Segment {
  label: string
  value: number
  color: ColorKey
}

/**
 * Shared base fields present on every dashboard widget.
 */
interface BaseWidget {
  id: string
  name: string
  isActive: boolean
}

/**
 * Donut chart widget displaying a circular breakdown and total count.
 */
export interface DonutWidget extends BaseWidget {
  type: 'donut'
  total: number
  segments: Segment[]
}

/**
 * Stacked bar widget displaying proportioned horizontal bars.
 */
export interface StackedBarWidget extends BaseWidget {
  type: 'stackedBar'
  total: number
  totalLabel: string
  segments: Segment[]
}

/**
 * Placeholder widget rendered when a widget has no graph data.
 */
export interface EmptyWidget extends BaseWidget {
  type: 'empty'
  message: string
}

/**
 * Custom text widget containing user-defined notes or alert descriptions.
 */
export interface TextWidget extends BaseWidget {
  type: 'text'
  text: string
}

/**
 * Discriminated union of all supported dashboard widget variants.
 */
export type Widget = DonutWidget | StackedBarWidget | EmptyWidget | TextWidget

/**
 * Unique identifiers for the available dashboard categories.
 */
export type CategoryId = 'cspm' | 'cwpp' | 'registry' | 'ticket'

/**
 * Section grouping related widgets together on the dashboard.
 */
export interface Category {
  id: CategoryId
  name: string
  tabLabel: string
  widgets: Widget[]
}

/**
 * Root data structure holding all dashboard categories and widgets.
 */
export interface Dashboard {
  categories: Category[]
}
