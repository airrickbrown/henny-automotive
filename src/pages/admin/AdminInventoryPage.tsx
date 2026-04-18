import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { vehicles as initialVehicles } from '../../data/vehicles'
import { cn, formatPrice } from '../../lib/utils'
import type { Vehicle, VehicleStatus, VehicleCondition, VehicleLocation, VehicleCategory } from '../../types/vehicle'

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS: (VehicleStatus | '')[] = [
  '', 'JUST ARRIVED', 'HOT DEAL', 'FEATURED', 'NEW ARRIVAL',
  'USA SOURCED', 'IN TRANSIT', 'SHIPPING FROM USA', 'LIMITED',
]
const CONDITION_OPTIONS: VehicleCondition[] = ['NEW (LOW KM)', 'PRE-OWNED USA', 'LOCAL STOCK']
const LOCATION_OPTIONS: VehicleLocation[]   = ['USA', 'GHANA', 'IN TRANSIT']
const CATEGORY_OPTIONS: VehicleCategory[]   = ['SUV', 'COUPE', 'SEDAN', 'TRUCK', 'SPORTS']

const STATUS_COLORS: Record<string, string> = {
  'JUST ARRIVED':       'bg-secondary/10 text-secondary border-secondary/30',
  'HOT DEAL':           'bg-primary-container/10 text-primary-container border-primary-container/30',
  'FEATURED':           'bg-primary-container/10 text-primary-container border-primary-container/30',
  'NEW ARRIVAL':        'bg-secondary/10 text-secondary border-secondary/30',
  'USA SOURCED':        'bg-surface-bright text-white/60 border-outline-variant/20',
  'IN TRANSIT':         'bg-surface-bright text-white/60 border-outline-variant/20',
  'SHIPPING FROM USA':  'bg-surface-bright text-white/60 border-outline-variant/20',
  'LIMITED':            'bg-primary-container/10 text-primary-container border-primary-container/30',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-surface-container-low p-5 flex items-center gap-4">
      <span className="font-material text-2xl text-primary-container">{icon}</span>
      <div>
        <p className="font-headline font-black text-2xl text-white">{value}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}

// Toggle pill
function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1 font-label text-[10px] uppercase tracking-widest font-bold border transition-colors duration-150',
        value
          ? 'bg-primary-container/10 text-primary-container border-primary-container/40'
          : 'bg-transparent text-white/30 border-outline-variant/20 hover:text-white/60'
      )}
    >
      <span className={cn('font-material text-sm', value ? 'text-primary-container' : 'text-white/30')}>
        {value ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      {label}
    </button>
  )
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────
interface EditDrawerProps {
  vehicle: Vehicle | null
  open: boolean
  onClose: () => void
  onSave: (updated: Vehicle) => void
}

