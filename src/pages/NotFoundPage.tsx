import { Link, useLocation } from 'react-router-dom'
import { Home, Car } from 'lucide-react'
import { buildWhatsAppUrl } from '../lib/tokens'
import PageMeta from '../components/seo/PageMeta'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      <PageMeta
        title="404 — Page Not Found"
        description="This page doesn't exist. Head back to Henny Automotive to browse our inventory."
      />

      {/* Big 404 */}
      <p className="font-headline font-black italic text-[clamp(6rem,25vw,16rem)] leading-none text-surface-container-high select-none pointer-events-none">
        404
      </p>

      {/* Copy — sits on top of the 404 via negative margin */}
      <div className="-mt-8 md:-mt-12 relative z-10">
        <h1 className="font-headline font-black italic uppercase tracking-tighter text-[clamp(1.5rem,5vw,3rem)] text-white leading-none mb-4">
          Page Not Found.
        </h1>
        <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-md mx-auto mb-10">
          The page at{' '}
          <code className="font-label text-sm text-primary-container bg-primary-container/10 px-2 py-0.5">
            {pathname}
          </code>{' '}
          doesn't exist. It may have moved or never existed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 ignition-glow hover:brightness-110 active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            to="/inventory"
            className="border border-outline-variant/30 text-white/60 font-headline font-bold uppercase tracking-widest text-xs px-8 py-4 hover:text-white hover:border-outline-variant/60 active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-2"
          >
            <Car size={18} />
            Browse Inventory
          </Link>
        </div>

        {/* WhatsApp fallback */}
        <p className="mt-10 font-label text-[10px] uppercase tracking-widest text-white/20">
          Looking for something specific?{' '}
          <a
            href={buildWhatsAppUrl("Hi, I couldn't find what I was looking for on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary border-b border-secondary/40 pb-px hover:border-secondary transition-colors duration-150"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>

    </div>
  )
}
