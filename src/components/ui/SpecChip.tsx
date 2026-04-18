import { cn } from '../../lib/utils'

interface SpecChipProps {
  label: string
  className?: string
}

export default function SpecChip({ label, className }: SpecChipProps) {
  return (
    <span
      className={cn(
        'inline-block py-1 px-3 ghost-border font-label text-[10px] font-bold uppercase tracking-widest text-on-surface',
        className
      )}
    >
      {label}
    </span>
  )
}
