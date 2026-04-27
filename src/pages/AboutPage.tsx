import { Link } from 'react-router-dom'
import { Building2, Store, BadgeCheck, Anchor, Quote, ArrowRight, MessageCircle } from 'lucide-react'
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
        description="Born in Houston, built for Accra. Since 2014, Henny Automotive has redefined premium vehicle sourcing between the USA and West Africa — one flawless delivery at a time."
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
              Born in Houston, built for Accra. Henny Automotive has been
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
                    Headquarters
                  </span>
                </div>
                <div>
                  <p className="font-headline font-black italic uppercase text-3xl text-white leading-none mb-1">
                    Houston, TX
                  </p>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    United States 🇺🇸
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

      {/* ── 3. The Vision ────────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-32">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

            {/* Left: image + quote */}
            <div className="relative w-full md:w-5/12 flex-shrink-0">
              <div className="aspect-[4/5] bg-surface-container-high overflow-hidden">
                <img
                  src="/images/about-vision.jpg"
                  alt="The Henny vision"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              {/* Quote overlay */}
              <div className="absolute -bottom-8 -right-4 md:-bottom-12 md:-right-8 bg-primary-container p-6 max-w-[260px] z-10">
                <Quote size={24} className="text-white/40 block mb-2" />
                <p className="font-headline font-bold italic text-white text-sm leading-snug">
                  "Not just cars — a statement of arrival."
                </p>
              </div>
            </div>

            {/* Right: copy */}
            <div className="pt-0 md:pt-8 flex-1 mt-12 md:mt-0">
              <SectionLabel className="mb-5">Our Philosophy</SectionLabel>
              <h2 className="font-headline font-black italic uppercase tracking-tighter leading-none text-[clamp(2rem,5vw,4rem)] text-white mb-8">
                The Kinetic <br />
                <span className="text-primary-container">Monolith.</span>
              </h2>

              <div className="space-y-5 font-body text-on-surface-variant leading-relaxed">
                <p>
                  Henny Automotive was founded on a single belief: that buyers in
                  West Africa deserve access to the same premium, fully-inspected
                  machinery available in the US market — without compromise,
                  without guesswork.
                </p>
                <p>
                  We source directly from US auctions and dealerships, put every
                  vehicle through a rigorous 150-point inspection, and handle
                  every step of international logistics in-house. When your car
                  lands in Accra, it is exactly what we promised.
                </p>
                <p>
                  Over ten years and hundreds of deliveries, that promise has
                  never changed.
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
            From Houston auction lanes to your driveway in Accra — every
            kilometre tracked, every document handled.
          </p>
          <a
            href={buildWhatsAppUrl('Hello, I\'d like to learn more about your shipping process.')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 transition-all duration-150 active:scale-[0.98] inline-flex items-center gap-3"
          >
            Ask About Shipping
            <MessageCircle size={18} />
          </a>
        </div>
      </section>

    </PageWrapper>
  )
}
