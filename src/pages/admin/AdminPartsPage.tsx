import { useState, useMemo, useEffect } from 'react'
import { getAllParts, createPart, updatePart, deletePart, type PartInput } from '../../lib/parts'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'
import type { Part, PartCategory, PartStatus } from '../../types/part'

const CATEGORY_OPTIONS: PartCategory[] = ['ENGINES', 'BRAKES', 'WHEELS', 'EXHAUST', 'INTERIOR', 'SUSPENSION']
const STATUS_OPTIONS: (PartStatus | '')[] = ['', 'HOT PICK', 'LIMITED']

const STATUS_COLORS: Record<string, string> = {
  'HOT PICK': 'bg-primary-container/10 text-primary-container border-primary-container/30',
  'LIMITED':  'bg-primary-container/10 text-primary-container border-primary-container/30',
}

// ── Draft type (strings for easy form binding) ────────────────────────────────
interface PartDraft {
  name: string
  category: PartCategory
  description: string
  imageUrl: string
  status: PartStatus | ''
  compatibleMakesText: string
  whatsappMessage: string
}

const EMPTY_DRAFT: PartDraft = {
  name: '', category: 'ENGINES', description: '', imageUrl: '',
  status: '', compatibleMakesText: '', whatsappMessage: '',
}

function partToDraft(p: Part): PartDraft {
  return {
    name:                p.name,
    category:            p.category,
    description:         p.description,
    imageUrl:            p.image,
    status:              p.status ?? '',
    compatibleMakesText: (p.compatibleMakes ?? []).join(', '),
    whatsappMessage:     p.whatsappMessage,
  }
}

function draftToInput(d: PartDraft): PartInput {
  return {
    name:            d.name.trim(),
    category:        d.category,
    description:     d.description.trim(),
    image:           d.imageUrl.trim(),
    status:          (d.status || null) as PartStatus,
    compatibleMakes: d.compatibleMakesText.split(',').map(s => s.trim()).filter(Boolean),
    whatsappMessage: d.whatsappMessage.trim(),
  }
}

// ── Part Drawer ───────────────────────────────────────────────────────────────
interface DrawerProps {
  mode: 'add' | 'edit'
  part: Part | null
  open: boolean
  onClose: () => void
  onSave: (draft: PartDraft, existingId?: string) => Promise<string | null>
}

