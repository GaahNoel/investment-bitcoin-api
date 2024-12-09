import { DateObject } from '@/domain/value-objects/date'
import { expect, describe, it } from 'vitest'

describe('DateObject', () => {
  describe('toShortString', () => {
    it('should return shortened string correctly', () => {
      const date = new DateObject(new Date('2024-01-01T00:00:00'))

      expect(date.toShortString()).toBe('2024-01-01')
    })
  })
})
