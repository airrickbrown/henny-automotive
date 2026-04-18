import type { VehicleCondition, VehicleCategory } from './vehicle'
import type { PartCategory } from './part'

export interface VehicleFilters {
  search: string
  manufacturers: string[]
  minPrice: number
  maxPrice: number
  condition: 'ALL' | VehicleCondition
  category: 'ALL CARS' | VehicleCategory
}

export interface PartsFilters {
  category: 'ALL' | PartCategory
}
