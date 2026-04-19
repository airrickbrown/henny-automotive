import { useState, useMemo } from 'react'
import type { Vehicle } from '../types/vehicle'
import type { VehicleFilters } from '../types/filters'

const DEFAULT_FILTERS: VehicleFilters = {
  search: '',
  manufacturer: '',
  minPrice: 0,
  maxPrice: 0,
  condition: 'ALL',
  category: 'ALL CARS',
}

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      // Real-time search: make, model, trim, year
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const haystack = [v.make, v.model, v.trim ?? '', String(v.year), v.spec.engine]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      // Single manufacturer filter
      if (filters.manufacturer && v.make !== filters.manufacturer) return false

      // Condition filter
      if (filters.condition !== 'ALL' && v.condition !== filters.condition) return false

      // Category filter
      if (filters.category !== 'ALL CARS' && v.category !== filters.category) return false

      return true
    })
  }, [vehicles, filters])

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const activeFilterCount = [
    filters.search.trim() !== '',
    filters.manufacturer !== '',
    filters.condition !== 'ALL',
    filters.category !== 'ALL CARS',
  ].filter(Boolean).length

  return {
    filters,
    setFilters,
    filtered,
    total: vehicles.length,
    activeFilterCount,
    resetFilters,
  }
}
