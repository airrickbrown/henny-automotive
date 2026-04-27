import { X, Search, FilterX } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { VehicleFilters } from '../../types/filters'
import type { VehicleCondition } from '../../types/vehicle'

interface FilterSidebarProps {
  filters: VehicleFilters
  onChange: (updated: VehicleFilters) => void
  manufacturers: string[]   // derived from live vehicle data
  className?: string
}

const CONDITIONS: Array<{ label: string; value: 'ALL' | VehicleCondition }> = [
  { label: 'All Stock',      value: 'ALL' },
  { label: 'New (Low KM)',   value: 'NEW (LOW KM)' },
  { label: 'Pre-Owned USA',  value: 'PRE-OWNED USA' },
  { label: 'Local Stock',    value: 'LOCAL STOCK' },
]

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-headline font-bold text-white uppercase tracking-widest text-xs mb-5 flex items-center gap-3">
      <span className="w-8 h-px bg-primary-container flex-shrink-0" />
      {children}
    </h3>
  )
}

export default function FilterSidebar({ filters, onChange, manufacturers, className }: FilterSidebarProps) {
  return (
    <aside className={cn('w-full md:w-64 flex-shrink-0 space-y-10', className)}>

      {/* ── Search ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Search</SectionHeader>
        <div className="relative group">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Make, model, spec..."
            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary-container text-white p-4 font-body text-sm placeholder:text-white/20 transition-all outline-none"
          />
          {filters.search ? (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          ) : (
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-container transition-colors pointer-events-none" />
          )}
        </div>
      </section>

      {/* ── Manufacturer — single select ───────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <SectionHeader>Manufacturer</SectionHeader>
          {filters.manufacturer && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, manufacturer: '' })}
              className="font-label text-[9px] uppercase tracking-widest text-primary-container hover:text-white transition-colors -mt-5"
            >
              Clear
            </button>
          )}
        </div>
        {manufacturers.length === 0 ? (
          <p className="font-label text-[10px] uppercase tracking-widest text-white/20">No vehicles loaded</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {manufacturers.map((make) => {
              const active = filters.manufacturer === make
              return (
                <button
                  key={make}
                  type="button"
                  onClick={() => onChange({ ...filters, manufacturer: active ? '' : make })}
                  className={cn(
                    'text-left py-2.5 px-4 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-150',
                    active
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-white/50 hover:text-white hover:bg-surface-container'
                  )}
                >
                  {make}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Condition ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Condition</SectionHeader>
        <div className="flex flex-col gap-1.5">
          {CONDITIONS.map((opt) => {
            const active = filters.condition === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...filters, condition: opt.value })}
                className={cn(
                  'text-left py-2.5 px-4 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-150',
                  active
                    ? 'bg-primary-container text-white'
                    : 'bg-surface-container-low text-white/50 hover:text-white hover:bg-surface-container'
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Active filters summary ─────────────────────────────── */}
      {(filters.search || filters.manufacturer || filters.condition !== 'ALL') && (
        <section>
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: '', manufacturer: '', condition: 'ALL', category: 'ALL CARS' })}
            className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
          >
            <FilterX size={14} />
            Clear all filters
          </button>
        </section>
      )}

    </aside>
  )
}
