import { describe, it, expect, vi } from 'vitest'

// Prevent supabase.ts from throwing on missing env vars during tests
vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn(), storage: { from: vi.fn() } },
}))

import { buildSlug } from '../lib/vehicles'
import { vehicleToDraft, EMPTY_DRAFT } from '../pages/admin/VehicleDrawer'
import type { Vehicle } from '../types/vehicle'

describe('buildSlug', () => {
  it('produces a lowercase hyphenated slug', () => {
    expect(buildSlug('BMW', 'M4', 2024)).toBe('bmw-m4-2024')
  })

  it('handles multi-word makes and models', () => {
    expect(buildSlug('Land Rover', 'Range Rover Sport', 2023)).toBe('land-rover-range-rover-sport-2023')
  })

  it('strips special characters', () => {
    expect(buildSlug('Rolls-Royce', 'Ghost (Black Badge)', 2022)).toBe('rolls-royce-ghost-black-badge-2022')
  })
})

const baseVehicle: Vehicle = {
  id: 'abc123',
  slug: 'bmw-m4-2024',
  make: 'BMW',
  model: 'M4',
  year: 2024,
  trim: 'Competition',
  price: 85000,
  spec: {
    engine: '3.0L I6',
    transmission: '8-Speed Auto',
    mileage: '5,000 KM',
    power: '503 HP',
    zeroToSixty: '3.4 SECONDS',
    drivetrain: 'AWD',
  },
  images: ['https://example.com/img.jpg'],
  status: 'FEATURED',
  condition: 'PRE-OWNED USA',
  location: 'USA',
  keyFeatures: ['Carbon Brakes', 'Bucket Seats'],
  overview: 'A great car.',
  isFeatured: true,
  isHotDeal: false,
  showPublicPrice: true,
  category: 'COUPE',
  sku: 'HA-M4-001',
  createdAt: '2024-01-01T00:00:00Z',
}

describe('vehicleToDraft', () => {
  it('converts a Vehicle into a VehicleDraft', () => {
    const draft = vehicleToDraft(baseVehicle)
    expect(draft.make).toBe('BMW')
    expect(draft.model).toBe('M4')
    expect(draft.year).toBe('2024')
    expect(draft.price).toBe('85000')
    expect(draft.keyFeaturesText).toBe('Carbon Brakes\nBucket Seats')
    expect(draft.isFeatured).toBe(true)
    expect(draft.isHotDeal).toBe(false)
  })

  it('coerces null price to empty string', () => {
    const draft = vehicleToDraft({ ...baseVehicle, price: null })
    expect(draft.price).toBe('')
  })

  it('coerces undefined trim to empty string', () => {
    const draft = vehicleToDraft({ ...baseVehicle, trim: undefined })
    expect(draft.trim).toBe('')
  })

  it('coerces undefined status to empty string', () => {
    const draft = vehicleToDraft({ ...baseVehicle, status: undefined })
    expect(draft.status).toBe('')
  })
})

describe('EMPTY_DRAFT', () => {
  it('has expected defaults', () => {
    expect(EMPTY_DRAFT.make).toBe('')
    expect(EMPTY_DRAFT.condition).toBe('PRE-OWNED USA')
    expect(EMPTY_DRAFT.location).toBe('USA')
    expect(EMPTY_DRAFT.showPublicPrice).toBe(true)
    expect(EMPTY_DRAFT.images).toEqual([])
  })
})
