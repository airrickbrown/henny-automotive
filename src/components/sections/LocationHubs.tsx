import { Gavel, ShieldCheck, Truck, MessageCircle, Anchor, CheckSquare, Handshake, type LucideIcon } from 'lucide-react'
import { buildWhatsAppUrl } from '../../lib/tokens'

function Detail({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={18} className="text-primary-container flex-shrink-0 mt-0.5" />
      <span className="font-body text-sm text-on-surface-variant leading-relaxed">{text}</span>
    </li>
  )
}

export function HubUSA() {
  return (
    <section id="usa-hub" className="py-24 md:py-32 px-6 md:px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Content */}
        <div>
          <p className="font-label text-xs uppercase tracking-[0.25em] text-primary-container font-bold mb-4">
            🇺🇸 &nbsp;Houston, Texas
          </p>
          <h2 className="font-headline font-black text-white uppercase leading-none text-[clamp(2.5rem,5vw,3.75rem)] mb-6">
            USA Logistics<br />
            <span className="text-primary-container">Hub</span>
          </h2>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10">
            Our Houston command center manages all North American vehicle sourcing
            and export operations — from dealer-only auction floors to container
            loading at the port.
          </p>
          <ul className="space-y-4">
            <Detail icon={Gavel}        text="Direct bidding access to insurance, salvage, and clean-title auctions across the USA" />
            <Detail icon={ShieldCheck}  text="Licensed exporter with full documentation handled in-house — no third-party agents" />
            <Detail icon={Truck}        text="Container booking and port logistics coordinated from our Houston office" />
          </ul>
        </div>

        {/* Info panel */}
        <div className="bg-surface-container p-8 md:p-10 space-y-8">

          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Base</p>
            <p className="font-headline font-black text-white text-2xl">Houston, TX</p>
          </div>

          <div className="border-t border-white/[0.06] pt-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Operations</p>
            <div className="flex flex-wrap gap-2">
              {['Vehicle Sourcing', 'Auction Bidding', 'Export Licensing', 'Container Shipping'].map(tag => (
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
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Enquire about a vehicle</p>
            <a
              href={buildWhatsAppUrl('Hi, I have a question about sourcing a vehicle from your USA hub.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-ignition text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-4 ignition-glow hover:brightness-110 active:scale-[0.98] transition-all duration-150"
            >
              <MessageCircle size={16} />
              WhatsApp USA Team
            </a>
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
        <div className="bg-surface-container p-8 md:p-10 space-y-8 order-2 md:order-1">

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
