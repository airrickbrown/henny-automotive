import { useNavigate } from 'react-router-dom'
import IgnitionButton from '../ui/IgnitionButton'
import SectionLabel from '../ui/SectionLabel'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { useSettings } from '../../contexts/SettingsContext'

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function HeroSection() {
  const navigate    = useNavigate()
  const { tagline } = useSettings()

  return (
    <header className="relative overflow-hidden">

      {/* ─── DESKTOP HERO (md+) ─────────────────────────────────────── */}
      <div className="hidden md:flex relative min-h-screen items-center pt-20">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-car.jpg"
            alt="Premium luxury car — Henny Automotive"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="font-headline font-black text-white leading-none kinetic mb-6 text-[clamp(4rem,9vw,7.5rem)] uppercase">
              Find Your <br />
              <span className="text-primary-container">Dream Car</span>
            </h1>

            <p className="font-body text-xl text-on-surface-variant max-w-xl mb-10 border-l-4 border-primary-container pl-6 leading-relaxed">
              Premium USA Sourcing. Reliable Ghana Delivery.{' '}
              The ultimate bridge for automotive excellence.
            </p>

            <div className="flex flex-wrap gap-4">
              <IgnitionButton
                label="View Inventory"
                size="lg"
                trailingIcon="arrow_forward"
                onClick={() => navigate('/inventory')}
              />
              {/* WhatsApp-branded CTA */}
              <a
                href={buildWhatsAppUrl('Hi, I\'d like to source a car from the USA. Can you help me find the right one?')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-headline font-black uppercase tracking-widest px-10 py-5 text-base inline-flex items-center gap-3 hover:brightness-105 active:scale-95 transition-all duration-150"
              >
                <WhatsAppIcon size={22} />
                Source My Car
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE HERO (< md) ─────────────────────────────────────── */}
      <div className="flex md:hidden relative h-screen flex-col justify-end overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-car-mobile.jpg"
            alt="Premium luxury car — Henny Automotive"
            className="w-full h-full object-cover"
          />
          {/* Bottom-to-top gradient anchors text */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>

        {/* Content pinned to bottom — pb accounts for fixed bottom nav (~64px) + breathing room */}
        <div className="relative z-10 px-6 pb-28">
          <SectionLabel className="mb-4">Engineered for Prestige</SectionLabel>

          <h1 className="font-headline font-black italic uppercase leading-[0.9] tracking-tighter text-[clamp(2.75rem,13vw,5rem)] mb-4">
            {tagline}
          </h1>

          <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-6">
            Premium vehicles sourced from the USA, delivered to your door in Ghana.
          </p>

          {/* Single WhatsApp CTA — the primary conversion action on mobile */}
          <a
            href={buildWhatsAppUrl('Hi, I\'d like to source a car from the USA. Can you help me find the right one?')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-headline font-black uppercase tracking-widest px-6 py-5 text-base active:scale-[0.98] hover:brightness-105 transition-all duration-150"
          >
            <WhatsAppIcon size={24} />
            Source My Car on WhatsApp
          </a>
        </div>
      </div>

    </header>
  )
}
