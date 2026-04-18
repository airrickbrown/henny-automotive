import { cn } from '../../lib/utils'

interface BentoCardProps {
  /** Material Symbols icon name */
  icon?: string
  /** Use filled variant of the icon */
  iconFill?: boolean
  /** Color of the icon */
  iconColor?: 'red' | 'green' | 'white'
  /** Emoji flag shown top-right e.g. "🇺🇸" */
  flag?: string
  title: string
  body: string
  /** Small chips rendered at the bottom */
  chips?: string[]
  /**
   * default      — dark bg (surface-container-high), no border
   * dim          — darker bg (surface-container-low), no border
   * accent       — red bg (primary-container), white text
   * border-red   — dark bg + left red border
   * border-green — dark bg + left green border
   */
  variant?: 'default' | 'dim' | 'accent' | 'border-red' | 'border-green'
  /** Large watermark text rendered behind content */
  watermark?: string
  className?: string
}

const bgMap = {
  default:       'bg-surface-container-high',
  dim:           'bg-surface-container-low',
  accent:        'bg-primary-container',
  'border-red':  'bg-surface-container-high border-l-4 border-primary-container',
  'border-green':'bg-surface-container-high border-l-4 border-secondary',
}

const iconColorMap = {
  red:   'text-primary-container',
  green: 'text-secondary',
  white: 'text-white',
}

export default function BentoCard({
  icon,
  iconFill = false,
  iconColor = 'red',
  flag,
  title,
  body,
  chips,
  variant = 'default',
  watermark,
  className,
}: BentoCardProps) {
  const isAccent = variant === 'accent'

  return (
    <div
      className={cn(
        'relative overflow-hidden p-10 flex flex-col justify-end transition-all duration-200 hover:brightness-110',
        bgMap[variant],
        className
      )}
    >
      {/* Watermark */}
      {watermark && (
        <div
          aria-hidden="true"
          className="absolute right-[-5%] bottom-[-8%] font-headline text-[180px] font-black text-white/5 select-none leading-none pointer-events-none"
        >
          {watermark}
        </div>
      )}

      {/* Icon + Flag row */}
      {(icon || flag) && (
        <div className="flex items-start justify-between mb-6">
          {icon && (
            <span
              className={cn(
                iconFill ? 'font-material-filled' : 'font-material',
                'text-4xl',
                isAccent ? 'text-white' : iconColorMap[iconColor]
              )}
            >
              {icon}
            </span>
          )}
          {!icon && <span />}
          {flag && (
            <span className="text-3xl leading-none select-none">{flag}</span>
          )}
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          'font-headline text-2xl font-black uppercase tracking-tight mb-2',
          isAccent ? 'text-white' : 'text-white'
        )}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        className={cn(
          'font-body text-sm leading-relaxed',
          isAccent ? 'text-white/80' : 'text-on-surface-variant'
        )}
      >
        {body}
      </p>

      {/* Chips */}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {chips.map((chip) => (
            <span
              key={chip}
              className={cn(
                'font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1 border',
                isAccent
                  ? 'border-white/30 text-white/70'
                  : 'border-outline-variant/20 text-on-surface-variant'
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
