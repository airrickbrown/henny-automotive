import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useScrolled } from '../../hooks/useScrolled'
import { useActiveRoute } from '../../hooks/useActiveRoute'
import { NAV_LINKS } from '../../lib/constants'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { cn } from '../../lib/utils'
import MobileNavDrawer from './MobileNavDrawer'
import HennyLogo from '../ui/HennyLogo'

export default function Navbar() {
  const isScrolled = useScrolled(50)
  const isActive = useActiveRoute()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'glass-nav-scrolled' : 'glass-nav'
      )}
    >
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1920px] mx-auto">

        {/* Brand logo */}
        <Link to="/" className="hover:opacity-90 transition-opacity flex-shrink-0" aria-label="Henny Automotive — Home">
          <HennyLogo width={140} />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'font-headline uppercase tracking-widest text-sm font-bold transition-all duration-150',
                isActive(link.href)
                  ? 'text-primary-container border-b-2 border-primary-container pb-1'
                  : 'text-white/70 hover:text-white hover:bg-white/5 px-2 py-1'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right — WhatsApp CTA */}
        <div className="hidden md:flex items-center">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ignition font-headline font-black uppercase text-xs tracking-widest text-white px-6 py-2 rounded ignition-glow hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile right — search + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            aria-label="Search inventory"
            onClick={() => navigate('/inventory')}
            className="text-white hover:text-primary-container transition-colors duration-150"
          >
            <span className="font-material text-2xl">search</span>
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="text-white hover:text-primary-container transition-colors duration-150"
          >
            <span className="font-material text-3xl">menu</span>
          </button>
        </div>

      </div>
    </nav>

    <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
