import { useNavigate } from 'react-router-dom'
import IgnitionButton from '../ui/IgnitionButton'
import GhostButton from '../ui/GhostButton'
import SectionLabel from '../ui/SectionLabel'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { useSettings } from '../../contexts/SettingsContext'

export default function HeroSection() {
  const navigate  = useNavigate()
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
          {/* Left-to-right gradient keeps left side legible */}
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
              <a
                href={buildWhatsAppUrl('Hi, I\'d like to enquire about your inventory.')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black font-headline font-black uppercase tracking-widest px-10 py-5 text-base rounded inline-flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all duration-150"
              >
                Chat on WhatsApp
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

          <h1 className="font-headline font-black italic uppercase leading-[0.9] tracking-tighter text-[clamp(2.75rem,13vw,5rem)] mb-8">
            {tagline}
          </h1>

          <div className="flex flex-col gap-3">
            <IgnitionButton
              label="View Inventory"
              size="lg"
              trailingIcon="arrow_forward"
              fullWidth
              onClick={() => navigate('/inventory')}
            />
            <GhostButton
              label="Source a Car"
              size="lg"
              glass
              fullWidth
              href="/#usa-sourcing"
            />
          </div>
        </div>
      </div>

    </header>
  )
}
