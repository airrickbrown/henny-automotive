import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import { getVehicleBySlug, getRelatedVehicles } from '../lib/vehicles'
import { formatPrice } from '../lib/utils'
import { SNAPCHAT_URL } from '../lib/tokens'
import PageWrapper from '../components/layout/PageWrapper'
import StatusBadge from '../components/ui/StatusBadge'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import SnapchatButton from '../components/ui/SnapchatButton'
import type { Vehicle } from '../types/vehicle'
import type { BadgeVariant } from '../components/ui/StatusBadge'

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">{label}</p>
      <p className="font-headline text-xl font-bold italic text-white uppercase leading-tight">{value}</p>
    </div>
  )
}

function DetailSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-white mb-6 border-l-4 border-primary-container pl-4">
      {children}
    </h3>
  )
}

export default function VehicleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [vehicle, setVehicle]   = useState<Vehicle | null>(null)
  const [related, setRelated]   = useState<Vehicle[]>([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return }
    setLoading(true)
    getVehicleBySlug(slug).then((v) => {
      if (!v) { setNotFound(true); setLoading(false); return }
      setVehicle(v)
      setLoading(false)
      getRelatedVehicles(v.category, v.id).then(setRelated)
    })
  }, [slug])

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="font-material text-4xl text-white/20 animate-spin">progress_activity</span>
        </div>
      </PageWrapper>
    )
  }

  if (notFound || !vehicle) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
          <span className="font-material text-6xl text-on-surface-variant/30">directions_car</span>
          <h1 className="font-headline text-3xl font-black uppercase text-white">Vehicle Not Found</h1>
          <p className="font-body text-on-surface-variant">This vehicle may have been sold or removed.</p>
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
          >
            Browse Inventory
          </button>
        </div>
      </PageWrapper>
    )
  }

  const waMessage = `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` (${vehicle.trim})` : ''}. SKU: ${vehicle.sku}. Please send more details.`
  const displayPrice = formatPrice(vehicle.showPublicPrice ? vehicle.price : null)
  const isPriceOnReq = !vehicle.showPublicPrice || vehicle.price === null
  const metaDescription = vehicle.overview.length > 155 ? vehicle.overview.slice(0, 152) + '...' : vehicle.overview

  return (
    <PageWrapper>
      <PageMeta
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        description={metaDescription}
        image={vehicle.images[0]}
        path={`/inventory/${vehicle.slug}`}
        type="article"
      />

      {/* ── Desktop Hero Gallery ─────────────────────────────────── */}
      <section className="hidden md:grid grid-cols-12 gap-4 max-w-[1440px] mx-auto px-8 h-[640px] mb-12">
        <div className="col-span-8 h-full overflow-hidden relative group">
          {vehicle.images[0] ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="font-material text-8xl text-on-surface-variant/20">directions_car</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10">
            <h1 className="font-headline text-6xl font-black italic tracking-tighter text-white leading-tight uppercase">
              {vehicle.year} {vehicle.make}<br />
              <span className="text-primary-container">{vehicle.model}</span>
            </h1>
          </div>
        </div>
        <div className="col-span-4 grid grid-rows-2 gap-4 h-full">
          {[0, 1].map((i) => (
            <div key={i} className="overflow-hidden bg-surface-container">
              {vehicle.images[i] ? (
                <img
                  src={vehicle.images[i]}
                  alt={`${vehicle.make} ${vehicle.model} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-material text-4xl text-on-surface-variant/20">directions_car</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Mobile Gallery ──────────────────────────────────────────── */}
      <section className="md:hidden relative mb-0">
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {(vehicle.images.length > 0 ? vehicle.images : [null]).map((img, i) => (
            <div key={i} className="snap-center shrink-0 w-full aspect-[4/3]">
              {img ? (
                <img src={img} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container flex items-center justify-center">
                  <span className="font-material text-5xl text-on-surface-variant/20">directions_car</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 right-4 bg-black/50 backdrop-blur-sm px-3 py-1">
          <span className="font-label text-xs tracking-widest text-white">1 / {vehicle.images.length || 1}</span>
        </div>
      </section>

      {/* ── Mobile identity + CTA ──────────────────────────────────── */}
      <div className="md:hidden px-6 py-8 bg-surface">
        <div className="flex justify-between items-start mb-2">
          {vehicle.status && (
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-container font-bold">{vehicle.status}</span>
          )}
          <span className="font-label text-xs uppercase tracking-[0.2em] text-white/40">SKU: {vehicle.sku}</span>
        </div>
        <h1 className="font-headline text-4xl font-black italic tracking-tighter text-white mb-2 leading-none uppercase">
          {vehicle.make} {vehicle.model}
        </h1>
        <p className="font-headline text-white/70 tracking-tight uppercase text-lg">
          {vehicle.spec.engine} | {vehicle.trim} | {vehicle.year}
        </p>
        <div className="mt-5 flex items-baseline gap-3">
          <span className={`font-headline text-3xl font-black ${isPriceOnReq ? 'text-primary-container' : 'text-white'}`}>
            {displayPrice}
          </span>
          <span className="font-label text-xs text-white/40 uppercase tracking-widest">Excl. logistics</span>
        </div>
      </div>
      <div className="md:hidden px-6 pb-8">
        <WhatsAppButton label="Inquire via WhatsApp" message={waMessage} fullWidth size="lg" />
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-10 md:gap-12">

          {/* Details column */}
          <div className="md:col-span-7 space-y-8">
            <div className="bg-surface-container-low p-8 md:p-10 space-y-8">
              <div className="hidden md:flex items-center gap-3 flex-wrap">
                {vehicle.status && <StatusBadge variant={vehicle.status as BadgeVariant} />}
                <span className="border border-outline-variant/20 text-on-surface-variant px-3 py-1 font-label text-[10px] font-bold tracking-widest uppercase">
                  {vehicle.condition}
                </span>
                <span className="border border-outline-variant/20 text-on-surface-variant px-3 py-1 font-label text-[10px] font-bold tracking-widest uppercase ml-auto">
                  SKU: {vehicle.sku}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-b border-outline-variant/10 pb-8">
                <SpecCell label="Engine"       value={vehicle.spec.engine} />
                <SpecCell label="Mileage"      value={vehicle.spec.mileage} />
                <SpecCell label="Transmission" value={vehicle.spec.transmission} />
                {vehicle.spec.power       && <SpecCell label="Power"      value={vehicle.spec.power} />}
                {vehicle.spec.zeroToSixty && <SpecCell label="0–60 MPH"   value={vehicle.spec.zeroToSixty} />}
                {vehicle.spec.drivetrain  && <SpecCell label="Drivetrain" value={vehicle.spec.drivetrain} />}
              </div>

              {vehicle.keyFeatures.length > 0 && (
                <div>
                  <DetailSectionHeader>Key Features</DetailSectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.keyFeatures.map((f) => (
                      <span key={f} className="px-4 py-2 border border-outline-variant/20 font-label text-[10px] uppercase tracking-widest text-white">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <DetailSectionHeader>Overview</DetailSectionHeader>
                <p className="font-body text-on-surface-variant leading-relaxed text-base md:text-lg font-light">
                  {vehicle.overview}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-high p-6 md:p-8 flex items-start gap-4">
                <span className="font-material text-3xl text-primary-container flex-shrink-0">public</span>
                <div>
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Origin</p>
                  <p className="font-body text-white font-medium">
                    {vehicle.location === 'USA' ? 'Houston, TX, USA' : vehicle.location === 'IN TRANSIT' ? 'In Transit' : 'Ghana'}
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high p-6 md:p-8 flex items-start gap-4">
                <span className="font-material text-3xl text-secondary flex-shrink-0">location_on</span>
                <div>
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                  <p className="font-body text-white font-medium">
                    {vehicle.location === 'GHANA' ? 'Tema Hub, Ghana' : vehicle.location === 'IN TRANSIT' ? 'Shipping to Tema' : 'Houston, TX, USA'}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:hidden grid grid-cols-2 gap-4">
              <a href={SNAPCHAT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 bg-surface-container-high active:scale-95 transition-transform">
                <span className="font-material text-xl text-[#FFFC00]">swipe</span>
                <span className="font-headline font-bold uppercase text-[10px] tracking-widest text-white">Snapchat</span>
              </a>
              <a href="tel:+233000000000" className="flex items-center justify-center gap-2 py-4 bg-surface-container-high active:scale-95 transition-transform">
                <span className="font-material text-xl text-white">call</span>
                <span className="font-headline font-bold uppercase text-[10px] tracking-widest text-white">Call Office</span>
              </a>
            </div>
          </div>

          {/* Action card column */}
          <div className="hidden md:block md:col-span-5">
            <div className="bg-surface-container-low p-8 sticky top-28 space-y-5">
              <div className="mb-6">
                <p className="font-body text-on-surface-variant text-sm mb-1">Asking Price</p>
                <p className={`font-headline text-5xl font-black italic ${isPriceOnReq ? 'text-primary-container' : 'text-white'}`}>
                  {displayPrice}
                </p>
              </div>
              <WhatsAppButton label="Chat on WhatsApp" message={waMessage} fullWidth size="lg" />
              <SnapchatButton fullWidth size="lg" />
              <a href="tel:+233000000000" className="w-full border-2 border-outline-variant/30 hover:border-white text-white font-headline font-black text-base py-5 flex items-center justify-center gap-3 transition-colors duration-150">
                <span className="font-material text-xl">call</span>
                Call Now
              </a>
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="font-label text-[10px] text-center uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                  24/7 Concierge Service Available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related vehicles */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-24">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-headline text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
                Similar Performance
              </h2>
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="font-label text-xs uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
              >
                View All
              </button>
            </div>

            <div className="hidden md:grid grid-cols-3 gap-8">
              {related.map((v) => (
                <div
                  key={v.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/inventory/${v.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/inventory/${v.slug}`)}
                >
                  <div className="h-56 overflow-hidden bg-surface-container-high mb-5">
                    {v.images[0] ? (
                      <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-material text-4xl text-on-surface-variant/20">directions_car</span>
                      </div>
                    )}
                  </div>
                  {v.status && <p className="font-label text-[10px] font-bold text-primary-container tracking-widest uppercase mb-1">{v.status}</p>}
                  <h3 className="font-headline text-xl font-bold text-white mb-2 italic uppercase">{v.year} {v.make} {v.model}</h3>
                  <div className="flex gap-3 text-on-surface-variant font-label text-xs uppercase tracking-widest">
                    <span>{v.spec.mileage}</span><span>•</span><span>{v.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden flex overflow-x-auto snap-x gap-4 hide-scrollbar -mx-6 px-6">
              {related.map((v) => (
                <div
                  key={v.id}
                  className="snap-start shrink-0 w-[80%] group cursor-pointer"
                  onClick={() => navigate(`/inventory/${v.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/inventory/${v.slug}`)}
                >
                  <div className="bg-surface-container-low overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      {v.images[0] ? (
                        <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <span className="font-material text-3xl text-on-surface-variant/20">directions_car</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-headline font-bold text-white uppercase italic text-lg leading-tight">{v.year} {v.make} {v.model}</h4>
                      <p className="font-headline font-black text-primary-container mt-1">
                        {formatPrice(v.showPublicPrice ? v.price : null)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
