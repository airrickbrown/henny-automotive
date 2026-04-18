import { cn } from '../../lib/utils'
import { buildWhatsAppUrl } from '../../lib/tokens'

interface WhatsAppButtonProps {
  label: string
  message?: string
  fullWidth?: boolean
  size?: 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-5 text-base',
}

export default function WhatsAppButton({
  label,
  message,
  fullWidth = false,
  size = 'md',
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'bg-secondary text-on-secondary font-headline font-bold uppercase tracking-widest rounded inline-flex items-center justify-center gap-2 transition-all duration-150 hover:brightness-105 active:scale-95',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      <span className="font-material-filled text-xl">chat</span>
      {label}
    </a>
  )
}
