import { cn } from '../../lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'block font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary-container',
        className
      )}
    >
      {children}
    </span>
  )
}
