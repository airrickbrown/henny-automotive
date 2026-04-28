import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, ArrowRight, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllVehicles } from '../../lib/vehicles'
import { formatPrice } from '../../lib/utils'
import type { Vehicle } from '../../types/vehicle'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery]       = useState('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [results, setResults]   = useState<Vehicle[]>([])
  const [loading, setLoading]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all vehicles once on first open
  useEffect(() => {
    if (!open || vehicles.length > 0) return
    setLoading(true)
    getAllVehicles()
      .then(v => { setVehicles(v); setLoading(false) })
      .catch(() => setLoading(false))
  }, [open])

  // Filter locally as user types
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      vehicles.filter(v =>
        `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        String(v.year).includes(q)
      ).slice(0, 6)
    )
  }, [query, vehicles])

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSelect = useCallback(() => {
    onClose()
    setQuery('')
  }, [onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 left-0 right-0 z-[90] bg-surface-container-low border-b border-white/[0.08] shadow-2xl">
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 max-w-3xl mx-auto">
          <Search size={20} className="text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by make, model or year…"
            className="flex-1 bg-transparent font-body text-white text-base placeholder:text-white/30 outline-none"
            autoComplete="off"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        {(results.length > 0 || (query && !loading)) && (
          <div className="max-w-3xl mx-auto pb-4 px-5">
            <div className="h-px bg-white/[0.06] mb-3" />

            {results.length === 0 && query ? (
              <p className="font-body text-sm text-white/30 py-3 text-center">
                No vehicles found for "{query}"
              </p>
            ) : (
              <ul className="space-y-1">
                {results.map(v => (
                  <li key={v.id}>
                    <Link
                      to={`/inventory/${v.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-4 px-3 py-3 hover:bg-white/[0.05] transition-colors duration-100 group"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-10 bg-surface-container-high overflow-hidden flex-shrink-0">
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car size={16} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-headline font-bold uppercase tracking-tight text-white text-sm truncate">
                          {v.year} {v.make} {v.model}
                        </p>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                          {v.condition} · {formatPrice(v.price)}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-white/20 group-hover:text-primary-container transition-colors flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* View all results */}
            {results.length > 0 && (
              <Link
                to={`/inventory?q=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="flex items-center justify-center gap-2 mt-3 py-2.5 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all font-label text-[10px] uppercase tracking-widest"
              >
                View all results <ArrowRight size={12} />
              </Link>
            )}

            {loading && (
              <p className="font-body text-sm text-white/30 py-3 text-center">Loading…</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
