import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeaturedVehicles } from '../../lib/vehicles'
import { formatPrice } from '../../lib/utils'
import SectionLabel from '../ui/SectionLabel'
import SectionHeading from '../ui/SectionHeading'
import StatusBadge from '../ui/StatusBadge'
import type { Vehicle } from '../../types/vehicle'
import type { BadgeVariant } from '../ui/StatusBadge'

export default function FeaturedPerformance() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<Vehicle[]>([])

  useEffect(() => {
    getFeaturedVehicles(4).then(setFeatured)
  }, [])

  if (featured.length === 0) return null

  return (
    <section id="featured" className="py-24 md:py-32 bg-surface-container-low px-6 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <SectionLabel>Stock Highlights</SectionLabel>
            <SectionHeading size="md" className="mt-2">Featured Performance</SectionHeading>
          </div>
          <a
            href="/inventory"
            onClick={(e) => { e.preventDefault(); navigate('/inventory') }}
            className="hidden md:block font-headline text-sm font-bold text-white uppercase tracking-widest border-b-2 border-white/20 hover:border-primary-container transition-colors duration-150 pb-1"
          >
            Browse All Models
          </a>
          <a
            href="/inventory"
            onClick={(e) => { e.preventDefault(); navigate('/inventory') }}
            className="md:hidden font-label text-xs uppercase tracking-widest text-primary-container border-b border-primary-container pb-0.5"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {featured.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/inventory/${vehicle.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/inventory/${vehicle.slug}`)}
              aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            >
              <div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden">
                {vehicle.images[0] ? (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-material text-5xl text-on-surface-variant/20">directions_car</span>
                  </div>
                )}
                {vehicle.status && (
                  <div className="absolute top-0 left-0">
                    <StatusBadge variant={vehicle.status as BadgeVariant} />
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="font-headline text-2xl font-bold text-white uppercase italic leading-tight tracking-tight">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="font-body text-sm text-on-surface-variant tracking-tight">
                  {vehicle.trim
                    ? `${vehicle.trim} • ${vehicle.year} • ${vehicle.spec.mileage}`
                    : `${vehicle.year} • ${vehicle.spec.mileage}`}
                </p>
                <div className="pt-2">
                  <span className="font-headline font-black text-xl text-primary-container">
                    {formatPrice(vehicle.showPublicPrice ? vehicle.price : null)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:hidden text-center">
          <button
            onClick={() => navigate('/inventory')}
            className="font-headline font-bold text-sm uppercase tracking-widest text-white border-b-2 border-white/20 pb-1"
          >
            Browse All Models
          </button>
        </div>

      </div>
    </section>
  )
}
