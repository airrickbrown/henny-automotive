import { useState } from 'react'
import PageMeta from '../components/seo/PageMeta'
import HennyLogo from '../components/ui/HennyLogo'
import { buildWhatsAppUrl, SNAPCHAT_URL } from '../lib/tokens'
import { saveLead } from '../lib/leads'
import PageWrapper from '../components/layout/PageWrapper'
import SectionLabel from '../components/ui/SectionLabel'

// ── Channel card data ────────────────────────────────────────────────────────
const CHANNELS = [
  {
    id: 'whatsapp',
    icon: 'chat',
    iconFill: true,
    label: 'WhatsApp',
    description: 'Fastest response. Send us a message and we\'ll get back to you within the hour.',
    cta: 'Open WhatsApp',
    href: buildWhatsAppUrl('Hello, I\'d like to get in touch with Henny Automotive.'),
    accent: 'secondary' as const,
  },
  {
    id: 'snapchat',
    icon: 'photo_camera',
    iconFill: true,
    label: 'Snapchat',
    description: 'Follow us for live walk-arounds, auction finds, and behind-the-scenes footage.',
    cta: 'Add on Snapchat',
    href: SNAPCHAT_URL,
    accent: 'snapchat' as const,
  },
  {
    id: 'houston',
    icon: 'location_on',
    iconFill: true,
    label: 'Houston Office',
    description: 'Our US sourcing headquarters. Viewing by appointment.',
    cta: null,
    href: null,
    accent: 'default' as const,
    detail: 'Houston, TX — United States 🇺🇸',
  },
  {
    id: 'accra',
    icon: 'storefront',
    iconFill: true,
    label: 'Accra Showroom',
    description: 'Visit our West Africa showroom to see current stock in person.',
    cta: null,
    href: null,
    accent: 'default' as const,
    detail: 'Accra, Ghana 🇬🇭',
  },
] as const

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

    // Persist to Supabase in parallel — show a non-blocking warning if it fails
    saveLead({ name, phone, interest, message, source: 'contact_form' }).catch(() => {
      setLeadError(true)
    })

    setSubmitted(true)
  }

  function handleReset() {
    setName(''); setPhone(''); setInterest(''); setMessage('')
    setSubmitted(false); setLeadError(false)
  }

  const inputClass =
    'w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary-container py-4 px-5 font-body text-sm text-white placeholder:text-white/20 outline-none transition-all'

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="font-material-filled text-5xl text-secondary mb-4">check_circle</span>
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

      <button
        type="submit"
        className="w-full bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs py-5 ignition-glow hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-3"
      >
        Send via WhatsApp
        <span className="font-material-filled text-lg">send</span>
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
        description="Get in touch with Henny Automotive via WhatsApp or Snapchat. Based in Houston, TX and Accra, Ghana. We respond within the hour."
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
                    <span className={`font-material-filled text-2xl flex-shrink-0 mt-0.5 ${style.icon}`}>
                      {ch.icon}
                    </span>
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
                          <span className="font-material text-base">open_in_new</span>
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
              Houston, TX &nbsp;·&nbsp; Accra, Ghana &nbsp;·&nbsp; Est. 2014
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
              <span className="font-material-filled text-xl">chat</span>
            </a>
            <a
              href={SNAPCHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-high border border-outline-variant/20 text-[#FFFC00] hover:bg-[#FFFC00] hover:text-black hover:border-[#FFFC00] transition-all duration-150"
              aria-label="Snapchat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M12.01 2C7.01 2 4 5.4 4 9.5c0 1.3.1 2.1.3 2.8-.3.2-.7.3-1.1.4-.5.1-.8.5-.8.9 0 .5.4.9.9 1 .3.1.6.1.9.2.1.1.2.3.2.5 0 .1 0 .2-.1.3-.4.7-1.3 1.8-1.3 2.8 0 1.1.9 2 2 2 .3 0 .5 0 .8-.1.5-.1 1-.2 1.6-.2.4 0 .8 0 1.1.1.6.3 1.2.9 2.5 1.4.4.1.8.2 1.2.2s.8-.1 1.2-.2c1.3-.5 1.9-1.1 2.5-1.4.3-.1.7-.1 1.1-.1.6 0 1.1.1 1.6.2.3.1.5.1.8.1 1.1 0 2-.9 2-2 0-1-.9-2.1-1.3-2.8-.1-.1-.1-.2-.1-.3 0-.2.1-.4.2-.5.3-.1.6-.1.9-.2.5-.1.9-.5.9-1 0-.4-.3-.8-.8-.9-.4-.1-.8-.2-1.1-.4.2-.7.3-1.5.3-2.8C20 5.4 17 2 12.01 2z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
