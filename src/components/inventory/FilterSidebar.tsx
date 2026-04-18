import { cn } from '../../lib/utils'
import { MANUFACTURERS } from '../../lib/constants'
import type { VehicleFilters } from '../../types/filters'
import type { VehicleCondition } from '../../types/vehicle'

interface FilterSidebarProps {
  filters: VehicleFilters
  onChange: (updated: VehicleFilters) => void
  className?: string
}

const CONDITIONS: Array<{ label: string; value: 'ALL' | VehicleCondition }> = [
  { label: 'All Stock',     value: 'ALL' },
  { label: 'New (Low KM)',  value: 'NEW (LOW KM)' },
  { label: 'Pre-Owned USA', value: 'PRE-OWNED USA' },
  { label: 'Local Stock',   value: 'LOCAL STOCK' },
]

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-headline font-bold text-white uppercase tracking-widest text-xs mb-5 flex items-center gap-3">
      <span className="w-8 h-px bg-primary-container flex-shrink-0" />
      {children}
    </h3>
  )
}

export default function FilterSidebar({ filters, onChange, className }: FilterSidebarProps) {
  function setSearch(search: string) {
    onChange({ ...filters, search })
  }

  function toggleManufacturer(make: string) {
    const next = filters.manufacturers.includes(make)
      ? filters.manufacturers.filter((m) => m !== make)
      : [...filters.manufacturers, make]
    onChange({ ...filters, manufacturers: next })
  }

  function setCondition(condition: typeof filters.condition) {
    onChange({ ...filters, condition })
  }

  return (
    <aside className={cn('w-full md:w-72 flex-shrink-0 space-y-10', className)}>

      {/* ── Search ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Search Machinery</SectionHeader>
        <div className="relative group">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model or spec..."
            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary-container text-white p-4 font-body text-sm placeholder:text-white/20 transition-all outline-none"
          />
          <span className="font-material absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-container transition-colors pointer-events-none">
            search
          </span>
        </div>
      </section>

      {/* ── Manufacturer ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Manufacturer</SectionHeader>
        <div className="space-y-3">
          {MANUFACTURERS.map((make) => {
            const checked = filters.manufacturers.includes(make)
            return (
              <label key={make} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleManufacturer(make)}
                  className="rounded-none bg-surface-container-high border-outline-variant text-primary-container focus:ring-primary-container focus:ring-1 cursor-pointer"
                />
                <span
                  className={cn(
                    'font-label text-sm uppercase tracking-wider transition-colors duration-150',
                    checked ? 'text-white' : 'text-white/50 group-hover:text-white'
                  )}
                >
                  {make}
                </span>
              </label>
            )
          })}
        </div>
      </section>

      {/* ── Condition ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Condition</SectionHeader>
        <div className="flex flex-col gap-2">
          {CONDITIONS.map((opt) => {
            const active = filters.condition === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCondition(opt.value)}
                className={cn(
                  'text-left py-3 px-4 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-150',
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

    </aside>
  )
}
