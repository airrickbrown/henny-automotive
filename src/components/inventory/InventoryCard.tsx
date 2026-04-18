import { useNavigate } from 'react-router-dom'
import type { Vehicle } from '../../types/vehicle'
import { cn, formatPrice } from '../../lib/utils'
import StatusBadge from '../ui/StatusBadge'
import type { BadgeVariant } from '../ui/StatusBadge'

interface InventoryCardProps {
  vehicle: Vehicle
  className?: string
}

export default function InventoryCard({ vehicle, className }: InventoryCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/inventory/${vehicle.slug}`)
  }

  const displayPrice = formatPrice(vehicle.showPublicPrice ? vehicle.price : null)

  return (
    <div
      className={cn('group cursor-pointer', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      {/* ── Image ───────────────────────────────────────────────── */}
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
            <span className="font-material text-5xl text-on-surface-variant/20">
              directions_car
            </span>
          </div>
        )}

        {/* Status badge */}
        {vehicle.status && (
          <div className="absolute top-0 left-0 z-10">
            <StatusBadge variant={vehicle.status as BadgeVariant} />
          </div>
        )}

        {/* "View Details" hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 flex items-end justify-center pb-8 pointer-events-none">
          <span className="font-headline text-lg font-black italic tracking-tighter uppercase text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Details
          </span>
        </div>
      </div>

      {/* ── Text ────────────────────────────────────────────────── */}
      <div className="space-y-3 px-2">

        {/* Name + Price */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-white leading-tight">
            {vehicle.make} {vehicle.model} {vehicle.year}
          </h3>
          <span className="font-headline font-black text-xl text-primary-container flex-shrink-0">
            {displayPrice}
          </span>
        </div>

        {/* Specs row */}
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5 text-white/40">
            <span className="font-material text-sm">speed</span>
            <span className="font-label text-[10px] uppercase tracking-widest">
              {vehicle.spec.mileage}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40">
            <span className="font-material text-sm">settings</span>
            <span className="font-label text-[10px] uppercase tracking-widest">
              {vehicle.spec.engine}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
