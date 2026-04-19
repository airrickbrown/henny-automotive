import { useState, useMemo, useEffect, useRef, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  buildSlug,
  type VehicleInput,
} from '../../lib/vehicles'
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
  'JUST ARRIVED':      'bg-secondary/10 text-secondary border-secondary/30',
  'HOT DEAL':          'bg-primary-container/10 text-primary-container border-primary-container/30',
  'FEATURED':          'bg-primary-container/10 text-primary-container border-primary-container/30',
  'NEW ARRIVAL':       'bg-secondary/10 text-secondary border-secondary/30',
  'USA SOURCED':       'bg-surface-bright text-white/60 border-outline-variant/20',
  'IN TRANSIT':        'bg-surface-bright text-white/60 border-outline-variant/20',
  'SHIPPING FROM USA': 'bg-surface-bright text-white/60 border-outline-variant/20',
  'LIMITED':           'bg-primary-container/10 text-primary-container border-primary-container/30',
}

// ── Draft type (strings for easy form binding) ────────────────────────────────
export interface VehicleDraft {
  make: string; model: string; year: string; trim: string
  price: string; condition: VehicleCondition; location: VehicleLocation
  category: VehicleCategory; status: VehicleStatus | ''; sku: string
  showPublicPrice: boolean; isFeatured: boolean; isHotDeal: boolean
  overview: string; engine: string; power: string; zeroToSixty: string
  transmission: string; mileage: string; drivetrain: string
  keyFeaturesText: string; images: string[]
}

const EMPTY_DRAFT: VehicleDraft = {
  make: '', model: '', year: String(new Date().getFullYear()), trim: '',
  price: '', condition: 'PRE-OWNED USA', location: 'USA', category: 'SUV',
  status: '', sku: '', showPublicPrice: true, isFeatured: false, isHotDeal: false,
  overview: '', engine: '', power: '', zeroToSixty: '',
  transmission: '', mileage: '', drivetrain: '', keyFeaturesText: '', images: [],
}

function vehicleToDraft(v: Vehicle): VehicleDraft {
  return {
    make: v.make, model: v.model, year: String(v.year), trim: v.trim ?? '',
    price: v.price !== null ? String(v.price) : '',
    condition: v.condition, location: v.location, category: v.category,
    status: v.status ?? '', sku: v.sku,
    showPublicPrice: v.showPublicPrice, isFeatured: v.isFeatured, isHotDeal: v.isHotDeal,
    overview: v.overview, engine: v.spec.engine, power: v.spec.power ?? '',
    zeroToSixty: v.spec.zeroToSixty ?? '', transmission: v.spec.transmission,
    mileage: v.spec.mileage, drivetrain: v.spec.drivetrain ?? '',
    keyFeaturesText: v.keyFeatures.join('\n'), images: v.images,
  }
}

function draftToInput(d: VehicleDraft): VehicleInput {
  return {
    slug:            buildSlug(d.make, d.model, d.year),
    make:            d.make.trim(),
    model:           d.model.trim(),
    year:            parseInt(d.year) || new Date().getFullYear(),
    trim:            d.trim.trim() || undefined,
    price:           d.price !== '' ? parseFloat(d.price) : null,
    spec: {
      engine:       d.engine.trim(),
      power:        d.power.trim() || undefined,
      zeroToSixty:  d.zeroToSixty.trim() || undefined,
      transmission: d.transmission.trim(),
      mileage:      d.mileage.trim(),
      drivetrain:   d.drivetrain.trim() || undefined,
    },
    images:          d.images,
    status:          (d.status as VehicleStatus) || undefined,
    condition:       d.condition,
    location:        d.location,
    keyFeatures:     d.keyFeaturesText.split('\n').map(s => s.trim()).filter(Boolean),
    overview:        d.overview.trim(),
    isFeatured:      d.isFeatured,
    isHotDeal:       d.isHotDeal,
    showPublicPrice: d.showPublicPrice,
    category:        d.category,
    sku:             d.sku.trim(),
  }
}

// ── Shared form field components (defined at module level to prevent remounting) ──

