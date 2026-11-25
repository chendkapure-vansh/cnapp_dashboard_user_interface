import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import {
  addDraftWidget,
  closeDrawer,
  openDrawer,
  setActiveTab,
  toggleDraftWidget,
} from '@/features/widget-drawer/drawerSlice'

describe('drawerSlice', () => {
  it('openDrawer sets isOpen to true, sets activeTab, and clears drafts', () => {
    const store = createAppStore()
    store.dispatch(
      addDraftWidget({
        categoryId: 'cspm',
        name: 'Draft Widget',
        text: 'Some Text',
      })
    )
    expect(store.getState().drawer.draftNewWidgets).toHaveLength(1)

    store.dispatch(openDrawer('cwpp'))
    const state = store.getState().drawer
    expect(state.isOpen).toBe(true)
    expect(state.activeTab).toBe('cwpp')
    expect(state.draftNewWidgets).toHaveLength(0)
    expect(state.draftActive).toEqual({})
  })

  it('setActiveTab changes the active tab', () => {
    const store = createAppStore()
    store.dispatch(openDrawer('cspm'))
    store.dispatch(setActiveTab('registry'))
    expect(store.getState().drawer.activeTab).toBe('registry')
  })

  it('toggleDraftWidget toggles boolean state for a widget', () => {
    const store = createAppStore()
    store.dispatch(openDrawer('cspm'))
    store.dispatch(toggleDraftWidget('cloud-accounts'))
    expect(store.getState().drawer.draftActive['cloud-accounts']).toBe(true)

    store.dispatch(toggleDraftWidget('cloud-accounts'))
    expect(store.getState().drawer.draftActive['cloud-accounts']).toBe(false)
  })

  it('addDraftWidget guards against empty or whitespace name/text', () => {
    const store = createAppStore()
    store.dispatch(openDrawer('cspm'))

    store.dispatch(
      addDraftWidget({
        categoryId: 'cspm',
        name: '   ',
        text: 'Valid description',
      })
    )
    expect(store.getState().drawer.draftNewWidgets).toHaveLength(0)

    store.dispatch(
      addDraftWidget({
        categoryId: 'cspm',
        name: 'Valid Name',
        text: '   ',
      })
    )
    expect(store.getState().drawer.draftNewWidgets).toHaveLength(0)
  })

  it('closeDrawer closes the drawer and clears drafts', () => {
    const store = createAppStore()
    store.dispatch(openDrawer('cspm'))
    store.dispatch(toggleDraftWidget('cloud-accounts'))
    store.dispatch(
      addDraftWidget({
        categoryId: 'cspm',
        name: 'Test',
        text: 'Desc',
      })
    )

    store.dispatch(closeDrawer())
    const state = store.getState().drawer
    expect(state.isOpen).toBe(false)
    expect(state.draftActive).toEqual({})
    expect(state.draftNewWidgets).toHaveLength(0)
  })
})
