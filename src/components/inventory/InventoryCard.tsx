import { useNavigate } from 'react-router-dom'
import { Car, Gauge, Settings, MapPin, Tag, ArrowRight } from 'lucide-react'
import type { Vehicle } from '../../types/vehicle'
import { cn, formatPrice } from '../../lib/utils'
import StatusBadge from '../ui/StatusBadge'
import type { BadgeVariant } from '../ui/StatusBadge'

interface InventoryCardProps {
  vehicle: Vehicle
  view?: 'grid' | 'list'
  className?: string
}

export default function InventoryCard({ vehicle, view = 'grid', className }: InventoryCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/inventory/${vehicle.slug}`)
  }

  const displayPrice = formatPrice(vehicle.showPublicPrice ? vehicle.price : null)

  if (view === 'list') {
    return (
      <div
        className={cn(
          'group cursor-pointer flex gap-5 border-b border-outline-variant/10 pb-6 hover:border-outline-variant/30 transition-colors duration-150',
          className
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      >
        {/* Image */}
        <div className="relative flex-shrink-0 w-40 sm:w-52 aspect-[4/3] overflow-hidden bg-surface-container-low">
          {vehicle.images[0] ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car size={36} className="text-on-surface-variant/20" />
            </div>
          )}
          {vehicle.status && (
            <div className="absolute top-0 left-0 z-10">
              <StatusBadge variant={vehicle.status as BadgeVariant} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-black italic uppercase tracking-tighter text-white leading-tight mb-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && <span className="text-on-surface-variant text-base font-bold"> · {vehicle.trim}</span>}
            </h3>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-white/40">
                <Gauge size={14} />
                <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.spec.mileage}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Settings size={14} />
                <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.spec.engine}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <MapPin size={14} />
                <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Tag size={14} />
                <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.condition}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-headline font-black text-xl text-primary-container">{displayPrice}</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white transition-colors flex items-center gap-1">
              Details <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className={cn('group cursor-pointer', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-container-low aspect-[4/3] mb-6">
        {vehicle.images[0] ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <Car size={48} className="text-on-surface-variant/20" />
          </div>
        )}
        {vehicle.status && (
          <div className="absolute top-0 left-0 z-10">
            <StatusBadge variant={vehicle.status as BadgeVariant} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 flex items-end justify-center pb-8 pointer-events-none">
          <span className="font-headline text-lg font-black italic tracking-tighter uppercase text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Details
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-white leading-tight">
            {vehicle.make} {vehicle.model} {vehicle.year}
          </h3>
          <span className="font-headline font-black text-xl text-primary-container flex-shrink-0">
            {displayPrice}
          </span>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5 text-white/40">
            <Gauge size={14} />
            <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.spec.mileage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40">
            <Settings size={14} />
            <span className="font-label text-[10px] uppercase tracking-widest">{vehicle.spec.engine}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
