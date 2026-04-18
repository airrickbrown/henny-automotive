import { useState, useMemo } from 'react'
import { vehicles } from '../data/vehicles'
import type { VehicleFilters } from '../types/filters'

const DEFAULT_FILTERS: VehicleFilters = {
  search: '',
  manufacturers: [],
  minPrice: 0,
  maxPrice: 0,
  condition: 'ALL',
  category: 'ALL CARS',
}

export function useVehicleFilters() {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      // Search — matches make, model, trim, or year
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const haystack = [v.make, v.model, v.trim ?? '', String(v.year)]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      // Manufacturers — if any are selected, vehicle must match one
      if (filters.manufacturers.length > 0) {
        if (!filters.manufacturers.includes(v.make)) return false
      }

      // Condition
      if (filters.condition !== 'ALL') {
        if (v.condition !== filters.condition) return false
      }

      // Category
      if (filters.category !== 'ALL CARS') {
        if (v.category !== filters.category) return false
      }

      return true
    })
  }, [filters])

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const activeFilterCount = [
    filters.search.trim() !== '',
    filters.manufacturers.length > 0,
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
