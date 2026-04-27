import { useState, useEffect, useMemo } from 'react'
import { X, MessageCircle, Trash2, Search, Inbox, AlertCircle, Users, CheckCheck, type LucideIcon } from 'lucide-react'
import {
  getLeads,
  updateLeadStatus,
  deleteLead,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from '../../lib/leads'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; dot: string; badge: string }> = {
  new:       { label: 'New',       dot: 'bg-primary-container', badge: 'bg-primary-container/10 text-primary-container' },
  contacted: { label: 'Contacted', dot: 'bg-secondary',         badge: 'bg-secondary/10 text-secondary' },
  closed:    { label: 'Closed',    dot: 'bg-white/20',          badge: 'bg-white/5 text-white/40' },
}

const STATUS_CYCLE: Record<LeadStatus, LeadStatus> = {
  new: 'contacted',
  contacted: 'closed',
  closed: 'new',
}

// ── Detail drawer ─────────────────────────────────────────────────────────────

function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
  onDelete,
}: {
  lead: Lead
  onClose: () => void
  onStatusChange: (id: string, s: LeadStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const cfg = STATUS_CONFIG[lead.status]

  async function handleStatusChange() {
    setBusy(true)
    await onStatusChange(lead.id, STATUS_CYCLE[lead.status])
    setBusy(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this lead? This cannot be undone.')) return
    setBusy(true)
    await onDelete(lead.id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-low border-l border-white/5 z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-headline font-black italic uppercase tracking-tighter text-white text-xl">
            Lead Detail
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          <div>
            <p className="font-headline font-black text-white text-2xl">{lead.name}</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-1">
              {formatLeadDate(lead.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 text-xs font-label font-bold uppercase tracking-wider', cfg.badge)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
              {cfg.label}
            </span>
            <button
              onClick={handleStatusChange}
              disabled={busy}
              className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white disabled:opacity-40 transition-colors border border-white/10 hover:border-white/30 px-3 py-1"
            >
              Mark as {STATUS_CONFIG[STATUS_CYCLE[lead.status]].label}
            </button>
          </div>

          {[
            { label: 'Phone / WhatsApp', value: lead.phone || '—' },
            { label: 'Interest',         value: lead.interest || '—' },
            { label: 'Source',           value: 'Contact Form' },
          ].map((f) => (
            <div key={f.label}>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{f.label}</p>
              <p className="font-body text-sm text-white">{f.value}</p>
            </div>
          ))}

          {lead.message && (
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Message</p>
              <p className="font-body text-sm text-white leading-relaxed bg-surface-container p-4 whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}

          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 font-label text-xs font-bold uppercase tracking-wider px-4 py-3 transition-all duration-150"
            >
              <MessageCircle size={18} />
              Reply on WhatsApp
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={handleDelete}
            disabled={busy}
            className="flex items-center gap-2 font-label text-xs uppercase tracking-wider text-red-400/60 hover:text-red-400 disabled:opacity-40 transition-colors"
          >
            <Trash2 size={16} />
            Delete Lead
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [leads, setLeads]               = useState<Lead[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [selected, setSelected]         = useState<Lead | null>(null)

  async function fetchLeads() {
    try {
      setError(null)
      const data = await getLeads()
      setLeads(data)
    } catch (err) {
      setError('Failed to load leads. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
    const ch = supabase
      .channel('leads-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, fetchLeads)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Stats
  const total     = leads.length
  const newCount  = leads.filter((l) => l.status === 'new').length
  const contacted = leads.filter((l) => l.status === 'contacted').length

  // Filtered list
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.interest.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [leads, search, statusFilter])

  async function handleStatusChange(id: string, status: LeadStatus) {
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev))
    try {
      await updateLeadStatus(id, status)
    } catch {
      // Roll back on failure
      await fetchLeads()
    }
  }

  async function handleDelete(id: string) {
    // Optimistic update
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setSelected(null)
    try {
      await deleteLead(id)
    } catch {
      await fetchLeads()
    }
  }

  return (
    <div className="max-w-[1200px]">

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Leads
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Customer enquiries from the contact form
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: loading ? '—' : total,     icon: Users },
          { label: 'New',         value: loading ? '—' : newCount,  icon: MessageCircle },
          { label: 'Contacted',   value: loading ? '—' : contacted, icon: CheckCheck },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-low border border-white/5 p-5">
            <div className="flex items-center gap-3 mb-2">
              {(() => { const Icon = s.icon as LucideIcon; return <Icon size={18} className="text-on-surface-variant" /> })()}
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{s.label}</p>
            </div>
            <p className="font-headline font-black text-3xl text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 px-5 py-4 mb-5 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-400" />
          <p className="font-body text-sm text-red-400 flex-1">{error}</p>
          <button
            onClick={fetchLeads}
            className="font-label text-xs uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-white/10 focus:border-primary-container/50 pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-1">
          {(['all', 'new', 'contacted', 'closed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-4 py-2.5 font-label text-xs uppercase tracking-wider transition-all duration-150',
                statusFilter === s
                  ? 'bg-primary-container/10 text-primary-container border border-primary-container/30'
                  : 'text-on-surface-variant hover:text-white border border-white/10 hover:border-white/20'
              )}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="bg-surface-container-low border border-white/5 divide-y divide-white/5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-40" />
                <div className="h-2.5 bg-white/5 rounded w-64" />
              </div>
              <div className="h-3 bg-white/5 rounded w-24" />
              <div className="h-3 bg-white/5 rounded w-28" />
              <div className="h-5 bg-white/5 rounded w-20" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-low border border-white/5 flex flex-col items-center justify-center py-24 text-center px-6">
          <Inbox size={48} className="text-white/10 block mb-4" />
          <p className="font-headline font-black italic uppercase text-white/30 text-xl mb-2">
            {leads.length === 0 ? 'No leads yet' : 'No results'}
          </p>
          <p className="font-body text-sm text-on-surface-variant max-w-xs leading-relaxed">
            {leads.length === 0
              ? 'Submissions from the Contact page will appear here.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Phone', 'Interest', 'Date', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((lead) => {
                const cfg = STATUS_CONFIG[lead.status]
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <td className="pl-5 pr-4 py-4">
                      <p className="font-label text-sm font-bold text-white">{lead.name}</p>
                      {lead.message && (
                        <p className="font-body text-xs text-on-surface-variant mt-0.5 line-clamp-1 max-w-[200px]">
                          {lead.message}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 font-body text-sm text-on-surface-variant">
                      {lead.phone || '—'}
                    </td>
                    <td className="px-4 py-4 font-body text-sm text-on-surface-variant">
                      {lead.interest || '—'}
                    </td>
                    <td className="px-4 py-4 font-body text-xs text-on-surface-variant whitespace-nowrap">
                      {formatLeadDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(lead.id, STATUS_CYCLE[lead.status])
                        }}
                        title={`Mark as ${STATUS_CONFIG[STATUS_CYCLE[lead.status]].label}`}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-wider transition-all duration-150 hover:brightness-125',
                          cfg.badge
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </button>
                    </td>
                    <td className="pr-5 pl-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this lead?')) handleDelete(lead.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-red-400"
                        title="Delete lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
