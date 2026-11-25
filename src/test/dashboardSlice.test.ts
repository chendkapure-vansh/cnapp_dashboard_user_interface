import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import {
  addWidget,
  applyDrawerChanges,
  removeWidget,
  toggleWidget,
} from '@/features/dashboard/dashboardSlice'
import {
  selectActiveWidgets,
  selectAllWidgets,
  selectCategories,
  selectCategoryById,
} from '@/features/dashboard/selectors'
import type { CategoryId, TextWidget } from '@/types/dashboard.types'
import { loadDashboard } from '@/utils/loadDashboard'

describe('dashboardSlice and selectors', () => {
  it('initial state matches loadDashboard()', () => {
    const testStore = createAppStore()
    const state = testStore.getState()
    const expected = loadDashboard()
    expect(state.dashboard).toEqual(expected)
  })

  it('addWidget adds an active text widget to the right category with a unique id', () => {
    const testStore = createAppStore()
    testStore.dispatch(
      addWidget({
        categoryId: 'cspm',
        name: 'Custom Widget',
        text: 'Sample description',
      }),
    )

    const state = testStore.getState()
    const cspmCategory = selectCategoryById(state, 'cspm')
    expect(cspmCategory).toBeDefined()

    const addedWidget = cspmCategory?.widgets.find(
      (w) => w.name === 'Custom Widget',
    ) as TextWidget | undefined

    expect(addedWidget).toBeDefined()
    expect(addedWidget?.type).toBe('text')
    expect(addedWidget?.text).toBe('Sample description')
    expect(addedWidget?.isActive).toBe(true)
    expect(typeof addedWidget?.id).toBe('string')
    expect(addedWidget?.id.length).toBeGreaterThan(0)
  })

  it('addWidget with empty or whitespace name/text does nothing', () => {
    const testStore = createAppStore()
    const initialWidgetCount =
      selectCategoryById(testStore.getState(), 'cspm')?.widgets.length ?? 0

    testStore.dispatch(
      addWidget({
        categoryId: 'cspm',
        name: '   ',
        text: 'Valid text',
      }),
    )
    expect(
      selectCategoryById(testStore.getState(), 'cspm')?.widgets.length,
    ).toBe(initialWidgetCount)

    testStore.dispatch(
      addWidget({
        categoryId: 'cspm',
        name: 'Valid Name',
        text: '   ',
      }),
    )
    expect(
      selectCategoryById(testStore.getState(), 'cspm')?.widgets.length,
    ).toBe(initialWidgetCount)
  })

  it('addWidget with an unknown category does nothing', () => {
    const testStore = createAppStore()
    const previousState = testStore.getState().dashboard

    testStore.dispatch(
      addWidget({
        categoryId: 'non-existent' as unknown as CategoryId,
        name: 'N',
        text: 'T',
      }),
    )

    expect(testStore.getState().dashboard).toEqual(previousState)
  })

  it('removeWidget sets isActive false and keeps the widget in the list', () => {
    const testStore = createAppStore()
    const categoryId = 'cspm'
    const widgetId = 'cloud-accounts'

    testStore.dispatch(removeWidget({ categoryId, widgetId }))

    const category = selectCategoryById(testStore.getState(), categoryId)
    const widget = category?.widgets.find((w) => w.id === widgetId)

    expect(widget).toBeDefined()
    expect(widget?.isActive).toBe(false)
  })

  it('toggleWidget flips the flag both ways', () => {
    const testStore = createAppStore()
    const categoryId = 'cspm'
    const widgetId = 'cloud-accounts'

    testStore.dispatch(toggleWidget({ categoryId, widgetId }))
    let widget = selectCategoryById(
      testStore.getState(),
      categoryId,
    )?.widgets.find((w) => w.id === widgetId)
    expect(widget?.isActive).toBe(false)

    testStore.dispatch(toggleWidget({ categoryId, widgetId }))
    widget = selectCategoryById(testStore.getState(), categoryId)?.widgets.find(
      (w) => w.id === widgetId,
    )
    expect(widget?.isActive).toBe(true)
  })

  it('removeWidget/toggleWidget with unknown ids do nothing and do not crash', () => {
    const testStore = createAppStore()
    const previousState = testStore.getState().dashboard

    expect(() => {
      testStore.dispatch(
        removeWidget({ categoryId: 'cspm', widgetId: 'unknown-widget' }),
      )
      testStore.dispatch(
        removeWidget({
          categoryId: 'unknown-cat' as unknown as CategoryId,
          widgetId: 'w',
        }),
      )
      testStore.dispatch(
        toggleWidget({ categoryId: 'cspm', widgetId: 'unknown-widget' }),
      )
      testStore.dispatch(
        toggleWidget({
          categoryId: 'unknown-cat' as unknown as CategoryId,
          widgetId: 'w',
        }),
      )
    }).not.toThrow()

    expect(testStore.getState().dashboard).toEqual(previousState)
  })

  it('applyDrawerChanges sets isActive, appends new widgets, and ignores unknown ids', () => {
    const testStore = createAppStore()
    testStore.dispatch(
      applyDrawerChanges({
        activeStates: {
          'cloud-accounts': false,
          'non-existent-widget': true,
        },
        newWidgets: [
          {
            id: 'new-drawer-widget',
            categoryId: 'cwpp',
            name: 'New CWPP Widget',
            text: 'CWPP Text',
          },
          {
            id: 'invalid-cat-widget',
            categoryId: 'invalid-cat' as unknown as CategoryId,
            name: 'Bad Category',
            text: 'Some Text',
          },
        ],
      })
    )

    const state = testStore.getState()
    const cloudAccounts = selectCategoryById(state, 'cspm')?.widgets.find(
      (w) => w.id === 'cloud-accounts'
    )
    expect(cloudAccounts?.isActive).toBe(false)

    const newWidget = selectCategoryById(state, 'cwpp')?.widgets.find(
      (w) => w.id === 'new-drawer-widget'
    )
    expect(newWidget).toBeDefined()
    expect(newWidget?.name).toBe('New CWPP Widget')
    expect(newWidget?.isActive).toBe(true)
  })

  it('applyDrawerChanges sets isActive, appends new widgets, and ignores unknown ids', () => {
    const testStore = createAppStore()
    testStore.dispatch(
      applyDrawerChanges({
        activeStates: {
          'cloud-accounts': false,
          'non-existent-widget': true,
        },
        newWidgets: [
          {
            id: 'new-drawer-widget',
            categoryId: 'cwpp',
            name: 'New CWPP Widget',
            text: 'CWPP Text',
          },
          {
            id: 'invalid-cat-widget',
            categoryId: 'invalid-cat' as unknown as CategoryId,
            name: 'Bad Category',
            text: 'Some Text',
          },
        ],
      }),
    )

    const state = testStore.getState()
    const cloudAccounts = selectCategoryById(state, 'cspm')?.widgets.find(
      (w) => w.id === 'cloud-accounts',
    )
    expect(cloudAccounts?.isActive).toBe(false)

    const newWidget = selectCategoryById(state, 'cwpp')?.widgets.find(
      (w) => w.id === 'new-drawer-widget',
    )
    expect(newWidget).toBeDefined()
    expect(newWidget?.name).toBe('New CWPP Widget')
    expect(newWidget?.isActive).toBe(true)
  })

  it('selectActiveWidgets excludes inactive widgets and returns the same reference when state is unchanged', () => {
    const testStore = createAppStore()
    const categoryId = 'cspm'

    const activeBefore = selectActiveWidgets(testStore.getState(), categoryId)
    const activeAgain = selectActiveWidgets(testStore.getState(), categoryId)

    expect(activeBefore).toBe(activeAgain)
    expect(activeBefore.every((w) => w.isActive)).toBe(true)

    testStore.dispatch(removeWidget({ categoryId, widgetId: 'cloud-accounts' }))

    const activeAfter = selectActiveWidgets(testStore.getState(), categoryId)
    expect(activeAfter).not.toBe(activeBefore)
    expect(activeAfter.some((w) => w.id === 'cloud-accounts')).toBe(false)
    expect(activeAfter.length).toBe(activeBefore.length - 1)
  })

  it('selectAllWidgets includes inactive widgets', () => {
    const testStore = createAppStore()
    testStore.dispatch(
      removeWidget({ categoryId: 'cspm', widgetId: 'cloud-accounts' }),
    )

    const allWidgets = selectAllWidgets(testStore.getState())
    const target = allWidgets.find(
      (item) => item.widget.id === 'cloud-accounts',
    )

    expect(target).toBeDefined()
    expect(target?.categoryId).toBe('cspm')
    expect(target?.widget.isActive).toBe(false)

    const categories = selectCategories(testStore.getState())
    const totalCount = categories.reduce(
      (sum, cat) => sum + cat.widgets.length,
      0,
    )
    expect(allWidgets).toHaveLength(totalCount)
  })
})
