import { useState, useCallback, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  WHATSAPP_BASE_URL,
  SNAPCHAT_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  GHANA_PHONE,
  GHANA_PHONE_DISPLAY,
  buildWhatsAppUrl,
} from '../../lib/tokens'
import { subscribeNewsletter } from '../../lib/newsletter'
import HennyLogo from '../ui/HennyLogo'
import Turnstile from '../ui/Turnstile'

// ── Newsletter form ───────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail]             = useState('')
  const [status, setStatus]           = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken  = useCallback((t: string) => setCaptchaToken(t), [])
  const handleExpire = useCallback(() => setCaptchaToken(''), [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const { error } = await subscribeNewsletter(email, captchaToken)
    if (error === 'already_subscribed') { setStatus('duplicate') }
    else if (error)                      { setStatus('error') }
    else                                 { setStatus('success'); setEmail('') }
  }

  if (status === 'success') return (
    <p className="font-label text-xs uppercase tracking-widest text-secondary">You're in. Welcome.</p>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="your@email.com"
          required
          maxLength={254}
          disabled={status === 'loading'}
          className="flex-1 min-w-0 bg-white/5 text-white text-xs px-4 py-3 outline-none focus:bg-white/8 transition-colors font-body placeholder:text-white/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label="Subscribe"
          className="bg-primary-container text-white px-4 flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50 flex-shrink-0"
        >
          <span className="font-material text-base">
            {status === 'loading' ? 'progress_activity' : 'arrow_forward'}
          </span>
        </button>
      </div>
      {status === 'duplicate' && <p className="font-label text-[10px] uppercase tracking-widest text-yellow-500">Already subscribed.</p>}
      {status === 'error'     && <p className="font-label text-[10px] uppercase tracking-widest text-red-400">Something went wrong.</p>}
      <Turnstile onToken={handleToken} onExpire={handleExpire} />
    </form>
  )
}

