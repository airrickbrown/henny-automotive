import { useState, useEffect, useMemo } from 'react'
import { Search, SearchX, CloudOff, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import PageMeta from '../components/seo/PageMeta'
import { useVehicleFilters } from '../hooks/useVehicleFilters'
import { getVehicles } from '../lib/vehicles'
import { VEHICLE_CATEGORIES } from '../lib/constants'
import { cn } from '../lib/utils'
import PageWrapper from '../components/layout/PageWrapper'
import FilterSidebar from '../components/inventory/FilterSidebar'
import InventoryCard from '../components/inventory/InventoryCard'
import type { Vehicle } from '../types/vehicle'
import type { VehicleFilters } from '../types/filters'

type ViewMode = 'grid' | 'list'

// ── Mobile filter bar ────────────────────────────────────────────────────────
function MobileCategoryBar({
  filters,
  setFilters,
}: {
  filters: VehicleFilters
  setFilters: (f: VehicleFilters) => void
}) {
  return (
    <div className="space-y-4 mb-8 md:hidden">
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="SEARCH MODEL, MAKE, YEAR..."
          className="w-full bg-surface-container-low focus:ring-1 focus:ring-primary-container py-4 pl-12 pr-4 font-headline text-sm tracking-widest uppercase text-white placeholder:text-white/20 outline-none transition-all"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {VEHICLE_CATEGORIES.map((cat) => {
          const active = filters.category === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilters({ ...filters, category: cat })}
              className={cn(
                'flex-none px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest transition-colors duration-150 whitespace-nowrap',
                active
                  ? 'bg-primary-container text-white'
                  : 'bg-surface-container-low border border-outline-variant/20 text-on-surface-variant'
              )}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Empty / loading states ────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <SearchX size={48} className="text-on-surface-variant/30" />
      <p className="font-headline text-xl font-black uppercase text-white/40">No Vehicles Found</p>
      <p className="font-body text-sm text-on-surface-variant max-w-xs">
        Try adjusting your filters or clearing your search.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="font-headline font-bold text-xs uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
      >
        Clear All Filters
      </button>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-14 gap-x-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-4">
          <div className="aspect-[4/3] bg-surface-container-low" />
          <div className="h-4 bg-surface-container-low w-3/4" />
          <div className="h-3 bg-surface-container-low w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ── View toggle button ────────────────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="hidden md:flex items-center gap-1 bg-surface-container-low p-1">
      <button
        type="button"
        aria-label="Grid view"
        onClick={() => onChange('grid')}
        className={cn(
          'w-8 h-8 flex items-center justify-center transition-colors duration-150',
          view === 'grid' ? 'bg-primary-container text-white' : 'text-white/30 hover:text-white'
        )}
      >
        <LayoutGrid size={18} />
      </button>
      <button
        type="button"
        aria-label="List view"
        onClick={() => onChange('list')}
        className={cn(
          'w-8 h-8 flex items-center justify-center transition-colors duration-150',
          view === 'list' ? 'bg-primary-container text-white' : 'text-white/30 hover:text-white'
        )}
      >
        <List size={18} />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [vehicles, setVehicles]     = useState<Vehicle[]>([])
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [viewMode, setViewMode]     = useState<ViewMode>('grid')

  function load() {
    setFetchError(false)
    setLoading(true)
    getVehicles()
      .then(setVehicles)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Derive manufacturers alphabetically from live vehicle data
  const manufacturers = useMemo(
    () => [...new Set(vehicles.map(v => v.make))].sort(),
    [vehicles]
  )

  const { filters, setFilters, filtered, total, resetFilters } = useVehicleFilters(vehicles)

  return (
    <PageWrapper>
      <PageMeta
        title="The Inventory"
        description="Browse our meticulously curated selection of high-performance vehicles — sourced from the USA, delivered to Ghana. SUVs, sedans, sports cars and more."
        path="/inventory"
      />
      <div className="px-6 md:px-8 max-w-[1920px] mx-auto">

        <header className="mb-10 md:mb-12">
          <h1 className="font-headline font-black italic tracking-tighter uppercase leading-none text-on-surface text-[clamp(3rem,8vw,5rem)] mb-4">
            The{' '}<span className="text-primary-container">Inventory</span>
          </h1>
          <p className="font-body text-on-surface-variant text-lg font-light max-w-2xl">
            Meticulously curated high-performance machinery. From the streets of the USA to the heart of Ghana.
          </p>
        </header>

        <MobileCategoryBar filters={filters} setFilters={setFilters} />

        <div className="flex flex-col md:flex-row gap-10 md:gap-12">

          {/* Desktop sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            manufacturers={manufacturers}
            className="hidden md:block"
          />

          {/* Results column */}
          <div className="flex-grow min-w-0">
            {/* Results bar */}
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-white/40">
                {loading ? 'Loading…' : (
                  <>
                    Showing{' '}
                    <span className="text-white">{filtered.length}</span>
                    {' '}of {total} Available Units
                  </>
                )}
              </span>
              <ViewToggle view={viewMode} onChange={setViewMode} />
            </div>

            {/* Content */}
            {fetchError ? (
              <div className="py-24 text-center">
                <CloudOff size={48} className="text-white/10 block mb-4" />
                <p className="font-headline font-bold uppercase text-white/40">Failed to load inventory</p>
                <button type="button" onClick={load} className="mt-4 font-label text-[10px] uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5">
                  Retry
                </button>
              </div>
            ) : loading ? (
              <SkeletonGrid />
            ) : filtered.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : viewMode === 'list' ? (
              <div className="space-y-6">
                {filtered.map((vehicle) => (
                  <InventoryCard key={vehicle.id} vehicle={vehicle} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-14 gap-x-8">
                {filtered.map((vehicle) => (
                  <InventoryCard key={vehicle.id} vehicle={vehicle} view="grid" />
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button type="button" aria-label="Previous page" className="w-12 h-12 flex items-center justify-center border border-outline-variant/30 text-white hover:bg-primary-container hover:border-primary-container transition-all duration-150">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" className="w-12 h-12 flex items-center justify-center bg-primary-container text-white font-headline font-bold">1</button>
                <button type="button" aria-label="Next page" className="w-12 h-12 flex items-center justify-center border border-outline-variant/30 text-white hover:bg-primary-container hover:border-primary-container transition-all duration-150">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
