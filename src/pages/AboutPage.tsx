import { Link } from 'react-router-dom'
import { Building2, Store, BadgeCheck, Anchor, Quote, ArrowRight } from 'lucide-react'
import PageMeta from '../components/seo/PageMeta'
import { buildWhatsAppUrl } from '../lib/tokens'
import PageWrapper from '../components/layout/PageWrapper'
import SectionLabel from '../components/ui/SectionLabel'

// ── About Page ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <PageWrapper>
      <PageMeta
        title="The Henny Legacy"
        description="Born from passion, built through experience. Since 2014, Henny Automotive has been a bridge between the United States and West Africa — delivering premium vehicles one flawless delivery at a time."
        image="/images/about-hero.jpg"
        path="/about"
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-surface min-h-[520px] md:min-h-[700px] flex items-center overflow-hidden">

        {/* Right: faded car image */}
        <div
          className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/about-hero.jpg)' }}
          aria-hidden="true"
        >
          {/* Gradient mask — fade left on desktop, fade bottom on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent md:hidden" />
        </div>

        {/* Left: copy */}
        <div className="relative z-10 px-6 md:px-8 max-w-7xl mx-auto w-full py-24 md:py-32">
          <div className="max-w-xl">
            <SectionLabel className="mb-6">Established 2014</SectionLabel>
            <h1 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(3rem,9vw,6rem)] mb-8">
              The Henny <br />
              <span className="text-primary-container">Legacy.</span>
            </h1>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-md">
              Built for Accra. Powered by the U.S. market. Henny Automotive has been
              redefining premium vehicle sourcing between the United States
              and West Africa for over a decade — one flawless delivery at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Global Presence Bento ─────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">

          <div className="mb-10">
            <SectionLabel className="mb-3">Our Footprint</SectionLabel>
            <h2 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(2rem,5vw,3.5rem)] text-white">
              Two Cities. <span className="text-primary-container">One Standard.</span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[240px]">

            {/* Houston HQ — col-span-2 */}
            <div className="relative md:col-span-2 bg-surface-container-high overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                style={{ backgroundImage: 'url(/images/houston.jpg)' }}
              />
              <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={24} className="text-primary-container" />
                  <span className="font-label text-xs font-bold uppercase tracking-widest text-white/60">
                    USA Sourcing
                  </span>
                </div>
                <div>
                  <p className="font-headline font-black italic uppercase text-3xl text-white leading-none mb-1">
                    United States
                  </p>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    Vehicle Sourcing 🇺🇸
                  </p>
                </div>
              </div>
            </div>

            {/* Accra Showroom — col-span-2 */}
            <div className="relative md:col-span-2 bg-surface-container-high overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                style={{ backgroundImage: 'url(/images/accra.jpg)' }}
              />
              <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Store size={24} className="text-primary-container" />
                  <span className="font-label text-xs font-bold uppercase tracking-widest text-white/60">
                    Showroom
                  </span>
                </div>
                <div>
                  <p className="font-headline font-black italic uppercase text-3xl text-white leading-none mb-1">
                    Accra, Ghana
                  </p>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    West Africa 🇬🇭
                  </p>
                </div>
              </div>
            </div>

            {/* 150-Point Inspection */}
            <div className="bg-surface-container-high p-7 flex flex-col justify-between">
              <BadgeCheck size={30} className="text-secondary" />
              <div>
                <p className="font-headline font-black italic uppercase text-xl text-white leading-tight mb-1">
                  150-Point Inspection
                </p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Every vehicle certified
                </p>
              </div>
            </div>

            {/* Direct Port Clearance */}
            <div className="bg-surface-container-high p-7 flex flex-col justify-between">
              <Anchor size={30} className="text-secondary" />
              <div>
                <p className="font-headline font-black italic uppercase text-xl text-white leading-tight mb-1">
                  Direct Port Clearance
                </p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Zero middlemen
                </p>
              </div>
            </div>

            {/* CTA — col-span-2 */}
            <Link
              to="/inventory"
              className="relative md:col-span-2 bg-primary-container group overflow-hidden flex items-center justify-between px-7"
            >
              <p className="font-headline font-black italic uppercase text-2xl md:text-3xl text-white leading-tight">
                View Current Inventory
              </p>
              <ArrowRight size={36} className="text-white/60 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>

          </div>
        </div>
      </section>

      {/* ── 3. The Origin Story ──────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-32">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

            {/* Left: image + quote */}
            <div className="relative w-full md:w-5/12 flex-shrink-0">
              <div className="aspect-[4/5] bg-surface-container-high overflow-hidden">
                <img
                  src="/images/about-vision.jpg"
                  alt="Henny Automotive — the origin story"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              {/* Quote overlay */}
              <div className="absolute -bottom-8 -right-4 md:-bottom-12 md:-right-8 bg-primary-container p-6 max-w-[260px] z-10">
                <Quote size={24} className="text-white/40 block mb-2" />
                <p className="font-headline font-bold italic text-white text-sm leading-snug">
                  "A bridge between the United States and West Africa."
                </p>
              </div>
            </div>

            {/* Right: copy */}
            <div className="pt-0 md:pt-8 flex-1 mt-12 md:mt-0">
              <SectionLabel className="mb-5">Our Story</SectionLabel>
              <h2 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(2rem,5vw,4rem)] text-white mb-3">
                Born from Passion,
              </h2>
              <h2 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(2rem,5vw,4rem)] text-primary-container mb-8">
                Built through Experience.
              </h2>

              <div className="space-y-5 font-body text-on-surface-variant leading-relaxed">
                <p>
                  After moving to the United States in 2014, Henny's love for cars
                  deepened under the guidance of his uncle — a key figure who
                  introduced him to the world of sourcing, buying, and understanding
                  vehicles beyond the surface.
                </p>
                <p>
                  With his mother's support, he purchased his first car — a moment
                  that marked the beginning of something bigger.
                </p>
                <p>
                  In 2020, Henny Automotive was established.
                </p>
                <p>
                  Today, it stands as a bridge between the United States and West
                  Africa, delivering premium vehicles with precision, trust, and
                  purpose — one flawless delivery at a time.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-outline-variant/20 pt-10">
                <div>
                  <p className="font-headline font-black italic text-4xl text-primary-container">500+</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                    Vehicles Delivered
                  </p>
                </div>
                <div>
                  <p className="font-headline font-black italic text-4xl text-primary-container">100%</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                    Clear Title Guarantee
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Full-bleed logistics banner ───────────────────────────────────── */}
      <section className="relative h-[400px] md:h-[560px] overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
          style={{ backgroundImage: 'url(/images/port.jpg)' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/70" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Centered copy */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <SectionLabel className="mb-5">Logistics &amp; Delivery</SectionLabel>
          <h2 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(2rem,7vw,5.5rem)] text-white mb-6">
            Global Logistics. <br />
            <span className="text-primary-container">Local Trust.</span>
          </h2>
          <p className="font-body text-on-surface-variant text-lg max-w-lg leading-relaxed mb-8">
            From U.S. auction lanes to your driveway in Accra — every
            kilometre tracked, every document handled.
          </p>
          <a
            href={buildWhatsAppUrl('Hello, I\'d like to learn more about your shipping process.')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 transition-all duration-150 active:scale-[0.98] inline-flex items-center gap-3"
          >
            Ask About Shipping
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </section>

    </PageWrapper>
  )
}
