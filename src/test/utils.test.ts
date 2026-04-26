import { describe, it, expect } from 'vitest'
import { formatPrice, slugify, cn } from '../lib/utils'

describe('formatPrice', () => {
  it('returns PRICE ON REQ. for null', () => {
    expect(formatPrice(null)).toBe('PRICE ON REQ.')
  })

  it('formats whole dollar amounts with no decimal', () => {
    expect(formatPrice(45000)).toBe('$45,000')
  })

  it('formats zero as $0', () => {
    expect(formatPrice(0)).toBe('$0')
  })

  it('formats large prices with commas', () => {
    expect(formatPrice(1200000)).toBe('$1,200,000')
  })
})

describe('slugify', () => {
  it('lowercases text', () => {
    expect(slugify('BMW')).toBe('bmw')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('BMW M4')).toBe('bmw-m4')
  })

  it('strips non-word characters', () => {
    expect(slugify('Range Rover (Sport)')).toBe('range-rover-sport')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('Ford  F-150')).toBe('ford-f-150')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})

describe('cn', () => {
  it('joins classes with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})
