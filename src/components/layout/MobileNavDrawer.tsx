import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../../lib/constants'
import { buildWhatsAppUrl, SNAPCHAT_URL } from '../../lib/tokens'
import { cn } from '../../lib/utils'

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const { pathname } = useLocation()

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 z-40 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-screen w-[300px] bg-surface-container-low z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <Link to="/" className="font-headline font-black italic text-white text-lg tracking-tighter">
            HENNY <span className="text-primary-container">AUTO</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-material text-2xl">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-4 font-headline font-bold uppercase tracking-widest text-sm transition-all duration-150',
                      active
                        ? 'text-primary-container bg-primary-container/5 border-l-2 border-primary-container pl-[14px]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="font-material text-base text-primary-container">chevron_right</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          <div className="my-6 border-t border-white/5" />

          {/* Social CTAs */}
          <div className="space-y-3 px-4">
            <a
              href={buildWhatsAppUrl('Hello, I found you on the Henny Automotive website.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-secondary text-on-secondary font-headline font-bold uppercase tracking-widest text-xs py-4 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
            >
              <span className="font-material-filled text-lg">chat</span>
              WhatsApp Us
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

        {/* Footer — location */}
        <div className="px-8 py-5 border-t border-white/5">
          <div className="flex items-start gap-3">
            <span className="font-material text-sm text-primary-container mt-0.5">location_on</span>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/40">
                Houston, TX &nbsp;·&nbsp; Accra, Ghana
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
