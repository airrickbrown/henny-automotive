import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  arrow_forward: ArrowRight,
}

interface IgnitionButtonProps {
  label: string
  onClick?: () => void
  href?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  trailingIcon?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'px-6 py-2 text-xs',
  md: 'px-8 py-4 text-sm',
  lg: 'px-10 py-5 text-base',
}

const baseClasses =
  'bg-ignition font-headline font-black uppercase tracking-widest text-white rounded inline-flex items-center justify-center gap-2 ignition-glow hover:-translate-y-0.5 active:scale-95 transition-all duration-150'

export default function IgnitionButton({
  label,
  onClick,
  href,
  size = 'md',
  fullWidth = false,
  trailingIcon,
  type = 'button',
  disabled = false,
  className,
}: IgnitionButtonProps) {
  const classes = cn(
    baseClasses,
    sizeClasses[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  const content = (
    <>
      {label}
      {trailingIcon && (() => {
        const Icon = ICON_MAP[trailingIcon]
        return Icon ? <Icon size={20} /> : null
      })()}
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
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  )
}
