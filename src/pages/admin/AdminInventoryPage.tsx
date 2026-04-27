import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Loader2, CloudOff, MapPin, Star, Flame, Pencil, ExternalLink, Trash2, SearchX, Car, Flag, Store, Truck, type LucideIcon } from 'lucide-react'
import { getAllVehicles, updateVehicle, deleteVehicle } from '../../lib/vehicles'
import { supabase } from '../../lib/supabase'
import { cn, formatPrice } from '../../lib/utils'
import type { Vehicle } from '../../types/vehicle'
import VehicleDrawer, {
  vehicleToDraft,
  STATUS_OPTIONS,
  type VehicleDraft,
} from './VehicleDrawer'

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  'JUST ARRIVED':      'bg-secondary/10 text-secondary border-secondary/30',
  'HOT DEAL':          'bg-primary-container/10 text-primary-container border-primary-container/30',
  'FEATURED':          'bg-primary-container/10 text-primary-container border-primary-container/30',
  'NEW ARRIVAL':       'bg-secondary/10 text-secondary border-secondary/30',
  'USA SOURCED':       'bg-surface-bright text-white/60 border-outline-variant/20',
  'IN TRANSIT':        'bg-surface-bright text-white/60 border-outline-variant/20',
  'SHIPPING FROM USA': 'bg-surface-bright text-white/60 border-outline-variant/20',
  'LIMITED':           'bg-primary-container/10 text-primary-container border-primary-container/30',
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="bg-surface-container-low p-5 flex items-center gap-4">
      <Icon size={24} className="text-primary-container" />
      <div>
        <p className="font-headline font-black text-2xl text-white">{value}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminInventoryPage() {
  const [rows, setRows]               = useState<Vehicle[]>([])
  const [loading, setLoading]         = useState(true)
  const [fetchError, setFetchError]   = useState(false)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [drawerMode, setDrawerMode]   = useState<'add' | 'edit'>('add')
  const [editId, setEditId]           = useState<string | null>(null)
  const [editDraftSeed, setEditDraftSeed] = useState<VehicleDraft | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting]       = useState<string | null>(null)
  const [togglingId, setTogglingId]   = useState<string | null>(null)

  function loadVehicles() {
    setLoading(true)
    setFetchError(false)
    getAllVehicles()
      .then(setRows)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadVehicles()
    const ch = supabase
      .channel('inventory-vehicles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, loadVehicles)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((v) => {
      const matchSearch = !q ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.sku.toLowerCase().includes(q) ||
        String(v.year).includes(q)
      const matchStatus = !statusFilter || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total:    rows.length,
    usa:      rows.filter(v => v.location === 'USA').length,
    ghana:    rows.filter(v => v.location === 'GHANA').length,
    transit:  rows.filter(v => v.location === 'IN TRANSIT').length,
    featured: rows.filter(v => v.isFeatured).length,
  }), [rows])

  function openAdd() {
    setEditDraftSeed(null)
    setDrawerMode('add')
    setEditId(null)
    setDrawerOpen(true)
  }

  function openEdit(id: string) {
    const v = rows.find(r => r.id === id)
    setEditDraftSeed(v ? vehicleToDraft(v) : null)
    setDrawerMode('edit')
    setEditId(id)
    setDrawerOpen(true)
  }

  function handleSaved(saved: Vehicle) {
    setRows(prev => {
      const exists = prev.some(r => r.id === saved.id)
      if (exists) return prev.map(r => r.id === saved.id ? saved : r)
      return [saved, ...prev]
    })
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteVehicle(id)
      setRows(prev => prev.filter(r => r.id !== id))
    } finally {
      setDeleting(null)
      setDeleteConfirmId(null)
    }
  }

  async function toggleFlag(id: string, flag: 'isFeatured' | 'isHotDeal') {
    const vehicle = rows.find(r => r.id === id)
    if (!vehicle || togglingId) return
    const newVal = !vehicle[flag]
    setRows(prev => prev.map(r => r.id === id ? { ...r, [flag]: newVal } : r))
    setTogglingId(id)
    try {
      await updateVehicle(id, { [flag]: newVal })
    } catch {
      setRows(prev => prev.map(r => r.id === id ? { ...r, [flag]: !newVal } : r))
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] flex items-center justify-center py-40">
        <Loader2 size={36} className="text-white/20 animate-spin" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-[1400px] py-40 text-center">
        <CloudOff size={48} className="text-white/10 block mb-4" />
        <p className="font-headline font-bold uppercase text-white/40">Failed to load inventory</p>
        <button
          type="button"
          onClick={loadVehicles}
          className="mt-4 font-label text-[10px] uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-[1400px]">

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
            Inventory <span className="text-primary-container">Management</span>
          </h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
            {rows.length} vehicles · live from Supabase
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCard label="Total Units"    value={stats.total}    icon={Car} />
          <StatCard label="USA Stock"      value={stats.usa}      icon={Flag} />
          <StatCard label="Ghana Showroom" value={stats.ghana}    icon={Store} />
          <StatCard label="In Transit"     value={stats.transit}  icon={Truck} />
          <StatCard label="Featured"       value={stats.featured} icon={Star} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search make, model, year, SKU..."
              className="w-full bg-surface-container-low py-3 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-surface-container-low py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="button"
            onClick={openAdd}
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-3 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        </div>

        <p className="font-label text-[10px] uppercase tracking-widest text-white/30 mb-4">
          Showing <span className="text-white">{filtered.length}</span> of {rows.length} vehicles
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Vehicle', 'SKU', 'Category', 'Status', 'Price', 'Location', 'Featured', 'Hot Deal', ''].map(h => (
                  <th key={h} className="text-left font-label text-[10px] uppercase tracking-widest text-white/30 pb-3 pr-6 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors duration-150 group">

                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 flex-shrink-0 overflow-hidden bg-surface-container">
                        {v.images[0] ? (
                          <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car size={14} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-headline font-bold uppercase text-sm text-white leading-none">{v.make} {v.model}</p>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                          {v.year}{v.trim ? ` · ${v.trim}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-white/40">{v.sku}</span>
                  </td>

                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-2.5 py-1 bg-surface-container border border-outline-variant/20">
                      {v.category}
                    </span>
                  </td>

                  <td className="py-4 pr-6">
                    {v.status ? (
                      <span className={cn('font-label text-[10px] uppercase tracking-widest px-2.5 py-1 border', STATUS_COLORS[v.status] ?? 'bg-surface-bright text-white/60 border-outline-variant/20')}>
                        {v.status}
                      </span>
                    ) : <span className="text-white/20 font-label text-[10px]">—</span>}
                  </td>

                  <td className="py-4 pr-6">
                    <span className={cn('font-headline font-bold text-sm', v.showPublicPrice ? 'text-white' : 'text-white/30 italic')}>
                      {formatPrice(v.showPublicPrice ? v.price : null)}
                    </span>
                  </td>

                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-white/30" />
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{v.location}</span>
                    </div>
                  </td>

                  <td className="py-4 pr-6">
                    <button
                      type="button"
                      onClick={() => toggleFlag(v.id, 'isFeatured')}
                      disabled={!!togglingId}
                      className={cn('w-8 h-8 flex items-center justify-center transition-colors duration-150', v.isFeatured ? 'text-primary-container' : 'text-white/20 hover:text-white/50')}
                      aria-label={v.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star size={20} className={v.isFeatured ? 'fill-current' : ''} />
                    </button>
                  </td>

                  <td className="py-4 pr-6">
                    <button
                      type="button"
                      onClick={() => toggleFlag(v.id, 'isHotDeal')}
                      disabled={!!togglingId}
                      className={cn('w-8 h-8 flex items-center justify-center transition-colors duration-150', v.isHotDeal ? 'text-primary-container' : 'text-white/20 hover:text-white/50')}
                      aria-label={v.isHotDeal ? 'Remove hot deal' : 'Mark as hot deal'}
                    >
                      <Flame size={20} className={v.isHotDeal ? 'fill-current' : ''} />
                    </button>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {deleteConfirmId === v.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
                            disabled={deleting === v.id}
                            className="px-2 py-1 bg-red-500/10 text-red-400 font-label text-[10px] uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                          >
                            {deleting === v.id ? '…' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-white/40 font-label text-[10px] uppercase tracking-wider hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(v.id)}
                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                            aria-label="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <Link
                            to={`/inventory/${v.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                            aria-label="View on site"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(v.id)}
                            className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-surface-container transition-all"
                            aria-label="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <SearchX size={36} className="text-white/10 block mb-3" />
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

      <VehicleDrawer
        mode={drawerMode}
        vehicleId={editId}
        initialDraft={editDraftSeed}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
      />
    </>
  )
}
