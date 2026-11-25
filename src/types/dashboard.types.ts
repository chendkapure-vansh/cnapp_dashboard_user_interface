export type ColorKey =
  | 'blue'
  | 'lightBlue'
  | 'red'
  | 'darkRed'
  | 'orange'
  | 'amber'
  | 'green'
  | 'grey'

export interface Segment {
  label: string
  value: number
  color: ColorKey
}

interface BaseWidget {
  id: string
  name: string
  isActive: boolean
}

export interface DonutWidget extends BaseWidget {
  type: 'donut'
  total: number
  segments: Segment[]
}

export interface StackedBarWidget extends BaseWidget {
  type: 'stackedBar'
  total: number
  totalLabel: string
  segments: Segment[]
}

export interface EmptyWidget extends BaseWidget {
  type: 'empty'
  message: string
}

export interface TextWidget extends BaseWidget {
  type: 'text'
  text: string
}

export type Widget = DonutWidget | StackedBarWidget | EmptyWidget | TextWidget

export type CategoryId = 'cspm' | 'cwpp' | 'registry' | 'ticket'

export interface Category {
  id: CategoryId
  name: string
  tabLabel: string
  widgets: Widget[]
}

export interface Dashboard {
  categories: Category[]
}
