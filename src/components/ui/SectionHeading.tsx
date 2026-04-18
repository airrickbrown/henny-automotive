import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'display'
  className?: string
}

const sizeClasses: Record<NonNullable<SectionHeadingProps['size']>, string> = {
  sm:      'text-3xl',
  md:      'text-5xl',
  lg:      'text-6xl',
  xl:      'text-7xl',
  display: 'text-9xl',
}

export default function SectionHeading({
  children,
  as: Tag = 'h2',
  size = 'md',
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        'font-headline font-black kinetic text-white uppercase leading-none',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  )
}
