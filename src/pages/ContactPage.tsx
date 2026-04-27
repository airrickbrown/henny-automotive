import { useState, useCallback } from 'react'
import { CheckCircle2, Send, ExternalLink, MapPin, Store, type LucideIcon } from 'lucide-react'
import PageMeta from '../components/seo/PageMeta'
import HennyLogo from '../components/ui/HennyLogo'
import { buildWhatsAppUrl, SNAPCHAT_URL } from '../lib/tokens'
import { saveLead } from '../lib/leads'
import PageWrapper from '../components/layout/PageWrapper'
import SectionLabel from '../components/ui/SectionLabel'
import Turnstile from '../components/ui/Turnstile'

// ── Channel card data ────────────────────────────────────────────────────────

// Official WhatsApp SVG (same path used site-wide)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// Official Snapchat ghost SVG (same path used site-wide)
function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.166.006c.82-.014 3.543.225 4.851 3.111.398.878.303 2.351.243 3.368l-.009.147c-.008.146-.015.285-.02.42.01.007.03.018.063.03a2.8 2.8 0 00.924.148c.375 0 .702-.1.888-.169l.048-.018a1.27 1.27 0 01.42-.073c.23 0 .51.06.72.199.33.215.504.544.489.895-.016.4-.314.74-.897 1.02-.1.048-.228.098-.366.151-.455.173-1.077.41-1.246.9a1.45 1.45 0 00-.024.82c.026.097.636 2.372-.777 3.969-.714.808-1.72 1.314-2.99 1.508.08.073.18.162.295.257.39.32.979.8 1.52 1.524.457.612.99 1.612.677 2.728-.318 1.129-1.412 1.804-2.555 1.573l-.102-.024c-.374-.097-.88-.229-1.607-.31a10.84 10.84 0 00-1.198-.072c-.43 0-.843.027-1.224.073-.74.08-1.257.211-1.633.308l-.1.025c-.224.051-.451.077-.672.077-1.126 0-2.167-.7-2.483-1.776-.336-1.13.176-2.147.638-2.765.539-.727 1.136-1.205 1.527-1.524.119-.097.222-.188.303-.263-1.27-.194-2.275-.7-2.99-1.508-1.413-1.597-.803-3.872-.777-3.969a1.45 1.45 0 00-.024-.82c-.17-.49-.791-.727-1.246-.9-.138-.053-.266-.103-.366-.151-.583-.28-.881-.62-.897-1.02-.015-.35.158-.68.49-.895.21-.138.49-.199.72-.199.141 0 .278.024.418.073l.048.018c.187.068.514.169.89.169.346 0 .657-.071.9-.143.034-.01.057-.022.067-.03l-.023-.42-.008-.147C3.086 3.58 2.99 2.107 3.39 1.23 4.698.225 7.42-.013 8.24.005c.073 0 .145.003.214.007 1.02.059 2.845.394 3.712 2.23z"/>
    </svg>
  )
}

const CHANNELS: Array<{
  id: string
  icon: LucideIcon | null
  label: string
  description: string
  cta: string | null
  href: string | null
  accent: 'secondary' | 'snapchat' | 'default'
  detail?: string
}> = [
  {
    id: 'whatsapp',
    icon: null,
    label: 'WhatsApp',
    description: 'Fastest response. Send us a message and we\'ll get back to you within the hour.',
    cta: 'Open WhatsApp',
    href: buildWhatsAppUrl('Hello, I\'d like to get in touch with Henny Automotive.'),
    accent: 'secondary',
  },
  {
    id: 'snapchat',
    icon: null,
    label: 'Snapchat',
    description: 'Follow us for live walk-arounds, auction finds, and behind-the-scenes footage.',
    cta: 'Add on Snapchat',
    href: SNAPCHAT_URL,
    accent: 'snapchat',
  },
  {
    id: 'sourcing',
    icon: MapPin,
    label: 'USA Sourcing',
    description: 'We source vehicles directly from U.S. auctions and dealers on your behalf.',
    cta: null,
    href: null,
    accent: 'default',
    detail: 'United States 🇺🇸 — Vehicle Sourcing',
  },
  {
    id: 'accra',
    icon: Store,
    label: 'Accra Showroom',
    description: 'Visit our West Africa showroom to see current stock in person.',
    cta: null,
    href: null,
    accent: 'default',
    detail: 'Accra, Ghana 🇬🇭',
  },
]

