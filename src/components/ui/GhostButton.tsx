import { cn } from '../../lib/utils'

interface GhostButtonProps {
  label: string
  onClick?: () => void
  href?: string
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  glass?: boolean
  leadingIcon?: string
  trailingIcon?: string
  type?: 'button' | 'submit'
  className?: string
}

const sizeClasses = {
  sm: 'px-6 py-2 text-xs',
  md: 'px-8 py-4 text-sm',
  lg: 'px-10 py-5 text-base',
}

const baseClasses =
  'font-headline font-bold uppercase tracking-widest text-white rounded inline-flex items-center justify-center gap-2 transition-all duration-150 hover:border-primary-container active:scale-95'

export default function GhostButton({
  label,
  onClick,
  href,
  fullWidth = false,
  size = 'md',
  glass = false,
  leadingIcon,
  trailingIcon,
  type = 'button',
  className,
}: GhostButtonProps) {
  const classes = cn(
    baseClasses,
    sizeClasses[size],
    glass ? 'glass-btn' : 'ghost-border bg-transparent',
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {leadingIcon && (
        <span className="font-material text-xl">{leadingIcon}</span>
      )}
      {label}
      {trailingIcon && (
        <span className="font-material text-xl">{trailingIcon}</span>
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  )
}
