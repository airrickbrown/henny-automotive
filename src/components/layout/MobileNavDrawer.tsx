import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronRight, MapPin } from 'lucide-react'
import { NAV_LINKS } from '../../lib/constants'
import { buildWhatsAppUrl, SNAPCHAT_URL } from '../../lib/tokens'
import { cn } from '../../lib/utils'
import HennyLogo from '../ui/HennyLogo'

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on any navigation — route change or hash anchor
  useEffect(() => {
    onClose()
  }, [pathname, hash]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] transition-opacity duration-300 md:hidden',
          'bg-black/70 backdrop-blur-sm',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-screen w-[300px] z-[70] flex flex-col md:hidden',
          'transition-transform duration-300 ease-out',
          'glass-drawer',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" aria-label="Henny Automotive — Home">
            <HennyLogo width={110} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-150"
          >
            <X size={28} />
          </button>
        </div>

        {/* Subtle divider */}
        <div className="mx-6 h-px bg-white/[0.06]" />

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_LINKS.map((link) => {
              const active = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-4 font-headline font-bold uppercase tracking-widest text-sm transition-all duration-150 rounded-sm',
                      active
                        ? 'text-primary-container font-black bg-primary-container/[0.07] border-l-2 border-primary-container pl-[14px]'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    )}
                  >
                    {link.label}
                    {active && (
                      <ChevronRight size={16} className="text-primary-container" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="my-6 h-px bg-white/[0.06] mx-3" />

          {/* Social CTAs */}
          <div className="space-y-2.5 px-3">
            <a
              href={buildWhatsAppUrl('Hi, I\'d like to source a car from the USA. Can you help me find the right one?')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-headline font-bold uppercase tracking-widest text-xs py-4 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Source My Car on WhatsApp
            </a>
            <a
              href={SNAPCHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#FFFC00] text-black font-headline font-bold uppercase tracking-widest text-xs py-4 hover:brightness-95 active:scale-[0.98] transition-all duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M12.01 2C7.01 2 4 5.4 4 9.5c0 1.3.1 2.1.3 2.8-.3.2-.7.3-1.1.4-.5.1-.8.5-.8.9 0 .5.4.9.9 1 .3.1.6.1.9.2.1.1.2.3.2.5 0 .1 0 .2-.1.3-.4.7-1.3 1.8-1.3 2.8 0 1.1.9 2 2 2 .3 0 .5 0 .8-.1.5-.1 1-.2 1.6-.2.4 0 .8 0 1.1.1.6.3 1.2.9 2.5 1.4.4.1.8.2 1.2.2s.8-.1 1.2-.2c1.3-.5 1.9-1.1 2.5-1.4.3-.1.7-.1 1.1-.1.6 0 1.1.1 1.6.2.3.1.5.1.8.1 1.1 0 2-.9 2-2 0-1-.9-2.1-1.3-2.8-.1-.1-.1-.2-.1-.3 0-.2.1-.4.2-.5.3-.1.6-.1.9-.2.5-.1.9-.5.9-1 0-.4-.3-.8-.8-.9-.4-.1-.8-.2-1.1-.4.2-.7.3-1.5.3-2.8C20 5.4 17 2 12.01 2z" />
              </svg>
              Add on Snapchat
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="mx-6 h-px bg-white/[0.06]" />
        <div className="px-8 py-5">
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-primary-container mt-0.5" />
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/40">
                USA Sourcing &nbsp;·&nbsp; Accra, Ghana
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/20 mt-0.5">
                Est. 2014
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
