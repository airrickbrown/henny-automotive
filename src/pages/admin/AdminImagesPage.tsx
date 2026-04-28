import { useState, useEffect, useRef } from 'react'
import { Upload, RotateCcw, CheckCircle2, AlertCircle, Loader2, ImageIcon } from 'lucide-react'
import { IMAGE_SLOTS, DEFAULT_IMAGES, getSiteImages, uploadSiteImage, resetSiteImage } from '../../lib/siteImages'
import { supabase } from '../../lib/supabase'

type SlotStatus = 'idle' | 'uploading' | 'done' | 'error'

export default function AdminImagesPage() {
  const [images, setImages]   = useState<Record<string, string>>(DEFAULT_IMAGES)
  const [statuses, setStatuses] = useState<Record<string, SlotStatus>>({})
  const [tableReady, setTableReady] = useState<boolean | null>(null)

  useEffect(() => {
    getSiteImages()
      .then(data => { setImages({ ...DEFAULT_IMAGES, ...data }); setTableReady(true) })
      .catch(() => setTableReady(false))

    const channel = supabase
      .channel('admin-images-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_images' }, () => {
        getSiteImages().then(data => setImages({ ...DEFAULT_IMAGES, ...data })).catch(() => {})
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  function setStatus(key: string, s: SlotStatus) {
    setStatuses(prev => ({ ...prev, [key]: s }))
    if (s === 'done' || s === 'error') {
      setTimeout(() => setStatuses(prev => ({ ...prev, [key]: 'idle' })), 3000)
    }
  }

  async function handleUpload(key: string, file: File) {
    setStatus(key, 'uploading')
    try {
      const url = await uploadSiteImage(key, file)
      setImages(prev => ({ ...prev, [key]: url }))
      setStatus(key, 'done')
    } catch {
      setStatus(key, 'error')
    }
  }

  async function handleReset(key: string) {
    setStatus(key, 'uploading')
    try {
      await resetSiteImage(key)
      setImages(prev => ({ ...prev, [key]: DEFAULT_IMAGES[key] }))
      setStatus(key, 'done')
    } catch {
      setStatus(key, 'error')
    }
  }

  if (tableReady === false) {
    return (
      <div className="max-w-[860px]">
        <div className="bg-surface-container-low border-l-4 border-red-500 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-headline font-bold text-white uppercase tracking-tight mb-2">Setup Required</p>
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Run this SQL in Supabase → SQL Editor, then create a public Storage bucket named <code className="text-white bg-surface-container px-1">site-images</code>:
              </p>
              <pre className="font-mono text-xs text-white/70 bg-surface-container p-4 leading-relaxed whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS site_images (
  key         TEXT PRIMARY KEY,
  url         TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
              <button
                onClick={() => { setTableReady(null); getSiteImages().then(d => { setImages({ ...DEFAULT_IMAGES, ...d }); setTableReady(true) }).catch(() => setTableReady(false)) }}
                className="mt-4 font-label text-xs uppercase tracking-widest text-primary-container hover:text-white transition-colors"
              >
                Retry →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[900px]">
      <div className="mb-8">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl text-white leading-none">
          Site Images
        </h1>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
          Upload replacements for any image — changes go live instantly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IMAGE_SLOTS.map(slot => (
          <ImageCard
            key={slot.key}
            slot={slot}
            currentUrl={images[slot.key]}
            isDefault={images[slot.key] === DEFAULT_IMAGES[slot.key]}
            status={statuses[slot.key] ?? 'idle'}
            onUpload={(file) => handleUpload(slot.key, file)}
            onReset={() => handleReset(slot.key)}
          />
        ))}
      </div>
    </div>
  )
}

function ImageCard({
  slot,
  currentUrl,
  isDefault,
  status,
  onUpload,
  onReset,
}: {
  slot: typeof IMAGE_SLOTS[number]
  currentUrl: string
  isDefault: boolean
  status: SlotStatus
  onUpload: (file: File) => void
  onReset: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-surface-container-low overflow-hidden">
      {/* Image preview */}
      <div className="relative h-44 bg-surface-container-high">
        <img
          src={currentUrl}
          alt={slot.label}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {!currentUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon size={32} className="text-white/20" />
          </div>
        )}
        {!isDefault && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-secondary/20 border border-secondary/40 rounded-sm">
            <span className="font-label text-[9px] uppercase tracking-widest text-secondary">Custom</span>
          </div>
        )}
      </div>

      {/* Info + actions */}
      <div className="p-4">
        <p className="font-headline font-bold uppercase tracking-tight text-white text-sm">{slot.label}</p>
        {slot.description && (
          <p className="font-body text-xs text-on-surface-variant mt-0.5 leading-relaxed">{slot.description}</p>
        )}

        <div className="flex items-center gap-2 mt-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = '' }}
          />

          <button
            onClick={() => inputRef.current?.click()}
            disabled={status === 'uploading'}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-container text-white font-label text-[10px] uppercase tracking-widest py-2.5 hover:brightness-110 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            {status === 'uploading' ? (
              <><Loader2 size={13} className="animate-spin" /> Uploading…</>
            ) : (
              <><Upload size={13} /> Upload New</>
            )}
          </button>

          {!isDefault && (
            <button
              onClick={onReset}
              disabled={status === 'uploading'}
              title="Restore default image"
              className="w-9 h-9 flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all duration-150 disabled:opacity-50"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {status === 'done' && (
          <p className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-secondary mt-2">
            <CheckCircle2 size={12} /> Live on site
          </p>
        )}
        {status === 'error' && (
          <p className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-red-400 mt-2">
            <AlertCircle size={12} /> Failed — check storage bucket
          </p>
        )}
      </div>
    </div>
  )
}
