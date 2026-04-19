import type { VehicleCondition, VehicleCategory } from './vehicle'
import type { PartCategory } from './part'

export interface VehicleFilters {
  search: string
  manufacturer: string          // single-select, '' = all
  minPrice: number
  maxPrice: number
  condition: 'ALL' | VehicleCondition
  category: 'ALL CARS' | VehicleCategory
}

export interface PartsFilters {
  category: 'ALL' | PartCategory
}