const inputBase = 'w-full bg-surface-container py-3 px-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all'

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'number'
  placeholder?: string
}
function FormField({ label, value, onChange, type = 'text', placeholder = '' }: FieldProps) {
  return (
    <div>
      <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
      />
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  nullable?: boolean
}
function FormSelect({ label, value, onChange, options, nullable }: SelectProps) {
  return (
    <div>
      <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={cn(inputBase, 'appearance-none cursor-pointer')}>
        {nullable && <option value="">— None —</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
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

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
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

// ── Vehicle Drawer ────────────────────────────────────────────────────────────
interface DrawerProps {
  mode: 'add' | 'edit'
  vehicleId: string | null
  initialDraft: VehicleDraft | null
  open: boolean
  onClose: () => void
  onSaved: (v: Vehicle) => void
}

function VehicleDrawer({ mode, vehicleId, initialDraft, open, onClose, onSaved }: DrawerProps) {
  const [draft, setDraft]             = useState<VehicleDraft>(EMPTY_DRAFT)
  const [saving, setSaving]           = useState(false)
  const [saveError, setSaveError]     = useState('')
  const [uploadCount, setUploadCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setSaveError('')
    setDraft(mode === 'add' ? EMPTY_DRAFT : (initialDraft ?? EMPTY_DRAFT))
  }, [open, mode, initialDraft])

  function set<K extends keyof VehicleDraft>(key: K, value: VehicleDraft[K]) {
    setDraft(d => ({ ...d, [key]: value }))
  }

  async function handleImageFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadCount(c => c + files.length)
    try {
      const urls = await Promise.all(files.map(uploadVehicleImage))
      setDraft(d => ({ ...d, images: [...d.images, ...urls] }))
    } catch {
      setSaveError('Image upload failed. Please try again.')
    } finally {
      setUploadCount(c => c - files.length)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(url: string) {
    setDraft(d => ({ ...d, images: d.images.filter(u => u !== url) }))
    deleteVehicleImage(url)
  }

  async function handleSave() {
    if (!draft.make.trim() || !draft.model.trim() || !draft.year) {
      setSaveError('Make, model, and year are required.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const input = draftToInput(draft)
      let saved: Vehicle
      if (mode === 'add') {
        saved = await createVehicle(input)
      } else {
        await updateVehicle(vehicleId!, input)
        saved = { ...input, id: vehicleId!, createdAt: new Date().toISOString() } as Vehicle
      }
      onSaved(saved)
      onClose()
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-background/60 z-40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed top-0 right-0 h-screen w-full max-w-[560px] bg-surface-container-low z-50 flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-outline-variant/10 flex-shrink-0">
          <div>
            <p className="font-headline font-black italic uppercase text-white text-lg leading-none">
              {mode === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}
            </p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              {mode === 'add' ? 'New listing' : draft.sku || 'No SKU'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <span className="font-material text-xl">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Identity */}
          <section>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Vehicle Identity</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Make"          value={draft.make}  onChange={v => set('make', v)}  placeholder="e.g. BMW" />
              <FormField label="Model"         value={draft.model} onChange={v => set('model', v)} placeholder="e.g. M4 Competition" />
              <FormField label="Year"          value={draft.year}  onChange={v => set('year', v)}  type="number" placeholder="2024" />
              <FormField label="Trim / Colour" value={draft.trim}  onChange={v => set('trim', v)}  placeholder="e.g. Portimao Blue" />
            </div>
          </section>

          <FormField label="SKU" value={draft.sku} onChange={v => set('sku', v)} placeholder="e.g. HA-M4C-024" />

          {/* Price */}
          <section>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Pricing</p>
            <div className="grid grid-cols-2 gap-4 items-end">
              <FormField label="Price (USD)" value={draft.price} onChange={v => set('price', v)} type="number" placeholder="Blank = Price on Request" />
              <div className="pb-0.5">
                <Toggle value={draft.showPublicPrice} onChange={v => set('showPublicPrice', v)} label="Show Price" />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Classification</p>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Category"  value={draft.category}  onChange={v => set('category', v as VehicleCategory)}  options={CATEGORY_OPTIONS} />
              <FormSelect label="Condition" value={draft.condition} onChange={v => set('condition', v as VehicleCondition)} options={CONDITION_OPTIONS} />
              <FormSelect label="Location"  value={draft.location}  onChange={v => set('location', v as VehicleLocation)}   options={LOCATION_OPTIONS} />
              <FormSelect label="Status"    value={draft.status}    onChange={v => set('status', v as VehicleStatus | '')}  options={STATUS_OPTIONS.filter(Boolean) as string[]} nullable />
            </div>
          </section>

          {/* Spec */}
          <section className="border-t border-outline-variant/10 pt-5">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Specifications</p>
            <div className="space-y-4">
              <FormField label="Engine"       value={draft.engine}       onChange={v => set('engine', v)}       placeholder="e.g. 3.0L TWIN-TURBO I6" />
              <FormField label="Mileage"      value={draft.mileage}      onChange={v => set('mileage', v)}      placeholder="e.g. 12,000 KM" />
              <FormField label="Transmission" value={draft.transmission} onChange={v => set('transmission', v)} placeholder="e.g. 8-SPEED AUTO" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Power"      value={draft.power}        onChange={v => set('power', v)}        placeholder="e.g. 503 HP" />
                <FormField label="0–60 MPH"   value={draft.zeroToSixty}  onChange={v => set('zeroToSixty', v)}  placeholder="e.g. 3.4 SECONDS" />
                <FormField label="Drivetrain" value={draft.drivetrain}   onChange={v => set('drivetrain', v)}   placeholder="e.g. AWD" />
              </div>
            </div>
          </section>

          {/* Flags */}
          <section className="border-t border-outline-variant/10 pt-5">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Flags</p>
            <div className="flex flex-wrap gap-3">
              <Toggle value={draft.isFeatured} onChange={v => set('isFeatured', v)} label="Featured" />
              <Toggle value={draft.isHotDeal}  onChange={v => set('isHotDeal', v)}  label="Hot Deal" />
            </div>
          </section>

          {/* Key Features */}
          <section className="border-t border-outline-variant/10 pt-5">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
              Key Features <span className="normal-case tracking-normal text-white/30">(one per line)</span>
            </label>
            <textarea
              rows={4}
              value={draft.keyFeaturesText}
              onChange={e => set('keyFeaturesText', e.target.value)}
              placeholder={"Carbon Ceramic Brakes\nFull Bucket Seats\nFront Axle Lift"}
              className={cn(inputBase, 'resize-none')}
            />
          </section>

          {/* Overview */}
          <section className="border-t border-outline-variant/10 pt-5">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Overview</label>
            <textarea
              rows={5}
              value={draft.overview}
              onChange={e => set('overview', e.target.value)}
              placeholder="Describe the vehicle..."
              className={cn(inputBase, 'resize-none')}
            />
          </section>

          {/* Photos */}
          <section className="border-t border-outline-variant/10 pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Photos <span className="text-white/30">({draft.images.length})</span>
              </p>
              <label className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="font-material text-sm text-primary-container">add_photo_alternate</span>
                <span className="font-label text-[10px] uppercase tracking-wider text-primary-container">Add Photos</span>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageFiles} />
              </label>
            </div>

            {uploadCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="font-material text-sm text-primary-container animate-spin">progress_activity</span>
                <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Uploading {uploadCount} {uploadCount === 1 ? 'image' : 'images'}…
                </span>
              </div>
            )}

            {draft.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {draft.images.map((url, i) => (
                  <div key={url} className="relative group aspect-video bg-surface-container overflow-hidden">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove photo"
                    >
                      <span className="font-material text-xs text-white">close</span>
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary-container/90 py-0.5 text-center">
                        <span className="font-label text-[8px] uppercase tracking-wider text-white">Cover</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-outline-variant/30 py-10 text-center">
                <span className="font-material text-3xl text-white/20 block mb-2">add_photo_alternate</span>
                <p className="font-label text-[10px] uppercase tracking-widest text-white/30">No photos yet</p>
              </div>
            )}
          </section>

        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-outline-variant/10 flex-shrink-0">
          {saveError && <p className="font-label text-xs text-red-400 mb-3">{saveError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || uploadCount > 0}
              className="flex-1 bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs py-4 ignition-glow hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all duration-150"
            >
              {saving ? 'Saving…' : mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border border-outline-variant/30 text-white/60 font-headline font-bold uppercase tracking-widest text-xs hover:text-white hover:border-outline-variant/60 transition-all duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </aside>
    </>
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

  useEffect(() => {
    getAllVehicles()
      .then(setRows)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [])

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
        <span className="font-material text-4xl text-white/20 animate-spin">progress_activity</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-[1400px] py-40 text-center">
        <span className="font-material text-5xl text-white/10 block mb-4">cloud_off</span>
        <p className="font-headline font-bold uppercase text-white/40">Failed to load inventory</p>
        <button
          type="button"
          onClick={() => { setFetchError(false); setLoading(true); getAllVehicles().then(setRows).catch(() => setFetchError(true)).finally(() => setLoading(false)) }}
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
          <StatCard label="Total Units"    value={stats.total}    icon="inventory_2" />
          <StatCard label="USA Stock"      value={stats.usa}      icon="flag" />
          <StatCard label="Ghana Showroom" value={stats.ghana}    icon="storefront" />
          <StatCard label="In Transit"     value={stats.transit}  icon="local_shipping" />
          <StatCard label="Featured"       value={stats.featured} icon="star" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="font-material absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">search</span>
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
            <span className="font-material text-lg">add</span>
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
                            <span className="font-material text-sm text-white/20">directions_car</span>
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
                      <span className="font-material text-sm text-white/30">location_on</span>
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
                      <span className={v.isFeatured ? 'font-material-filled text-xl' : 'font-material text-xl'}>star</span>
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
                      <span className={v.isHotDeal ? 'font-material-filled text-xl' : 'font-material text-xl'}>local_fire_department</span>
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
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(v.id)}
                            className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-surface-container transition-all"
                            aria-label="Delete"
                          >
                            <span className="font-material text-lg">delete</span>
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
