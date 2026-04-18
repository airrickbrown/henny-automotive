import { useState } from 'react'
import PageMeta from '../components/seo/PageMeta'
import { parts } from '../data/parts'
import { cn } from '../lib/utils'
import { buildWhatsAppUrl } from '../lib/tokens'
import { PART_CATEGORIES } from '../lib/constants'
import PageWrapper from '../components/layout/PageWrapper'
import SectionLabel from '../components/ui/SectionLabel'
import type { PartCategory } from '../types/part'

// ── Category display helpers ─────────────────────────────────────────────────
const CATEGORY_LABEL: Record<PartCategory | 'ALL', string> = {
  ALL:        'All Parts',
  ENGINES:    'Engines',
  BRAKES:     'Brakes',
  WHEELS:     'Wheels',
  EXHAUST:    'Exhaust',
  INTERIOR:   'Interior',
  SUSPENSION: 'Suspension',
}

const CATEGORY_BADGE: Record<PartCategory, string> = {
  ENGINES:    'Powerplant',
  BRAKES:     'Chassis',
  WHEELS:     'Footwork',
  EXHAUST:    'Performance',
  INTERIOR:   'Interior',
  SUSPENSION: 'Suspension',
}

const CATEGORY_ICON: Record<PartCategory, string> = {
  ENGINES:    'settings_input_component',
  BRAKES:     'precision_manufacturing',
  WHEELS:     'tire_repair',
  EXHAUST:    'air',
  INTERIOR:   'airline_seat_recline_extra',
  SUSPENSION: 'car_repair',
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function PartsPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | PartCategory>('ALL')

  const filtered = activeCategory === 'ALL'
    ? parts
    : parts.filter((p) => p.category === activeCategory)

  return (
    <PageWrapper>
      <PageMeta
        title="Performance Parts"
        description="Genuine performance parts for the discerning enthusiast. Engines, brakes, wheels, exhaust systems and more — sourced from the USA and available in Ghana."
        path="/parts"
      />
      <div className="px-6 md:px-8 max-w-7xl mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <header className="mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <SectionLabel className="mb-4">Performance Components</SectionLabel>
              <h1 className="font-headline font-black italic tracking-tighter leading-none uppercase text-[clamp(2.8rem,8vw,5rem)]">
                Precision <br />Engineering.
              </h1>
            </div>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-md">
              Genuine performance parts curated for the discerning enthusiast.
              From high-output engines to bespoke interior accessories.
            </p>
          </div>
        </header>

        {/* ── Category filter ──────────────────────────────────── */}
        <section className="mb-14 md:mb-16">
          <div className="flex flex-wrap gap-3 md:gap-4">
            {PART_CATEGORIES.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-6 md:px-8 py-3 font-headline font-bold uppercase tracking-widest text-xs transition-all duration-150',
                    active
                      ? 'bg-primary-container text-white shadow-[0_0_20px_rgba(225,29,46,0.3)]'
                      : 'bg-surface-container-high text-white/60 hover:bg-surface-bright hover:text-white'
                  )}
                >
                  {CATEGORY_LABEL[cat]}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Parts grid ──────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((part) => {
            const isHot = part.status === 'HOT PICK' || part.status === 'LIMITED'
            const waHref = buildWhatsAppUrl(part.whatsappMessage)

            return (
              <article
                key={part.id}
                className="group bg-surface-container-low p-6 hover:bg-surface-container-high transition-all duration-500 relative overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square mb-8 overflow-hidden relative">
                  {part.image ? (
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                      <span className="font-material text-5xl text-on-surface-variant/20">
                        {CATEGORY_ICON[part.category]}
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-0 left-0">
                    <span className="bg-primary-container text-white font-label text-[10px] font-black tracking-widest uppercase px-3 py-1">
                      {CATEGORY_BADGE[part.category]}
                    </span>
                  </div>

                  {/* Status badge */}
                  {part.status && (
                    <div className="absolute top-0 right-0">
                      <span className="bg-surface-bright text-white font-label text-[10px] font-black tracking-widest uppercase px-3 py-1">
                        {part.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  {/* Title + icon */}
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-headline text-xl font-bold uppercase tracking-tight leading-tight text-white">
                      {part.name}
                    </h3>
                    <span className="font-material text-2xl text-primary-container flex-shrink-0">
                      {CATEGORY_ICON[part.category]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {part.description}
                  </p>

                  {/* Spec chips */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-surface-container-highest/50 border border-outline-variant/20 font-label text-[10px] uppercase font-bold tracking-tight text-on-surface-variant">
                      {part.category}
                    </span>
                    {part.status ? (
                      <span className="px-3 py-1 bg-surface-container-highest/50 border border-outline-variant/20 font-label text-[10px] uppercase font-bold tracking-tight text-on-surface-variant">
                        {part.status}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-surface-container-highest/50 border border-outline-variant/20 font-label text-[10px] uppercase font-bold tracking-tight text-on-surface-variant">
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* WhatsApp CTA — red for hot/limited, green for standard */}
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-full font-headline font-bold uppercase tracking-widest text-xs py-4 flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98]',
                      isHot
                        ? 'bg-ignition text-white ignition-glow hover:brightness-110'
                        : 'bg-secondary text-on-secondary hover:brightness-110 hover:shadow-[0_0_30px_rgba(65,229,117,0.3)]'
                    )}
                  >
                    Inquire on WhatsApp
                    <span className="font-material-filled text-lg">chat</span>
                  </a>
                </div>
              </article>
            )
          })}
        </section>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="font-material text-5xl text-on-surface-variant/30">
              build_circle
            </span>
            <p className="font-headline text-xl font-black uppercase text-white/40">
              No Parts in This Category
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('ALL')}
              className="font-headline font-bold text-xs uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
            >
              View All Parts
            </button>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}
