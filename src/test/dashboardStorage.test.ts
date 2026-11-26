import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  loadSavedDashboard,
  saveDashboard,
  STORAGE_KEY,
} from '@/utils/dashboardStorage'
import { loadDashboard } from '@/utils/loadDashboard'

describe('dashboardStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('loadSavedDashboard returns null when empty', () => {
    expect(loadSavedDashboard()).toBeNull()
  })

  it('loadSavedDashboard returns the saved dashboard when valid', () => {
    const defaultData = loadDashboard()
    saveDashboard(defaultData)

    const loaded = loadSavedDashboard()
    expect(loaded).toEqual(defaultData)
  })

  it('loadSavedDashboard returns null and warns on invalid JSON', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.setItem(STORAGE_KEY, '{ invalid json')

    const loaded = loadSavedDashboard()
    expect(loaded).toBeNull()
    expect(warnSpy).toHaveBeenCalled()
  })

  it('loadSavedDashboard returns null and warns on schema-invalid payload', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ categories: 'not-array' })
    )

    const loaded = loadSavedDashboard()
    expect(loaded).toBeNull()
    expect(warnSpy).toHaveBeenCalled()
  })

  it('saveDashboard writes JSON to localStorage', () => {
    const defaultData = loadDashboard()
    saveDashboard(defaultData)

    const raw = window.localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeDefined()
    expect(JSON.parse(raw!)).toEqual(defaultData)
  })

  it('saveDashboard does not throw when setItem throws (and warns)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const defaultData = loadDashboard()
    expect(() => saveDashboard(defaultData)).not.toThrow()
    expect(warnSpy).toHaveBeenCalled()
  })
})
