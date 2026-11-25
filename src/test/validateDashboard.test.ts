import { describe, expect, it } from 'vitest'
import { loadDashboard } from '@/utils/loadDashboard'
import {
  DashboardValidationError,
  validateDashboard,
} from '@/utils/validateDashboard'

describe('validateDashboard and loadDashboard', () => {
  it('validates the real dashboard.json successfully via loadDashboard', () => {
    const dashboard = loadDashboard()
    expect(dashboard.categories).toHaveLength(4)
    expect(dashboard.categories[0].id).toBe('cspm')
    expect(dashboard.categories[0].widgets).toHaveLength(2)
  })

  it('rejects null input and specifies the path in the error message', () => {
    expect(() => validateDashboard(null)).toThrowError(
      new RegExp('Validation error at root')
    )
  })

  it('rejects when categories is not an array and specifies path', () => {
    expect(() =>
      validateDashboard({ categories: 'not-an-array' })
    ).toThrowError(DashboardValidationError)
    try {
      validateDashboard({ categories: 'not-an-array' })
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe('categories')
      expect((err as Error).message).toContain('categories')
    }
  })

  it('rejects duplicate widget ids across the whole dashboard', () => {
    const invalidData = {
      categories: [
        {
          id: 'cspm',
          name: 'CSPM',
          tabLabel: 'CSPM',
          widgets: [
            {
              id: 'dup-widget',
              name: 'Widget 1',
              isActive: true,
              type: 'empty',
              message: 'No data',
            },
          ],
        },
        {
          id: 'cwpp',
          name: 'CWPP',
          tabLabel: 'CWPP',
          widgets: [
            {
              id: 'dup-widget',
              name: 'Widget 2',
              isActive: true,
              type: 'empty',
              message: 'No data',
            },
          ],
        },
      ],
    }

    try {
      validateDashboard(invalidData)
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe(
        'categories[1].widgets[0].id'
      )
      expect((err as Error).message).toContain(
        'Duplicate widget id "dup-widget"'
      )
    }
  })

  it('rejects unknown widget type and includes path', () => {
    const invalidData = {
      categories: [
        {
          id: 'cspm',
          name: 'CSPM',
          tabLabel: 'CSPM',
          widgets: [
            {
              id: 'invalid-type-widget',
              name: 'Widget',
              isActive: true,
              type: 'unknown_chart',
            },
          ],
        },
      ],
    }

    try {
      validateDashboard(invalidData)
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe(
        'categories[0].widgets[0].type'
      )
      expect((err as Error).message).toContain(
        'Unknown widget type "unknown_chart"'
      )
    }
  })

  it('rejects negative segment values and includes path', () => {
    const invalidData = {
      categories: [
        {
          id: 'cspm',
          name: 'CSPM',
          tabLabel: 'CSPM',
          widgets: [
            {
              id: 'negative-segment-widget',
              name: 'Widget',
              isActive: true,
              type: 'donut',
              total: 10,
              segments: [
                {
                  label: 'Good',
                  value: -5,
                  color: 'blue',
                },
              ],
            },
          ],
        },
      ],
    }

    try {
      validateDashboard(invalidData)
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe(
        'categories[0].widgets[0].segments[0].value'
      )
      expect((err as Error).message).toContain('non-negative number')
    }
  })

  it('rejects unknown color keys and includes path', () => {
    const invalidData = {
      categories: [
        {
          id: 'cspm',
          name: 'CSPM',
          tabLabel: 'CSPM',
          widgets: [
            {
              id: 'bad-color-widget',
              name: 'Widget',
              isActive: true,
              type: 'donut',
              total: 10,
              segments: [
                {
                  label: 'Bad Color',
                  value: 10,
                  color: 'neon-purple',
                },
              ],
            },
          ],
        },
      ],
    }

    try {
      validateDashboard(invalidData)
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe(
        'categories[0].widgets[0].segments[0].color'
      )
      expect((err as Error).message).toContain(
        'Unknown color key "neon-purple"'
      )
    }
  })

  it('rejects duplicate category ids', () => {
    const invalidData = {
      categories: [
        {
          id: 'cspm',
          name: 'CSPM 1',
          tabLabel: 'CSPM',
          widgets: [],
        },
        {
          id: 'cspm',
          name: 'CSPM 2',
          tabLabel: 'CSPM',
          widgets: [],
        },
      ],
    }

    try {
      validateDashboard(invalidData)
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(DashboardValidationError)
      expect((err as DashboardValidationError).path).toBe('categories[1].id')
      expect((err as Error).message).toContain('Duplicate category id "cspm"')
    }
  })
})
