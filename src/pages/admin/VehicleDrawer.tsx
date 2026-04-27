import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { X, CheckCircle2, Circle, ImagePlus, Loader2 } from 'lucide-react'
import {
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  buildSlug,
  type VehicleInput,
} from '../../lib/vehicles'
import { cn } from '../../lib/utils'
import type { Vehicle, VehicleStatus, VehicleCondition, VehicleLocation, VehicleCategory } from '../../types/vehicle'

// ── Constants ────────────────────────────────────────────────────────────────
export const STATUS_OPTIONS: (VehicleStatus | '')[] = [
  '', 'JUST ARRIVED', 'HOT DEAL', 'FEATURED', 'NEW ARRIVAL',
  'USA SOURCED', 'IN TRANSIT', 'SHIPPING FROM USA', 'LIMITED',
]
export const CONDITION_OPTIONS: VehicleCondition[] = ['NEW (LOW KM)', 'PRE-OWNED USA', 'LOCAL STOCK']
export const LOCATION_OPTIONS: VehicleLocation[]   = ['USA', 'GHANA', 'IN TRANSIT']
export const CATEGORY_OPTIONS: VehicleCategory[]   = ['SUV', 'COUPE', 'SEDAN', 'TRUCK', 'SPORTS']

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

export const EMPTY_DRAFT: VehicleDraft = {
  make: '', model: '', year: String(new Date().getFullYear()), trim: '',
  price: '', condition: 'PRE-OWNED USA', location: 'USA', category: 'SUV',
  status: '', sku: '', showPublicPrice: true, isFeatured: false, isHotDeal: false,
  overview: '', engine: '', power: '', zeroToSixty: '',
  transmission: '', mileage: '', drivetrain: '', keyFeaturesText: '', images: [],
}

export function vehicleToDraft(v: Vehicle): VehicleDraft {
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

// ── Shared form field components ─────────────────────────────────────────────
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
      {value ? <CheckCircle2 size={14} className="text-primary-container" /> : <Circle size={14} className="text-white/30" />}
      {label}
    </button>
  )
}

// ── VehicleDrawer ─────────────────────────────────────────────────────────────
interface DrawerProps {
  mode: 'add' | 'edit'
  vehicleId: string | null
  initialDraft: VehicleDraft | null
  open: boolean
  onClose: () => void
  onSaved: (v: Vehicle) => void
}

export default function VehicleDrawer({ mode, vehicleId, initialDraft, open, onClose, onSaved }: DrawerProps) {
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
            <X size={20} />
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
                <ImagePlus size={14} className="text-primary-container" />
                <span className="font-label text-[10px] uppercase tracking-wider text-primary-container">Add Photos</span>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageFiles} />
              </label>
            </div>

            {uploadCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Loader2 size={14} className="text-primary-container animate-spin" />
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
                      <X size={12} className="text-white" />
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
                <ImagePlus size={30} className="text-white/20 block mb-2" />
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
