import { cn } from '../../lib/utils'

export type BadgeVariant =
  | 'JUST ARRIVED'
  | 'HOT DEAL'
  | 'FEATURED'
  | 'NEW ARRIVAL'
  | 'HOT PICK'
  | 'USA SOURCED'
  | 'LIMITED'
  | 'IN TRANSIT'
  | 'SHIPPING FROM USA'

interface StatusBadgeProps {
  variant: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  'JUST ARRIVED':      'bg-primary-container text-white',
  'HOT DEAL':          'bg-primary-container text-white',
  'FEATURED':          'bg-primary-container text-white',
  'NEW ARRIVAL':       'bg-primary-container text-white',
  'HOT PICK':          'bg-primary-container text-white',
  'USA SOURCED':       'bg-surface-bright text-white',
  'LIMITED':           'bg-surface-bright text-white',
  'IN TRANSIT':        'bg-white text-black',
  'SHIPPING FROM USA': 'bg-white text-black',
}

export default function StatusBadge({ variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 font-label text-[10px] font-black uppercase tracking-widest',
        variantClasses[variant],
        className
      )}
    >
      {variant}
    </span>
  )
}