// ── Column heading ────────────────────────────────────────────────────────────
function ColHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-headline font-bold text-white uppercase tracking-[0.2em] text-xs mb-6 ${className}`}>
      {children}
    </p>
  )
}

// ── Internal link ─────────────────────────────────────────────────────────────
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="block font-body text-sm text-white/40 hover:text-white hover:translate-x-1 transition-all duration-200"
    >
      {children}
    </Link>
  )
}

// ── External link ─────────────────────────────────────────────────────────────
function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block font-body text-sm text-white/40 hover:text-white hover:translate-x-1 transition-all duration-200"
    >
      {children}
    </a>
  )
}

// ── Social icon button ────────────────────────────────────────────────────────
function SocialIcon({
  href,
  label,
  hoverClass,
  children,
}: {
  href: string
  label: string
  hoverClass: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`w-10 h-10 flex items-center justify-center bg-white/5 text-white/40 transition-all duration-200 ${hoverClass}`}
    >
      {children}
    </a>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  const waHref = buildWhatsAppUrl('Hello, I\'d like to enquire about a vehicle.')

  return (
    <footer className="bg-[#0A0A0A] w-full">

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Col 1: Brand ───────────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <HennyLogo width={110} />
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed mb-2">
              Elite automotive sourcing from the USA to Ghana.
            </p>
            <p className="font-headline font-bold text-white/60 text-sm italic">
              "You ask, we deliver."
            </p>

            {/* Social row */}
            <div className="flex gap-3 mt-8">
              <SocialIcon href={waHref} label="WhatsApp" hoverClass="hover:bg-[#25D366] hover:text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href={INSTAGRAM_URL} label="Instagram" hoverClass="hover:bg-[#E1306C] hover:text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href={TIKTOK_URL} label="TikTok" hoverClass="hover:bg-white hover:text-black">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.16 8.16 0 004.77 1.52V6.83a4.85 4.85 0 01-1-.14z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href={SNAPCHAT_URL} label="Snapchat" hoverClass="hover:bg-[#FFFC00] hover:text-black">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12.166.006c.82-.014 3.543.225 4.851 3.111.398.878.303 2.351.243 3.368l-.009.147c-.008.146-.015.285-.02.42.01.007.03.018.063.03a2.8 2.8 0 00.924.148c.375 0 .702-.1.888-.169l.048-.018a1.27 1.27 0 01.42-.073c.23 0 .51.06.72.199.33.215.504.544.489.895-.016.4-.314.74-.897 1.02-.1.048-.228.098-.366.151-.455.173-1.077.41-1.246.9a1.45 1.45 0 00-.024.82c.026.097.636 2.372-.777 3.969-.714.808-1.72 1.314-2.99 1.508.08.073.18.162.295.257.39.32.979.8 1.52 1.524.457.612.99 1.612.677 2.728-.318 1.129-1.412 1.804-2.555 1.573l-.102-.024c-.374-.097-.88-.229-1.607-.31a10.84 10.84 0 00-1.198-.072c-.43 0-.843.027-1.224.073-.74.08-1.257.211-1.633.308l-.1.025c-.224.051-.451.077-.672.077-1.126 0-2.167-.7-2.483-1.776-.336-1.13.176-2.147.638-2.765.539-.727 1.136-1.205 1.527-1.524.119-.097.222-.188.303-.263-1.27-.194-2.275-.7-2.99-1.508-1.413-1.597-.803-3.872-.777-3.969a1.45 1.45 0 00-.024-.82c-.17-.49-.791-.727-1.246-.9-.138-.053-.266-.103-.366-.151-.583-.28-.881-.62-.897-1.02-.015-.35.158-.68.49-.895.21-.138.49-.199.72-.199.141 0 .278.024.418.073l.048.018c.187.068.514.169.89.169.346 0 .657-.071.9-.143.034-.01.057-.022.067-.03l-.023-.42-.008-.147C3.086 3.58 2.99 2.107 3.39 1.23 4.698.225 7.42-.013 8.24.005c.073 0 .145.003.214.007 1.02.059 2.845.394 3.712 2.23z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* ── Col 2: Quick Links ──────────────────────────────────────── */}
          <div>
            <ColHeading>Quick Links</ColHeading>
            <nav className="space-y-3.5">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/inventory">Inventory</NavLink>
              <NavLink to="/parts">Parts</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            <ColHeading className="mt-10">Legal</ColHeading>
            <nav className="space-y-3.5">
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              <NavLink to="/terms-of-service">Terms of Service</NavLink>
            </nav>
          </div>

          {/* ── Col 3: Operations ───────────────────────────────────────── */}
          <div>
            <ColHeading>Operations</ColHeading>
            <div className="space-y-6">

              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary-container mb-1.5">USA Logistics Hub</p>
                <p className="font-body text-sm text-white/60 leading-relaxed">Houston, TX</p>
              </div>

              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary-container mb-1.5">Ghana Showroom</p>
                <p className="font-body text-sm text-white/60 leading-relaxed">
                  Tema, Accra<br />
                  L573 Yomo Afoko St, Agbogbe Plaza
                </p>
              </div>

              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-white/20 mb-1.5">Hours</p>
                <p className="font-body text-sm text-white/40">Mon – Sat · 9 AM – 5 PM</p>
              </div>

              <div>
                <a
                  href={`tel:${GHANA_PHONE}`}
                  className="font-body text-sm text-white/40 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {GHANA_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          {/* ── Col 4: Social & Contact ─────────────────────────────────── */}
          <div>
            <ColHeading>Get in Touch</ColHeading>
            <div className="space-y-3.5 mb-10">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-body text-sm text-white/40 hover:text-[#25D366] hover:translate-x-1 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <ExtLink href={INSTAGRAM_URL}>Instagram · @hennyautomotive</ExtLink>
              <ExtLink href={TIKTOK_URL}>TikTok · @hennyautomotive</ExtLink>
              <ExtLink href={SNAPCHAT_URL}>Snapchat · hennyautomotive</ExtLink>
            </div>

            <ColHeading>Newsletter</ColHeading>
            <p className="font-body text-xs text-white/30 mb-4 leading-relaxed">
              First to know when new containers land.
            </p>
            <NewsletterForm />
          </div>

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/[0.04]">
        <p className="font-label text-[11px] uppercase tracking-widest text-white/20">
          © {new Date().getFullYear()} Henny Automotive. All rights reserved.
        </p>
        <p className="font-label text-[11px] uppercase tracking-widest text-white/20">
          USA · Ghana · Built on trust.
        </p>
      </div>

    </footer>
  )
}