function PartDrawer({ mode, part, open, onClose, onSave }: DrawerProps) {
  const [draft, setDraft]   = useState<PartDraft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!open) return
    setSaveError('')
    setDraft(mode === 'add' ? EMPTY_DRAFT : (part ? partToDraft(part) : EMPTY_DRAFT))
  }, [open, mode, part])

  function set<K extends keyof PartDraft>(key: K, value: PartDraft[K]) {
    setDraft(d => ({ ...d, [key]: value }))
  }

  async function handleSave() {
    if (!draft.name.trim()) { setSaveError('Name is required.'); return }
    setSaving(true)
    const err = await onSave(draft, mode === 'edit' ? part?.id : undefined)
    setSaving(false)
    if (err) { setSaveError(err) } else { onClose() }
  }

  const inputClass =
    'w-full bg-surface-container py-3 px-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all'

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
          'fixed top-0 right-0 h-screen w-full max-w-[480px] bg-surface-container-low z-50 flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-outline-variant/10 flex-shrink-0">
          <div>
            <p className="font-headline font-black italic uppercase text-white text-lg leading-none">
              {mode === 'add' ? 'Add Part' : 'Edit Part'}
            </p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              {mode === 'add' ? 'New listing' : part?.slug ?? ''}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <span className="font-material text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
              Name <span className="text-primary-container">*</span>
            </label>
            <input type="text" value={draft.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="e.g. Brembo 6-Piston Brake Kit" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Category</label>
              <select value={draft.category} onChange={e => set('category', e.target.value as PartCategory)} className={cn(inputClass, 'appearance-none cursor-pointer')}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Status</label>
              <select value={draft.status} onChange={e => set('status', e.target.value as PartStatus | '')} className={cn(inputClass, 'appearance-none cursor-pointer')}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || '— None —'}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Description</label>
            <textarea rows={4} value={draft.description} onChange={e => set('description', e.target.value)} className={cn(inputClass, 'resize-none')} placeholder="Describe the part..." />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Image URL</label>
            <input type="text" value={draft.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={inputClass} placeholder="/images/parts/my-part.jpg" />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">
              Compatible Makes <span className="normal-case tracking-normal text-white/30">(comma-separated)</span>
            </label>
            <input type="text" value={draft.compatibleMakesText} onChange={e => set('compatibleMakesText', e.target.value)} className={inputClass} placeholder="BMW, Audi, Porsche" />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">WhatsApp Message</label>
            <textarea rows={3} value={draft.whatsappMessage} onChange={e => set('whatsappMessage', e.target.value)} className={cn(inputClass, 'resize-none')} placeholder="Hi Henny, I'm interested in..." />
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-outline-variant/10 flex-shrink-0">
          {saveError && <p className="font-label text-xs text-red-400 mb-3">{saveError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs py-4 ignition-glow hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all duration-150"
            >
              {saving ? 'Saving…' : mode === 'add' ? 'Add Part' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border border-outline-variant/30 text-white/60 font-headline font-bold uppercase tracking-widest text-xs hover:text-white hover:border-outline-variant/60 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AdminPartsPage() {
  const [rows, setRows]             = useState<Part[]>([])
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add')
  const [editPart, setEditPart]     = useState<Part | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting]     = useState<string | null>(null)

  function loadParts() {
    getAllParts()
      .then(data => { setRows(data); setFetchError(false) })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadParts()
    const ch = supabase
      .channel('admin-parts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parts' }, loadParts)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      const matchCat    = !catFilter || p.category === catFilter
      return matchSearch && matchCat
    })
  }, [rows, search, catFilter])

  function openAdd() {
    setEditPart(null)
    setDrawerMode('add')
    setDrawerOpen(true)
  }

  function openEdit(p: Part) {
    setEditPart(p)
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  async function handleSave(draft: PartDraft, existingId?: string): Promise<string | null> {
    const input = draftToInput(draft)
    try {
      if (existingId) {
        await updatePart(existingId, input)
        setRows(prev => prev.map(p => p.id === existingId
          ? { ...p, ...input, id: existingId, slug: p.slug }
          : p
        ))
      } else {
        const created = await createPart(input)
        setRows(prev => [created, ...prev])
      }
      return null
    } catch (err) {
      return err instanceof Error ? err.message : 'Save failed. Please try again.'
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deletePart(id)
      setRows(prev => prev.filter(p => p.id !== id))
    } catch {
      // Real-time will keep state consistent
    } finally {
      setDeleting(null)
      setDeleteConfirmId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] flex items-center justify-center py-40">
        <span className="font-material text-4xl text-white/20 animate-spin">progress_activity</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-[1200px] py-40 text-center">
        <span className="font-material text-5xl text-white/10 block mb-4">cloud_off</span>
        <p className="font-headline font-bold uppercase text-white/40">Failed to load parts</p>
        <button
          type="button"
          onClick={loadParts}
          className="mt-4 font-label text-[10px] uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-[1200px]">

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
            Parts <span className="text-primary-container">Management</span>
          </h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
            {rows.length} parts · live from Supabase
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="font-material absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search part name or category..."
              className="w-full bg-surface-container-low py-3 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="bg-surface-container-low py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="button"
            onClick={openAdd}
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-3 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="font-material text-lg">add</span>
            Add Part
          </button>
        </div>

        <p className="font-label text-[10px] uppercase tracking-widest text-white/30 mb-4">
          Showing <span className="text-white">{filtered.length}</span> of {rows.length} parts
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Part', 'Category', 'Status', 'Compatible Makes', ''].map(h => (
                  <th key={h} className="text-left font-label text-[10px] uppercase tracking-widest text-white/30 pb-3 pr-6 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors duration-150 group">

                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex-shrink-0 overflow-hidden bg-surface-container">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-material text-sm text-white/20">settings</span>
                          </div>
                        )}
                      </div>
                      <p className="font-headline font-bold uppercase text-sm text-white leading-tight">{p.name}</p>
                    </div>
                  </td>

                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-2.5 py-1 bg-surface-container border border-outline-variant/20">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-4 pr-6">
                    {p.status ? (
                      <span className={cn('font-label text-[10px] uppercase tracking-widest px-2.5 py-1 border', STATUS_COLORS[p.status] ?? '')}>
                        {p.status}
                      </span>
                    ) : (
                      <span className="font-label text-[10px] text-white/20">In Stock</span>
                    )}
                  </td>

                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-1">
                      {(p.compatibleMakes ?? []).slice(0, 3).map(m => (
                        <span key={m} className="font-label text-[10px] uppercase tracking-widest text-white/40 px-2 py-0.5 bg-surface-container border border-outline-variant/10">
                          {m}
                        </span>
                      ))}
                      {(p.compatibleMakes?.length ?? 0) > 3 && (
                        <span className="font-label text-[10px] text-white/20">+{(p.compatibleMakes?.length ?? 0) - 3}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {deleteConfirmId === p.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            disabled={deleting === p.id}
                            className="px-2 py-1 bg-red-500/10 text-red-400 font-label text-[10px] uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                          >
                            {deleting === p.id ? '…' : 'Confirm'}
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
                            onClick={() => openEdit(p)}
                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                            aria-label="Edit part"
                          >
                            <span className="font-material text-lg">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-surface-container transition-all"
                            aria-label="Delete part"
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
                  <td colSpan={5} className="py-20 text-center">
                    <span className="font-material text-4xl text-white/10 block mb-3">search_off</span>
                    <p className="font-headline font-bold uppercase text-white/30 text-sm">No parts match</p>
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setCatFilter('') }}
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

      <PartDrawer
        mode={drawerMode}
        part={editPart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
