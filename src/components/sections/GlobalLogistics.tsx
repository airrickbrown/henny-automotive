import { Network, Anchor, type LucideIcon } from 'lucide-react'
import { useImages } from '../../contexts/ImagesContext'

const BULLETS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Network,
    title: 'USA Export License',
    body: 'Authorized bidding on all major insurance and clean title auctions.',
  },
  {
    icon: Anchor,
    title: 'Direct Port Clearance',
    body: 'In-house clearing agents in Tema to avoid unnecessary delays and costs.',
  },
]



export default function GlobalLogistics() {
  const images = useImages()
  return (
    <section id="logistics" className="py-24 md:py-32 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* ── Left: photo collage ─────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Column 1 — photo top, USA card bottom */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-surface-container">
              <img
                src={images['logistics-usa']}
                alt="American container port"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
            </div>
            <div className="bg-surface-bright p-6">
              <p className="font-headline font-black text-white text-4xl italic">
                USA 🇺🇸
              </p>
              <p className="font-label text-xs uppercase tracking-widest text-primary-container font-bold mt-2">
                Sourcing: U.S. Auctions
              </p>
            </div>
          </div>

          {/* Column 2 — offset down, GH card top, photo bottom */}
          <div className="space-y-4 pt-12">
            <div className="bg-primary-container p-6">
              <p className="font-headline font-black text-white text-4xl italic">
                GH 🇬🇭
              </p>
              <p className="font-label text-xs uppercase tracking-widest text-white/70 font-bold mt-2">
                Hub: Accra — Tema
              </p>
            </div>
            <div className="aspect-square overflow-hidden bg-surface-container">
              <img
                src={images['logistics-ghana']}
                alt="Ghana automotive workshop"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── Right: text + bullets ───────────────────────────────── */}
        <div>
          <h2 className="font-headline font-black text-white uppercase leading-tight mb-8 text-[clamp(2.5rem,5vw,3.75rem)]">
            Global Logistics <br />
            Local{' '}
            <span className="text-primary-container">Precision</span>
          </h2>

          <p className="font-body text-xl text-on-surface-variant mb-10 leading-relaxed">
            Our dual-hub strategy ensures seamless transitions. From the moment
            we secure your vehicle in the United States to the final handover in
            Ghana, every step is managed by Henny Automotive specialists. No
            middlemen. No excuses.
          </p>

          <ul className="space-y-6">
            {BULLETS.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <item.icon size={24} className="text-primary-container mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-headline font-bold text-white uppercase tracking-wider text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
