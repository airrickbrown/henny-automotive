import { useState, useCallback, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_BASE_URL, SNAPCHAT_URL, GHANA_PHONE, GHANA_PHONE_DISPLAY } from '../../lib/tokens'
import { subscribeNewsletter } from '../../lib/newsletter'
import HennyLogo from '../ui/HennyLogo'
import Turnstile from '../ui/Turnstile'

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Car Parts', href: '/parts' },
  { label: 'About Us',  href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

const SERVICE_LINKS = [
  { label: 'Buy a Car',            href: '/inventory' },
  { label: 'Car Parts & Spares',   href: '/parts' },
  { label: 'Car Import & Shipping', href: '/about' },
  { label: 'Get a Quote',          href: '/contact' },
  { label: 'Car Diagnostics',      href: '/contact' },
  { label: 'Tuning & Performance', href: '/contact' },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-headline text-white font-bold uppercase tracking-widest text-sm mb-6">
      {children}
    </h4>
  )
}

function FooterLink({ href, children, external = false }: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const cls = 'font-body text-sm text-gray-400 hover:text-white transition-all duration-150 hover:translate-x-1.5 inline-block'
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {children}
    </Link>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken = useCallback((token: string) => setCaptchaToken(token), [])
  const handleExpire = useCallback(() => setCaptchaToken(''), [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const { error } = await subscribeNewsletter(email, captchaToken)
    if (error === 'already_subscribed') {
      setStatus('duplicate')
    } else if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setEmail('')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2.5 bg-secondary/10 border border-secondary/20 px-4 py-3">
        <span className="font-material-filled text-base text-secondary flex-shrink-0">check_circle</span>
        <p className="font-label text-xs uppercase tracking-wider text-secondary">
          You're subscribed. Welcome!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="EMAIL"
          required
          maxLength={254}
          disabled={status === 'loading'}
          className="bg-surface-container-high text-white text-xs p-3 w-full focus:ring-1 focus:ring-primary-container outline-none font-label uppercase tracking-widest placeholder:text-gray-600 min-w-0 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label="Subscribe"
          className="bg-primary-container text-white px-4 flex items-center justify-center hover:brightness-110 transition-all duration-150 flex-shrink-0 disabled:opacity-60"
        >
          {status === 'loading'
            ? <span className="font-material text-xl animate-spin">progress_activity</span>
            : <span className="font-material text-xl">chevron_right</span>
          }
        </button>
      </div>
      {status === 'duplicate' && (
        <p className="font-label text-[10px] uppercase tracking-widest text-yellow-500 mt-2">
          Already subscribed with that email.
        </p>
      )}
      {status === 'error' && (
        <p className="font-label text-[10px] uppercase tracking-widest text-red-400 mt-2">
          Something went wrong. Please try again.
        </p>
      )}
      {status === 'idle' && (
        <p className="font-label text-[10px] uppercase tracking-widest text-gray-600 mt-3">
          No spam. Unsubscribe any time.
        </p>
      )}
      <Turnstile onToken={handleToken} onExpire={handleExpire} />
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="bg-footer-bg w-full pt-16 pb-32 md:pb-16 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-5">
              <HennyLogo width={120} />
            </div>
            <p className="font-body text-sm leading-relaxed text-gray-400 max-w-xs">
              Elite automotive sourcing from the USA to Ghana —
              built on precision, driven by trust since 2014.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-surface-container-low hover:bg-[#25D366] text-gray-400 hover:text-white transition-all duration-200"
                aria-label="WhatsApp"
              >
                <span className="font-material text-lg">chat</span>
              </a>
              <a
                href={SNAPCHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-surface-container-low hover:bg-[#FFFC00] text-gray-400 hover:text-black transition-all duration-200"
                aria-label="Snapchat"
              >
                <span className="font-material text-lg">swipe</span>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div>
            <FooterHeading>Navigate</FooterHeading>
            <ul className="space-y-3.5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <FooterHeading>Services</FooterHeading>
            <ul className="space-y-3.5">
              {SERVICE_LINKS.map(link => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Ghana Hub */}
          <div>
            <FooterHeading>Ghana Hub</FooterHeading>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-primary-container flex-shrink-0 mt-0.5">location_on</span>
                <span className="font-body text-sm text-gray-400">
                  L573 Yomo Afoko St<br />
                  Agbogbe Plaza<br />
                  Accra, Ghana
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-gray-500 flex-shrink-0 mt-0.5">flag</span>
                <span className="font-body text-sm text-gray-400">
                  Nashville, TN, USA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-gray-500 flex-shrink-0 mt-0.5">local_shipping</span>
                <span className="font-body text-sm text-gray-400">
                  Delivery all over Ghana
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-material text-sm text-gray-500 flex-shrink-0 mt-0.5">schedule</span>
                <span className="font-body text-sm text-gray-400">
                  Mon – Sat · 9:00 AM – 5:00 PM
                </span>
              </li>
              <li>
                <a
                  href={`tel:${GHANA_PHONE}`}
                  className="font-body text-sm text-gray-400 hover:text-white transition-all duration-150 hover:translate-x-1.5 inline-flex items-center gap-2"
                >
                  <span className="font-material text-sm">call</span>
                  {GHANA_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-gray-400 hover:text-[#25D366] transition-all duration-150 hover:translate-x-1.5 inline-block"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 — Newsletter */}
          <div>
            <FooterHeading>Stay Updated</FooterHeading>
            <p className="font-body text-xs text-gray-400 mb-4 leading-relaxed">
              Be first to know when new containers arrive and exclusive deals drop.
            </p>
            <NewsletterForm />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Henny Automotive. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="font-label text-[10px] uppercase font-bold text-gray-600 hover:text-white tracking-widest transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
