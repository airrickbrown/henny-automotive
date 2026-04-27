import { useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import type { Vehicle } from '../../types/vehicle'
import { cn, formatPrice } from '../../lib/utils'
import StatusBadge from '../ui/StatusBadge'
import type { BadgeVariant } from '../ui/StatusBadge'
import WhatsAppButton from '../ui/WhatsAppButton'

interface VehicleCardProps {
  vehicle: Vehicle
  showWhatsAppButton?: boolean
  onClick?: () => void
  className?: string
}

export default function VehicleCard({
  vehicle,
  showWhatsAppButton = false,
  onClick,
  className,
}: VehicleCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    if (onClick) {
      onClick()
    } else {
      navigate(`/inventory/${vehicle.slug}`)
    }
  }

  const waMessage = `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` (${vehicle.trim})` : ''}. SKU: ${vehicle.sku}`

  const displayPrice = formatPrice(vehicle.showPublicPrice ? vehicle.price : null)
  const isPriceOnReq = !vehicle.showPublicPrice || vehicle.price === null

  return (
    <div
      className={cn(
        'group bg-surface-container cursor-pointer flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
        {vehicle.images[0] ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={48} className="text-on-surface-variant/20" />
          </div>
        )}

        {/* Status Badge — top left */}
        {vehicle.status && (
          <div className="absolute top-0 left-0">
            <StatusBadge variant={vehicle.status as BadgeVariant} />
          </div>
        )}

        {/* Category chip — top right */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/70 backdrop-blur-sm text-white font-label text-[10px] uppercase tracking-widest px-2 py-1">
            {vehicle.category}
          </span>
        </div>

        {/* Hover overlay — bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4 gap-2">
        {/* Year + Mileage */}
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
            {vehicle.year}
          </span>
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
            {vehicle.spec.mileage}
          </span>
        </div>

        {/* Make + Model */}
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
            {vehicle.make}
          </p>
          <h3 className="font-headline text-[1.15rem] font-black uppercase tracking-tight text-white leading-tight">
            {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="font-label text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
              {vehicle.trim}
            </p>
          )}
        </div>

        {/* Condition chip */}
        <div>
          <span className="font-label text-[9px] uppercase tracking-widest border border-white/10 px-2 py-0.5 text-on-surface-variant/60">
            {vehicle.condition}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-white/5">
          <p
            className={cn(
              'font-headline text-xl font-black',
              isPriceOnReq ? 'text-primary-container' : 'text-white'
            )}
          >
            {displayPrice}
          </p>
        </div>

        {/* WhatsApp CTA */}
        {showWhatsAppButton && (
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <WhatsAppButton
              label="Enquire"
              message={waMessage}
              fullWidth
              size="md"
            />
          </div>
        )}
      </div>
    </div>
  )
}
