import BentoCard from '../cards/BentoCard'

const CARDS = [
  {
    icon: 'verified_user',
    iconColor: 'red' as const,
    title: 'Absolute Trust',
    body: 'Every vehicle undergoes a rigorous 150-point inspection in the USA before it ever touches Ghana soil. Transparency is our engine.',
    variant: 'default' as const,
    className: 'md:col-span-2',
  },
  {
    icon: 'speed',
    iconColor: 'white' as const,
    title: 'Unmatched Speed',
    body: 'Fast-track shipping from Houston/NJ to Tema Harbor.',
    variant: 'accent' as const,
    className: '',
  },
  {
    icon: 'local_shipping',
    iconColor: 'green' as const,
    title: 'Secure Delivery',
    body: 'Real-time GPS tracking and dedicated clearing agents ensure your car arrives safely at your doorstep.',
    variant: 'border-green' as const,
    className: '',
  },
  {
    title: 'Elite Sourcing',
    body: 'Direct access to dealer-only auctions across America. We find the gems others miss.',
    variant: 'dim' as const,
    watermark: 'USA',
    className: 'md:col-span-2',
  },
] as const

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
              icon={'icon' in card ? card.icon : undefined}
              iconColor={'iconColor' in card ? card.iconColor : undefined}
              title={card.title}
              body={card.body}
              variant={card.variant}
              watermark={'watermark' in card ? card.watermark : undefined}
              className={card.className}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
