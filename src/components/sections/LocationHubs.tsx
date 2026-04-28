import { Gavel, ShieldCheck, Ship, Car, MessageCircle, Anchor, CheckSquare, Handshake, ExternalLink, type LucideIcon } from 'lucide-react'
import { buildWhatsAppUrl } from '../../lib/tokens'
import { useImages } from '../../contexts/ImagesContext'

function Detail({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={18} className="text-primary-container flex-shrink-0 mt-0.5" />
      <span className="font-body text-sm text-on-surface-variant leading-relaxed">{text}</span>
    </li>
  )
}

export function HubUSA() {
  const images = useImages()
  return (
    <section id="usa-sourcing" className="py-24 md:py-32 px-6 md:px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Content */}
        <div>
          <p className="font-label text-xs uppercase tracking-[0.25em] text-primary-container font-bold mb-4">
            🇺🇸 &nbsp;United States
          </p>
          <h2 className="font-headline font-black text-white uppercase leading-none text-[clamp(2.5rem,5vw,3.75rem)] mb-6">
            USA Vehicle<br />
            <span className="text-primary-container">Sourcing</span>
          </h2>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10">
            Henny Automotive helps you source the right vehicle from the U.S. market
            and coordinates every step of the process — from finding the car to
            delivering it to your door in Ghana.
          </p>
          <ul className="space-y-4">
            <Detail icon={Gavel}      text="Sourcing from trusted U.S. auctions and licensed dealers — clean titles, inspected vehicles" />
            <Detail icon={ShieldCheck} text="Vehicle selection support and condition checks before purchase — no guesswork" />
            <Detail icon={Ship}        text="Full shipping coordination to Ghana, including container booking and port documentation" />
            <Detail icon={Car}         text="Delivery support after arrival — customs clearance, DVLA processing, and handover at your location" />
          </ul>
        </div>

        {/* Info panel */}
        <div className="bg-surface-container overflow-hidden">

          {/* Sourcing image */}
          <div className="relative h-56 w-full overflow-hidden">
            <img
              src={images['logistics-usa']}
              alt="U.S. vehicle export port"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container/90 backdrop-blur-sm px-3 py-1.5 border border-white/[0.08]">
              <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">🇺🇸 U.S. Sourcing</span>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-8">

            <div className="border-b border-white/[0.06] pb-8">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">What we handle for you</p>
              <div className="flex flex-wrap gap-2">
                {['Auction Sourcing', 'Vehicle Inspection', 'Export Docs', 'Container Shipping', 'Ghana Delivery'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-surface-container-high font-label text-[10px] uppercase tracking-widest text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Start your sourcing request</p>
              <a
                href={buildWhatsAppUrl('Hi, I\'d like to source a vehicle from the USA. Can you help me?')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-4 ignition-glow hover:brightness-110 active:scale-[0.98] transition-all duration-150"
              >
                <MessageCircle size={16} />
                Source My Car on WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export function HubGhana() {
  return (
    <section id="ghana-hub" className="py-24 md:py-32 px-6 md:px-8 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Info panel — left on desktop */}
        <div className="bg-surface-container order-2 md:order-1 overflow-hidden">

          {/* Interactive map — edge to edge */}
          <div className="relative h-72 w-full">
            <iframe
              title="Tema Port, Ghana"
              src="https://maps.google.com/maps?q=Tema+Port,+Tema,+Ghana&t=k&z=15&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Pin label */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container/95 backdrop-blur-sm px-3 py-1.5 border border-white/[0.08] pointer-events-none">
              <span className="font-label text-[10px] uppercase tracking-widest text-secondary">🇬🇭 Tema Port</span>
            </div>
            {/* Open in Maps link */}
            <a
              href="https://maps.google.com/maps?q=Tema+Port,+Tema,+Ghana"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface-container/95 backdrop-blur-sm px-3 py-1.5 border border-white/[0.08] font-label text-[10px] uppercase tracking-widest text-white/50 hover:text-secondary transition-colors duration-150"
            >
              <ExternalLink size={10} />
              Open in Maps
            </a>
          </div>

          {/* Panel content */}
          <div className="p-8 md:p-10 space-y-8">

            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Base</p>
              <p className="font-headline font-black text-white text-2xl">Tema / Accra, GH</p>
            </div>

            <div className="border-t border-white/[0.06] pt-8">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Operations</p>
              <div className="flex flex-wrap gap-2">
                {['Port Clearing', 'Customs Processing', 'Vehicle Delivery', 'Customer Handover'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-surface-container-high font-label text-[10px] uppercase tracking-widest text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-8">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Track your vehicle</p>
              <a
                href={buildWhatsAppUrl('Hi, I want to check the status of my vehicle delivery in Ghana.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-secondary text-on-secondary font-headline font-bold uppercase tracking-widest text-xs px-6 py-4 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
              >
                <MessageCircle size={16} />
                WhatsApp Ghana Team
              </a>
            </div>

          </div>
        </div>

        {/* Content — right on desktop */}
        <div className="order-1 md:order-2">
          <p className="font-label text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">
            🇬🇭 &nbsp;Tema / Accra
          </p>
          <h2 className="font-headline font-black text-white uppercase leading-none text-[clamp(2.5rem,5vw,3.75rem)] mb-6">
            Ghana Delivery<br />
            <span className="text-secondary">Hub</span>
          </h2>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10">
            Our Accra-Tema hub handles everything from port arrival to your
            driveway — in-house clearing agents, customs processing, and a
            dedicated handover team ensure a smooth final mile.
          </p>
          <ul className="space-y-4">
            <Detail icon={Anchor}       text="In-house clearing agents at Tema port — no delays, no hidden charges" />
            <Detail icon={CheckSquare}  text="Full customs documentation and DVLA processing managed end-to-end" />
            <Detail icon={Handshake}    text="Personal delivery and handover inspection at your location in Ghana" />
          </ul>
        </div>

      </div>
    </section>
  )
}
