import { useState, useMemo } from 'react'
import { parts as initialParts } from '../../data/parts'
import { cn } from '../../lib/utils'
import type { Part, PartCategory, PartStatus } from '../../types/part'

const CATEGORY_OPTIONS: PartCategory[] = ['ENGINES', 'BRAKES', 'WHEELS', 'EXHAUST', 'INTERIOR', 'SUSPENSION']

const STATUS_COLORS: Record<string, string> = {
  'HOT PICK': 'bg-primary-container/10 text-primary-container border-primary-container/30',
  'LIMITED':  'bg-primary-container/10 text-primary-container border-primary-container/30',
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────
function EditDrawer({
  part,
  open,
  onClose,
  onSave,
}: {
  part: Part | null
  open: boolean
  onClose: () => void
  onSave: (p: Part) => void
}) {
  const [draft, setDraft] = useState<Part | null>(null)

  if (part && (!draft || draft.id !== part.id)) setDraft({ ...part })
  if (!part && draft) setDraft(null)
  if (!draft) return null

  const inputClass =
    'w-full bg-surface-container py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all'

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
        <div className="flex items-center justify-between px-7 py-5 border-b border-outline-variant/10">
          <div>
            <p className="font-headline font-black italic uppercase text-white text-lg leading-none">Edit Part</p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">{draft.slug}</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <span className="font-material text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Name</label>
            <input type="text" value={draft.name} onChange={(e) => setDraft((d) => d ? { ...d, name: e.target.value } : d)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft((d) => d ? { ...d, category: e.target.value as PartCategory } : d)}
                className={inputClass + ' appearance-none cursor-pointer'}
              >
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Status</label>
              <select
                value={draft.status ?? ''}
                onChange={(e) => setDraft((d) => d ? { ...d, status: (e.target.value || null) as PartStatus } : d)}
                className={inputClass + ' appearance-none cursor-pointer'}
              >
                <option value="">— None —</option>
                <option value="HOT PICK">HOT PICK</option>
                <option value="LIMITED">LIMITED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">Description</label>
            <textarea rows={4} value={draft.description} onChange={(e) => setDraft((d) => d ? { ...d, description: e.target.value } : d)} className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5">WhatsApp Message</label>
            <textarea rows={3} value={draft.whatsappMessage} onChange={(e) => setDraft((d) => d ? { ...d, whatsappMessage: e.target.value } : d)} className={inputClass + ' resize-none'} />
          </div>
        </div>

        {/* Footer */}
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
            className="px-6 py-4 border border-outline-variant/30 text-white/60 font-headline font-bold uppercase tracking-widest text-xs hover:text-white hover:border-outline-variant/60 transition-all"
          >
            Cancel
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AdminPartsPage() {
  const [rows, setRows]         = useState<Part[]>(initialParts)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [editId, setEditId]     = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      const matchCat = !catFilter || p.category === catFilter
      return matchSearch && matchCat
    })
  }, [rows, search, catFilter])

  const editPart = rows.find((p) => p.id === editId) ?? null

  function handleSave(updated: Part) {
    setRows((prev) => prev.map((p) => p.id === updated.id ? updated : p))
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
            {rows.length} parts listed
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="font-material absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search part name or category..."
              className="w-full bg-surface-container-low py-3 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-surface-container-low py-3 px-4 font-body text-sm text-white outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="button"
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
                {['Part', 'Category', 'Status', 'Compatible Makes', ''].map((h) => (
                  <th key={h} className="text-left font-label text-[10px] uppercase tracking-widest text-white/30 pb-3 pr-6 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors duration-150 group">

                  {/* Part */}
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

                  {/* Category */}
                  <td className="py-4 pr-6">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-2.5 py-1 bg-surface-container border border-outline-variant/20">
                      {p.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-6">
                    {p.status ? (
                      <span className={cn('font-label text-[10px] uppercase tracking-widest px-2.5 py-1 border', STATUS_COLORS[p.status] ?? '')}>
                        {p.status}
                      </span>
                    ) : (
                      <span className="font-label text-[10px] text-white/20">In Stock</span>
                    )}
                  </td>

                  {/* Makes */}
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-1">
                      {(p.compatibleMakes ?? []).slice(0, 3).map((m) => (
                        <span key={m} className="font-label text-[10px] uppercase tracking-widest text-white/40 px-2 py-0.5 bg-surface-container border border-outline-variant/10">
                          {m}
                        </span>
                      ))}
                      {(p.compatibleMakes?.length ?? 0) > 3 && (
                        <span className="font-label text-[10px] text-white/20">+{(p.compatibleMakes?.length ?? 0) - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        type="button"
                        onClick={() => { setEditId(p.id); setDrawerOpen(true) }}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-surface-container transition-all"
                        aria-label="Edit part"
                      >
                        <span className="font-material text-lg">edit</span>
                      </button>
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

      <EditDrawer
        part={editPart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