// ── Accent styles ────────────────────────────────────────────────────────────
const accentStyles = {
  secondary: {
    icon:   'text-secondary',
    border: 'border-secondary/30 hover:border-secondary/60',
    cta:    'bg-secondary text-on-secondary',
    glow:   'hover:shadow-[0_0_30px_rgba(65,229,117,0.15)]',
  },
  snapchat: {
    icon:   'text-[#FFFC00]',
    border: 'border-[#FFFC00]/20 hover:border-[#FFFC00]/50',
    cta:    'bg-[#FFFC00] text-black',
    glow:   'hover:shadow-[0_0_30px_rgba(255,252,0,0.12)]',
  },
  default: {
    icon:   'text-primary-container',
    border: 'border-outline-variant/20 hover:border-outline-variant/50',
    cta:    '',
    glow:   '',
  },
}

// ── Inquiry form ─────────────────────────────────────────────────────────────
function InquiryForm() {
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [leadError, setLeadError] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')

  const handleToken  = useCallback((token: string) => setCaptchaToken(token), [])
  const handleExpire = useCallback(() => setCaptchaToken(''), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLeadError(false)

    // Build WhatsApp message and open immediately for fast UX
    const text = [
      `Name: ${name}`,
      phone    ? `Phone: ${phone}`       : '',
      interest ? `Interest: ${interest}` : '',
      message  ? `Message: ${message}`   : '',
    ].filter(Boolean).join('\n')
    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer')

    // Persist via Edge Function (includes CAPTCHA verification + rate limiting)
    saveLead({ name, phone, interest, message, source: 'contact_form' }, captchaToken).catch(() => {
      setLeadError(true)
    })

    setSubmitted(true)
  }

  function handleReset() {
    setName(''); setPhone(''); setInterest(''); setMessage('')
    setSubmitted(false); setLeadError(false); setCaptchaToken('')
  }

  const inputClass =
    'w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary-container py-4 px-5 font-body text-sm text-white placeholder:text-white/20 outline-none transition-all'

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={48} className="text-secondary mb-4" />
        <h3 className="font-headline font-black italic uppercase text-white text-2xl mb-2">
          Message Sent!
        </h3>
        <p className="font-body text-sm text-on-surface-variant max-w-xs leading-relaxed mb-8">
          WhatsApp has opened with your message. We'll reply within the hour.
        </p>
        {leadError && (
          <p className="font-body text-xs text-red-400/70 max-w-xs leading-relaxed mb-6">
            Note: your inquiry couldn't be saved to our system. Please make sure to send the WhatsApp message so we receive it.
          </p>
        )}
        <button
          onClick={handleReset}
          className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors border border-white/10 hover:border-white/30 px-6 py-3"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
            Your Name <span className="text-primary-container">*</span>
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            maxLength={100}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
            WhatsApp / Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233 ..."
            maxLength={30}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
          I'm Interested In
        </label>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className={inputClass + ' appearance-none cursor-pointer'}
        >
          <option value="" disabled>Select an option</option>
          <option value="Buying a vehicle">Buying a vehicle</option>
          <option value="Performance parts">Performance parts</option>
          <option value="Shipping &amp; logistics">Shipping &amp; logistics</option>
          <option value="General enquiry">General enquiry</option>
        </select>
      </div>

      <div>
        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
          Message
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more — year, make, model, budget, timeline..."
          maxLength={2000}
          className={inputClass + ' resize-none'}
        />
      </div>

      <Turnstile onToken={handleToken} onExpire={handleExpire} />

      <button
        type="submit"
        className="w-full bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs py-5 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-3"
      >
        Send via WhatsApp
        <Send size={18} />
      </button>

      <p className="font-label text-[10px] text-white/20 text-center uppercase tracking-widest">
        Tapping submit opens WhatsApp with your message pre-filled
      </p>
    </form>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <PageWrapper>
      <PageMeta
        title="Contact Us"
        description="Get in touch with Henny Automotive via WhatsApp or Snapchat. Sourcing from the U.S. for Accra, Ghana. We respond within the hour."
        path="/contact"
      />
      <div className="px-6 md:px-8 max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <SectionLabel className="mb-4">Get In Touch</SectionLabel>
              <h1 className="font-headline font-black italic tracking-tighter leading-none uppercase text-[clamp(2.8rem,8vw,5rem)]">
                Let's Talk <br />Cars.
              </h1>
            </div>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-md">
              Whether you're hunting a specific model, shipping a vehicle, or
              sourcing a performance part — we're one message away.
            </p>
          </div>
        </header>

        {/* ── Channels + Form ─────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Left: channel cards */}
          <div className="w-full lg:w-5/12 space-y-4">
            {CHANNELS.map((ch) => {
              const style = accentStyles[ch.accent]
              return (
                <div
                  key={ch.id}
                  className={`bg-surface-container-low border ${style.border} ${style.glow} p-6 transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    {ch.id === 'whatsapp' ? (
                      <WhatsAppIcon className={`flex-shrink-0 mt-0.5 ${style.icon}`} />
                    ) : ch.id === 'snapchat' ? (
                      <SnapchatIcon className={`flex-shrink-0 mt-0.5 ${style.icon}`} />
                    ) : ch.icon ? (
                      (() => { const Icon = ch.icon!; return <Icon size={24} className={`flex-shrink-0 mt-0.5 ${style.icon}`} /> })()
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold uppercase tracking-tight text-white mb-1">
                        {ch.label}
                      </p>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                        {ch.description}
                      </p>
                      {'detail' in ch && ch.detail && (
                        <p className="font-label text-[10px] uppercase tracking-widest text-white/40 mt-2">
                          {ch.detail}
                        </p>
                      )}
                      {ch.cta && ch.href && (
                        <a
                          href={ch.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-4 inline-flex items-center gap-2 ${style.cta} font-headline font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-all duration-150 hover:brightness-105 active:scale-95`}
                        >
                          {ch.cta}
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: inquiry form */}
          <div className="flex-1 min-w-0">
            <div className="bg-surface-container-low p-8">
              <div className="mb-8">
                <SectionLabel className="mb-2">Quick Inquiry</SectionLabel>
                <h2 className="font-headline font-black italic uppercase tracking-tighter text-2xl text-white">
                  Send Us a Message
                </h2>
              </div>
              <InquiryForm />
            </div>
          </div>

        </div>

        {/* ── Bottom strip ────────────────────────────────────── */}
        <div className="mt-20 border-t border-outline-variant/10 pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <HennyLogo width={120} />
            <p className="font-label text-[10px] uppercase tracking-widest text-white/30 mt-1">
              USA Sourcing &nbsp;·&nbsp; Accra, Ghana &nbsp;·&nbsp; Est. 2014
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-high border border-outline-variant/20 text-secondary hover:bg-secondary hover:text-on-secondary hover:border-secondary transition-all duration-150"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href={SNAPCHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-high border border-outline-variant/20 text-[#FFFC00] hover:bg-[#FFFC00] hover:text-black hover:border-[#FFFC00] transition-all duration-150"
              aria-label="Snapchat"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M12.166.006c.82-.014 3.543.225 4.851 3.111.398.878.303 2.351.243 3.368l-.009.147c-.008.146-.015.285-.02.42.01.007.03.018.063.03a2.8 2.8 0 00.924.148c.375 0 .702-.1.888-.169l.048-.018a1.27 1.27 0 01.42-.073c.23 0 .51.06.72.199.33.215.504.544.489.895-.016.4-.314.74-.897 1.02-.1.048-.228.098-.366.151-.455.173-1.077.41-1.246.9a1.45 1.45 0 00-.024.82c.026.097.636 2.372-.777 3.969-.714.808-1.72 1.314-2.99 1.508.08.073.18.162.295.257.39.32.979.8 1.52 1.524.457.612.99 1.612.677 2.728-.318 1.129-1.412 1.804-2.555 1.573l-.102-.024c-.374-.097-.88-.229-1.607-.31a10.84 10.84 0 00-1.198-.072c-.43 0-.843.027-1.224.073-.74.08-1.257.211-1.633.308l-.1.025c-.224.051-.451.077-.672.077-1.126 0-2.167-.7-2.483-1.776-.336-1.13.176-2.147.638-2.765.539-.727 1.136-1.205 1.527-1.524.119-.097.222-.188.303-.263-1.27-.194-2.275-.7-2.99-1.508-1.413-1.597-.803-3.872-.777-3.969a1.45 1.45 0 00-.024-.82c-.17-.49-.791-.727-1.246-.9-.138-.053-.266-.103-.366-.151-.583-.28-.881-.62-.897-1.02-.015-.35.158-.68.49-.895.21-.138.49-.199.72-.199.141 0 .278.024.418.073l.048.018c.187.068.514.169.89.169.346 0 .657-.071.9-.143.034-.01.057-.022.067-.03l-.023-.42-.008-.147C3.086 3.58 2.99 2.107 3.39 1.23 4.698.225 7.42-.013 8.24.005c.073 0 .145.003.214.007 1.02.059 2.845.394 3.712 2.23z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
