import BentoCard from '../cards/BentoCard'

const CARDS = [
  {
    icon: 'public',
    iconFill: true,
    iconColor: 'red' as const,
    flag: '🇺🇸',
    title: 'USA Sourcing',
    body: 'Direct access to premium American auctions and dealerships. Hand-picked performance vehicles.',
    chips: ['Auction Direct', 'Inspection Ready'],
    variant: 'border-red' as const,
  },
  {
    icon: 'hub',
    iconFill: true,
    iconColor: 'green' as const,
    flag: '🇬🇭',
    title: 'Ghana Hub',
    body: 'Seamless clearance and delivery at our Accra showroom. The destination for automotive elite.',
    chips: ['Local Stock', 'VIP Delivery'],
    variant: 'border-green' as const,
  },
] as const

export default function MarketSourcingGrid() {
  return (
    <section className="bg-surface-container-low py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {CARDS.map((card) => (
          <BentoCard
            key={card.title}
            icon={card.icon}
            iconFill={card.iconFill}
            iconColor={card.iconColor}
            flag={card.flag}
            title={card.title}
            body={card.body}
            chips={card.chips as unknown as string[]}
            variant={card.variant}
            className="min-h-[240px]"
          />
        ))}
      </div>
    </section>
  )
}