function EditDrawer({ vehicle, open, onClose, onSave }: EditDrawerProps) {
  const [draft, setDraft] = useState<Vehicle | null>(null)

  // Sync draft when vehicle changes
  if (vehicle && (!draft || draft.id !== vehicle.id)) {
    setDraft({ ...vehicle })
  }
  if (!vehicle && draft) {
    setDraft(null)
  }

  if (!draft) return null

  function field(key: keyof Vehicle, label: string, type: 'text' | 'number' = 'text') {
    return (
      <div>
        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
          {label}
        </label>
        <input
          type={type}
          value={type === 'number' ? (draft![key] as number | null) ?? '' : (draft![key] as string) ?? ''}
          onChange={(e) =>
            setDraft((d) => d ? {
              ...d,
              [key]: type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value,
            } : d)
          }
          className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all"
        />
      </div>
    )
  }

  function selectField<T extends string>(
    key: keyof Vehicle,
    label: string,
    options: (T | '')[],
    nullable = false
  ) {
    return (
      <div>
        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
          {label}
        </label>
        <select
          value={(draft![key] as string) ?? ''}
          onChange={(e) =>
            setDraft((d) => d ? {
              ...d,
              [key]: e.target.value === '' ? (nullable ? undefined : '') : e.target.value,
            } : d)
          }
          className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
        >
          {nullable && <option value="">— None —</option>}
          {options.filter(Boolean).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-background/60 z-40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-screen w-full max-w-[520px] bg-surface-container-low z-50 flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-outline-variant/10">
          <div>
            <p className="font-headline font-black italic uppercase text-white text-lg leading-none">
              Edit Vehicle
            </p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              {draft.sku}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-material text-xl">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Identity */}
          <div className="grid grid-cols-2 gap-4">
            {field('make', 'Make')}
            {field('model', 'Model')}
            {field('year', 'Year', 'number')}
            {field('trim', 'Trim / Colour')}
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4 items-end">
            {field('price', 'Price (USD)', 'number')}
            <div className="pb-0.5">
              <Toggle
                value={draft.showPublicPrice}
                onChange={(v) => setDraft((d) => d ? { ...d, showPublicPrice: v } : d)}
                label="Show Price"
              />
            </div>
          </div>

          {/* Classification */}
          <div className="grid grid-cols-2 gap-4">
            {selectField<VehicleCategory>('category', 'Category', CATEGORY_OPTIONS)}
            {selectField<VehicleCondition>('condition', 'Condition', CONDITION_OPTIONS)}
            {selectField<VehicleLocation>('location', 'Location', LOCATION_OPTIONS)}
            {selectField<VehicleStatus>('status', 'Status', STATUS_OPTIONS, true)}
          </div>

          {/* SKU */}
          {field('sku', 'SKU')}

          {/* Spec */}
          <div className="border-t border-outline-variant/10 pt-5">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Spec
            </p>
            <div className="space-y-3">
              {field('spec', 'Engine')}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Mileage
                </label>
                <input
                  type="text"
                  value={draft.spec.mileage}
                  onChange={(e) =>
                    setDraft((d) => d ? { ...d, spec: { ...d.spec, mileage: e.target.value } } : d)
                  }
                  className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Transmission
                </label>
                <input
                  type="text"
                  value={draft.spec.transmission}
                  onChange={(e) =>
                    setDraft((d) => d ? { ...d, spec: { ...d.spec, transmission: e.target.value } } : d)
                  }
                  className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="border-t border-outline-variant/10 pt-5">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Flags
            </p>
            <div className="flex flex-wrap gap-3">
              <Toggle
                value={draft.isFeatured}
                onChange={(v) => setDraft((d) => d ? { ...d, isFeatured: v } : d)}
                label="Featured"
              />
              <Toggle
                value={draft.isHotDeal}
                onChange={(v) => setDraft((d) => d ? { ...d, isHotDeal: v } : d)}
                label="Hot Deal"
              />
            </div>
          </div>

          {/* Overview */}
          <div className="border-t border-outline-variant/10 pt-5">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
              Overview
            </label>
            <textarea
              rows={5}
              value={draft.overview}
              onChange={(e) => setDraft((d) => d ? { ...d, overview: e.target.value } : d)}
              className="w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"
            />
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-7 py-5 border-t border-outline-variant/10 flex gap-3">
          <button
            type="button"
            onClick={() => { onSave(draft); onClose() }}
            className="flex-1 bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs py-4 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-4 border border-outline-variant/30 text-white/60 font-headline font-bold uppercase tracking-widest text-xs hover:text-white hover:border-outline-variant/60 transition-all duration-150"
          >
            Cancel
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AdminInventoryPage() {
  const [rows, setRows]             = useState<Vehicle[]>(initialVehicles)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editId, setEditId]         = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((v) => {
      const matchSearch =
        !q ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.sku.toLowerCase().includes(q) ||
        String(v.year).includes(q)
      const matchStatus = !statusFilter || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [rows, search, statusFilter])

  const editVehicle = rows.find((v) => v.id === editId) ?? null

  const stats = useMemo(() => ({
    total:    rows.length,
    usa:      rows.filter((v) => v.location === 'USA').length,
    ghana:    rows.filter((v) => v.location === 'GHANA').length,
    transit:  rows.filter((v) => v.location === 'IN TRANSIT').length,
    featured: rows.filter((v) => v.isFeatured).length,
  }), [rows])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openEdit(id: string) {
    setEditId(id)
    setDrawerOpen(true)
  }

  function handleSave(updated: Vehicle) {
    setRows((prev) => prev.map((v) => v.id === updated.id ? updated : v))
  }

  function toggleFeatured(id: string) {
    setRows((prev) => prev.map((v) => v.id === id ? { ...v, isFeatured: !v.isFeatured } : v))
  }

  function toggleHotDeal(id: string) {
    setRows((prev) => prev.map((v) => v.id === id ? { ...v, isHotDeal: !v.isHotDeal } : v))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="max-w-[1400px]">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
            Inventory <span className="text-primary-container">Management</span>
          </h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
            {rows.length} vehicles · local session state
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCard label="Total Units"    value={stats.total}    icon="inventory_2" />
          <StatCard label="USA Stock"      value={stats.usa}      icon="flag" />
          <StatCard label="Ghana Showroom" value={stats.ghana}    icon="storefront" />
          <StatCard label="In Transit"     value={stats.transit}  icon="local_shipping" />
          <StatCard label="Featured"       value={stats.featured} icon="star" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <span className="font-material absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, year, SKU..."
              className="w-full bg-surface-container-low py-3 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-low py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Add button */}
          <button
            type="button"
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-3 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="font-material text-lg">add</span>
            Add Vehicle
          </button>
        </div>

        {/* Results count */}
        <p className="font-label text-[10px] uppercase tracking-widest text-white/30 mb-4">
          Showing <span className="text-white">{filtered.length}</span> of {rows.length} vehicles
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Vehicle', 'SKU', 'Category', 'Status', 'Price', 'Location', 'Featured', 'Hot Deal', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left font-label text-[10px] uppercase tracking-widest text-white/30 pb-3 pr-6 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors duration-150 group"
                >
                  {/* Vehicle */}
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-14 h-10 flex-shrink-0 overflow-hidden bg-surface-container">
                        {v.images[0] ? (
                          <img
                            src={v.images[0]}
                            alt={v.model}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-material text-sm text-white/20">directions_car</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-headline font-bold uppercase text-sm text-white leading-none">
                          {v.make} {v.model}
                        </p>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                          {v.year}{v.trim ? ` · ${v.trim}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-white/40">{v.sku}</span>
                  </td>

                  {/* Category */}
                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-2.5 py-1 bg-surface-container border border-outline-variant/20">
                      {v.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-6">
                    {v.status ? (
                      <span className={cn(
                        'font-label text-[10px] uppercase tracking-widest px-2.5 py-1 border',
                        STATUS_COLORS[v.status] ?? 'bg-surface-bright text-white/60 border-outline-variant/20'
                      )}>
                        {v.status}
                      </span>
                    ) : (
                      <span className="text-white/20 font-label text-[10px]">—</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-4 pr-6">
                    <span className={cn(
                      'font-headline font-bold text-sm',
                      v.showPublicPrice ? 'text-white' : 'text-white/30 italic'
                    )}>
                      {formatPrice(v.showPublicPrice ? v.price : null)}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="font-material text-sm text-white/30">location_on</span>
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                        {v.location}
                      </span>
                    </div>
                  </td>

                  {/* Featured toggle */}
                  <td className="py-4 pr-6">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(v.id)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center transition-colors duration-150',
                        v.isFeatured
                          ? 'text-primary-container'
                          : 'text-white/20 hover:text-white/50'
                      )}
                      aria-label={v.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <span className={v.isFeatured ? 'font-material-filled text-xl' : 'font-material text-xl'}>
                        star
                      </span>
                    </button>
                  </td>

                  {/* Hot Deal toggle */}
                  <td className="py-4 pr-6">
                    <button
                      type="button"
                      onClick={() => toggleHotDeal(v.id)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center transition-colors duration-150',
                        v.isHotDeal
                          ? 'text-primary-container'
                          : 'text-white/20 hover:text-white/50'
                      )}
                      aria-label={v.isHotDeal ? 'Remove hot deal' : 'Mark as hot deal'}
                    >
                      <span className={v.isHotDeal ? 'font-material-filled text-xl' : 'font-material text-xl'}>
                        local_fire_department
                      </span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        type="button"
                        onClick={() => openEdit(v.id)}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                        aria-label="Edit vehicle"
                      >
                        <span className="font-material text-lg">edit</span>
                      </button>
                      <Link
                        to={`/inventory/${v.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                        aria-label="View on site"
                      >
                        <span className="font-material text-lg">open_in_new</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <span className="font-material text-4xl text-white/10 block mb-3">search_off</span>
                    <p className="font-headline font-bold uppercase text-white/30 text-sm">No vehicles match</p>
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setStatusFilter('') }}
                      className="mt-3 font-label text-[10px] uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit drawer */}
      <EditDrawer
        vehicle={editVehicle}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
