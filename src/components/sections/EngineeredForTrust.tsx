import { ShieldCheck, Gauge, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BentoCard from '../cards/BentoCard'

const CARDS: Array<{
  icon?: LucideIcon
  iconColor?: 'red' | 'green' | 'white'
  title: string
  body: string
  variant: 'default' | 'dim' | 'accent' | 'border-red' | 'border-green'
  watermark?: string
  className: string
}> = [
  {
    icon: ShieldCheck,
    iconColor: 'red',
    title: 'Absolute Trust',
    body: 'Every vehicle undergoes a rigorous 150-point inspection in the USA before it ever touches Ghana soil. Transparency is our engine.',
    variant: 'default',
    className: 'md:col-span-2',
  },
  {
    icon: Gauge,
    iconColor: 'white',
    title: 'Unmatched Speed',
    body: 'Fast-track shipping from U.S. ports to Tema Harbour, Ghana.',
    variant: 'accent',
    className: '',
  },
  {
    icon: Truck,
    iconColor: 'green',
    title: 'Secure Delivery',
    body: 'Real-time GPS tracking and dedicated clearing agents ensure your car arrives safely at your doorstep.',
    variant: 'border-green',
    className: '',
  },
  {
    title: 'Elite Sourcing',
    body: 'Direct access to dealer-only auctions across America. We find the gems others miss.',
    variant: 'dim',
    watermark: 'USA',
    className: 'md:col-span-2',
  },
]

export default function EngineeredForTrust() {
  return (
    <section id="trust" className="py-24 md:py-32 px-6 md:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="font-headline text-4xl md:text-5xl font-black text-white uppercase leading-none kinetic mb-12 md:mb-16">
          Engineered for{' '}
          <span className="text-primary-container">Trust</span>
        </h2>

        {/* Bento grid
            Desktop: 3-col, auto-rows 250px — gives 2+1 / 1+2 layout
            Mobile:  single col stacked      */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:auto-rows-[250px]">
          {CARDS.map((card) => (
            <BentoCard
              key={card.title}
              icon={card.icon}
              iconColor={card.iconColor}
              title={card.title}
              body={card.body}
              variant={card.variant}
              watermark={card.watermark}
              className={card.className}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
